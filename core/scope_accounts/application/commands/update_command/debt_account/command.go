package debt_account

import (
	"context"
	"errors"
	"financo/core/scope_accounts/domain/brokers"
	"financo/core/scope_accounts/domain/messages"
	"financo/core/scope_accounts/domain/repositories"
	"financo/core/scope_accounts/domain/requests"
	"financo/core/scope_accounts/domain/responses"
	"financo/lib/nullable"
	"financo/models/account"
	"financo/models/transaction"
	"financo/server/types/commands"
	"time"
)

type command struct {
	req    requests.Update
	repo   repositories.UpdateAccountWithHistoryRepository
	broker brokers.UpdatedBroker
}

func New(
	req requests.Update,
	repo repositories.UpdateAccountWithHistoryRepository,
	broker brokers.UpdatedBroker,
) commands.Command[responses.Detailed] {
	return &command{
		req:    req,
		repo:   repo,
		broker: broker,
	}
}

func (c *command) Run(ctx context.Context) (responses.Detailed, error) {
	var (
		res     responses.Detailed
		history nullable.Type[transaction.Record]

		timestamp = time.Now().UTC()
		record    = requests.UpdateToAccountRecord(c.req, timestamp)
	)

	if record.Kind == account.DebtCredit && record.Capital < 0 {
		record.Capital = -record.Capital
	}

	records, err := c.repo.FindWithHistory(ctx, record.ID)
	if err != nil {
		return res, err
	}

	if records.Record.Kind != record.Kind {
		return res, errors.New("update_command: account's kind can't be changed")
	}

	record.CreatedAt = records.Record.CreatedAt
	history = requests.UpdateHistoryToTransactionRecord(c.req.History, records, timestamp)

	if history.Valid && records.Transaction.Valid {
		history.Val.ID = records.Transaction.Val.ID
	}

	res, err = c.repo.SaveWithHistory(ctx, repositories.SaveAccountWithHistoryArgs{
		Record:      record,
		History:     records.History,
		Transaction: history,
	})
	if err != nil {
		return res, err
	}

	err = c.broker.Publish(messages.Updated{
		Previous: records.Record,
		Current:  record,
	})
	if err != nil {
		return res, err
	}

	return res, nil
}
