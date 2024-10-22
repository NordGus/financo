package capital_account

import (
	"context"
	"errors"
	"financo/core/scope_accounts/domain/brokers"
	"financo/core/scope_accounts/domain/messages"
	"financo/core/scope_accounts/domain/repositories"
	"financo/core/scope_accounts/domain/requests"
	"financo/core/scope_accounts/domain/responses"
	"financo/server/types/commands"
	"financo/server/types/generic/nullable"
	"financo/server/types/records/account"
	"financo/server/types/records/transaction"
	"time"
)

type command struct {
	req    requests.Update
	repo   repositories.UpdateAccountRepository
	broker brokers.UpdatedBroker
}

func New(
	req requests.Update,
	repo repositories.UpdateAccountRepository,
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
		record    = account.Record{
			ID:          c.req.ID,
			Kind:        c.req.Kind,
			Currency:    c.req.Currency,
			Name:        c.req.Name,
			Description: c.req.Description,
			Capital:     0,
			Color:       c.req.Color,
			Icon:        c.req.Icon,
			UpdatedAt:   timestamp,
		}
	)

	if c.req.Archive {
		record.ArchivedAt = nullable.New(timestamp)
	}

	records, err := c.repo.FindAccountWithHistory(ctx, record.ID)
	if err != nil {
		return res, err
	}

	if records.Record.Kind != record.Kind {
		return res, errors.New("update_command: account's kind can't be changed")
	}

	record.CreatedAt = records.Record.CreatedAt
	history = c.mapHistoryTransaction(records)

	res, err = c.repo.SaveAccountWithHistory(ctx, repositories.SaveAccountWithHistoryArgs{
		Record:      record,
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

func (c *command) mapHistoryTransaction(records repositories.AccountWithHistory) nullable.Type[transaction.Record] {
	if !c.req.History.Present {
		return nullable.Type[transaction.Record]{}
	}

	timestamp := time.Now().UTC()
	tr := transaction.Record{
		SourceID:     records.Record.ID,
		TargetID:     records.History.ID,
		SourceAmount: c.req.History.Balance.Val,
		TargetAmount: c.req.History.Balance.Val,
		IssuedAt:     c.req.History.At.Val,
		ExecutedAt:   c.req.History.At,
		UpdatedAt:    timestamp,
		CreatedAt:    timestamp,
	}

	if tr.SourceAmount < 0 {
		tr.SourceID, tr.TargetID = tr.TargetID, tr.SourceID
		tr.SourceAmount = -tr.SourceAmount
		tr.TargetAmount = -tr.TargetAmount
	}

	return nullable.New(tr)
}
