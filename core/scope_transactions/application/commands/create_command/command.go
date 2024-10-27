package create_command

import (
	"context"
	"financo/core/domain/commands"
	"financo/core/scope_transactions/domain/brokers"
	"financo/core/scope_transactions/domain/errors"
	"financo/core/scope_transactions/domain/messages"
	"financo/core/scope_transactions/domain/repositories"
	"financo/core/scope_transactions/domain/requests"
	"financo/core/scope_transactions/domain/responses"
	"financo/lib/nullable"
	"financo/models/account"
	"time"
)

type command struct {
	req          requests.Create
	accountRepo  repositories.AccountRepository
	createRepo   repositories.CreateTransactionRepository
	detailedRepo repositories.DetailedTransactionRepository
	broker       brokers.CreatedBroker
}

func New(
	req requests.Create,
	accountRepo repositories.AccountRepository,
	createRepo repositories.CreateTransactionRepository,
	detailedRepo repositories.DetailedTransactionRepository,
	broker brokers.CreatedBroker,
) commands.Command[responses.Detailed] {
	return &command{
		req:          req,
		accountRepo:  accountRepo,
		createRepo:   createRepo,
		detailedRepo: detailedRepo,
		broker:       broker,
	}
}

func (c *command) Run(ctx context.Context) (responses.Detailed, error) {
	var (
		timestamp = time.Now().UTC()
		record    = c.req.ToTransactionRecord(timestamp)

		source account.Record
		target account.Record
		res    responses.Detailed
	)

	if record.SourceID == record.TargetID {
		return res, errors.ErrCircularTransaction
	}

	source, err := c.accountRepo.Find(ctx, record.SourceID)
	if err != nil {
		return res, err
	}

	target, err = c.accountRepo.Find(ctx, record.TargetID)
	if err != nil {
		return res, err
	}

	if target.Currency == source.Currency {
		record.TargetAmount = record.SourceAmount
	}

	if record.ExecutedAt.Valid {
		record.ExecutedAt = nullable.New(record.ExecutedAt.Val.UTC())
	}

	record, err = c.createRepo.Save(ctx, record)
	if err != nil {
		return res, err
	}

	err = c.broker.Publish(messages.Created{Record: record})
	if err != nil {
		return res, err
	}

	res, err = c.detailedRepo.Find(ctx, record.ID)
	if err != nil {
		return res, err
	}

	return res, nil
}
