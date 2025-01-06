package create_command

import (
	"context"
	"financo/core/domain/commands"
	"financo/core/scope_accounts/domain/brokers"
	"financo/core/scope_accounts/domain/messages"
	"financo/core/scope_accounts/domain/repositories"
	"financo/core/scope_accounts/domain/requests"
	"financo/core/scope_accounts/domain/responses"
	"financo/lib/nullable"
	"financo/models/account"
	"fmt"
	"time"
)

type command struct {
	req    requests.Create
	repo   repositories.CreateAccountRepository
	broker brokers.Created
}

func New(
	req requests.Create, repo repositories.CreateAccountRepository, broker brokers.Created,
) commands.Command[responses.Created] {
	return &command{
		req:    req,
		repo:   repo,
		broker: broker,
	}
}

func (c *command) Run(ctx context.Context) (responses.Created, error) {
	if account.IsExternal(c.req.Kind) {
		return responses.Created{}, fmt.Errorf("create_command: invalid account kind %s", c.req.Kind)
	}

	var (
		timestamp = time.Now().UTC()
		args      = repositories.CreateAccountSaveArgs{
			Record:             c.req.Record(timestamp),
			History:            c.req.HistoryRecord(timestamp),
			HistoryTransaction: c.req.HistoryTransaction(timestamp),
			Interest:           c.req.Interest(timestamp),
		}
	)

	// Prevents the creation of a zero capital debt in the system.
	if account.IsDebt(args.Record.Kind) && args.Record.Capital == 0 {
		return responses.Created{}, fmt.Errorf(
			"create_command: invalid capital %d for kind %s, reason: can't be zero",
			c.req.Capital,
			c.req.Kind,
		)
	}

	// Fill the account balance for loans and credit full in case the account does
	// not have an incomplete ledger. By doing this the debt is filled with
	// capital for the user to transfer to the expected account.
	if (account.IsCredit(args.Record.Kind) || account.IsLoan(args.Record.Kind)) && !c.req.History.At.Valid {
		args.Record.DynamicData.Balance = args.Record.Capital * -1
		args.Record.DynamicData.History = account.HistoryDynamicData{
			At:      nullable.New(timestamp),
			Balance: nullable.New(args.Record.DynamicData.Balance),
		}

		args.History.DynamicData.Balance = args.Record.Capital
		args.History.DynamicData.Transactions = 1

		args.HistoryTransaction.DeletedAt = nullable.Type[time.Time]{}
		args.HistoryTransaction.SourceAmount = args.Record.Capital * -1
		args.HistoryTransaction.TargetAmount = args.Record.Capital * -1
		args.HistoryTransaction.IssuedAt = timestamp
		args.HistoryTransaction.ExecutedAt = nullable.New(timestamp)
	}

	record, err := c.repo.Save(ctx, args)
	if err != nil {
		return responses.Created{}, err
	}

	err = c.broker.Publish(messages.Created{Record: record})
	if err != nil {
		return responses.Created{}, err
	}

	return responses.Created{
		ID:    record.ID,
		Name:  record.Name,
		Kind:  record.Kind,
		Color: record.Color,
		Icon:  record.Icon,
	}, nil
}
