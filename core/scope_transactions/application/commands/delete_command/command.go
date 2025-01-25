package delete_command

import (
	"context"
	"financo/core/domain/commands"
	"financo/core/scope_transactions/domain/brokers"
	"financo/core/scope_transactions/domain/messages"
	"financo/core/scope_transactions/domain/repositories"
	"financo/core/scope_transactions/domain/requests"
	"financo/core/scope_transactions/domain/responses"
	"financo/lib/nullable"
	"time"
)

type command struct {
	req          requests.Delete
	trRepo       repositories.TransactionRepository
	deleteRepo   repositories.DeleteTransactionRepository
	detailedRepo repositories.DetailedTransactionRepository
	broker       brokers.Deleted
}

func New(
	req requests.Delete,
	trRepo repositories.TransactionRepository,
	deleteRepo repositories.DeleteTransactionRepository,
	detailedRepo repositories.DetailedTransactionRepository,
	broker brokers.Deleted,
) commands.Command[responses.Detailed] {
	return &command{
		req:          req,
		trRepo:       trRepo,
		deleteRepo:   deleteRepo,
		detailedRepo: detailedRepo,
		broker:       broker,
	}
}

func (c *command) Run(ctx context.Context) (responses.Detailed, error) {
	var (
		timestamp = time.Now().UTC()

		res responses.Detailed
	)

	record, err := c.trRepo.Find(ctx, c.req.ID)
	if err != nil {
		return res, err
	}

	record.DeletedAt = nullable.New(timestamp)
	record.UpdatedAt = timestamp

	err = c.deleteRepo.SoftDelete(ctx, record)
	if err != nil {
		return res, err
	}

	err = c.broker.Publish(messages.Deleted{Record: record})
	if err != nil {
		return res, err
	}

	res, err = c.detailedRepo.FindSoftDeleted(ctx, record.ID)
	if err != nil {
		return res, err
	}

	return res, nil
}
