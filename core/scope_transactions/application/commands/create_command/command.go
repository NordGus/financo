package create_command

import (
	"context"
	"errors"
	"financo/core/domain/commands"
	core_repos "financo/core/domain/repositories"
	"financo/core/scope_transactions/domain/brokers"
	errs "financo/core/scope_transactions/domain/errors"
	"financo/core/scope_transactions/domain/messages"
	"financo/core/scope_transactions/domain/repositories"
	"financo/core/scope_transactions/domain/requests"
	"financo/core/scope_transactions/domain/responses"
	"financo/lib/matematiko"
	"financo/models/account"
	"financo/models/transaction"
	"time"
)

type command struct {
	req      requests.Create
	accounts core_repos.Account
	create   repositories.CreateTransactionRepository
	broker   brokers.Created
}

func New(
	req requests.Create,
	accounts core_repos.Account,
	create repositories.CreateTransactionRepository,
	broker brokers.Created,
) commands.Command[responses.Detailed] {
	return &command{
		req:      req,
		accounts: accounts,
		create:   create,
		broker:   broker,
	}
}

func (c *command) Run(ctx context.Context) (responses.Detailed, error) {
	var (
		timestamp = time.Now().UTC()

		source account.Record
		target account.Record
		res    responses.Detailed
	)

	record, err := c.req.ToTransactionRecord(timestamp)
	if err != nil {
		return res, errors.Join(errors.New("create_command: failed to parse request"), err)
	}

	if record.SourceID == record.TargetID {
		return res, errs.ErrCircularTransaction
	}

	if len(record.Notes.Val) > 1_000 {
		return res, errs.ErrTransactionNotesTooLong
	}

	if record.SourceAmount == 0 || record.TargetAmount == 0 {
		return res, errs.ErrTransactionAmountZero
	}

	source, err = c.accounts.Find(ctx, record.SourceID)
	if err != nil {
		return res, err
	}

	target, err = c.accounts.Find(ctx, record.TargetID)
	if err != nil {
		return res, err
	}

	if target.Currency == source.Currency {
		record.TargetAmount = record.SourceAmount
	}

	// Flip the transaction if the any of the amounts are negative
	if record.SourceAmount < 0 || record.TargetAmount < 0 {
		targetAmount := matematiko.Abs(record.TargetAmount)
		sourceAmount := matematiko.Abs(record.SourceAmount)

		record.SourceAmount = targetAmount
		record.TargetAmount = sourceAmount

		record.SourceID, record.TargetID = record.TargetID, record.SourceID
		record.SourceAmount, record.TargetAmount = record.TargetAmount, record.SourceAmount

		switch record.Metadata.Kind {
		case transaction.Expense:
			record.Metadata.Kind = transaction.Income
		case transaction.Income:
			record.Metadata.Kind = transaction.Expense
		}
	}

	record, err = c.create.Save(ctx, record)
	if err != nil {
		return res, err
	}

	err = c.broker.Publish(messages.Created{Record: record})
	if err != nil {
		return res, err
	}

	return responses.RecordToDetailed(record), nil
}
