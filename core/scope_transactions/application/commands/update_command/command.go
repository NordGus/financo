package update_command

import (
	"context"
	"financo/core/domain/commands"
	core_repos "financo/core/domain/repositories"
	"financo/core/scope_transactions/domain/brokers"
	"financo/core/scope_transactions/domain/errors"
	"financo/core/scope_transactions/domain/messages"
	"financo/core/scope_transactions/domain/repositories"
	"financo/core/scope_transactions/domain/requests"
	"financo/core/scope_transactions/domain/responses"
	"financo/models/account"
	"financo/models/transaction"
	"time"
)

type command struct {
	req             requests.Update
	accountRepo     core_repos.Account
	transactionRepo repositories.TransactionRepository
	updateRepo      repositories.UpdateTransactionRepository
	detailedRepo    repositories.DetailedTransactionRepository
	broker          brokers.Updated
}

func New(
	req requests.Update,
	accountRepo core_repos.Account,
	transactionRepo repositories.TransactionRepository,
	updateRepo repositories.UpdateTransactionRepository,
	detailedRepo repositories.DetailedTransactionRepository,
	broker brokers.Updated,
) commands.Command[responses.Detailed] {
	return &command{
		req:             req,
		accountRepo:     accountRepo,
		transactionRepo: transactionRepo,
		updateRepo:      updateRepo,
		detailedRepo:    detailedRepo,
		broker:          broker,
	}
}

func (c *command) Run(ctx context.Context) (responses.Detailed, error) {
	var (
		timestamp = time.Now().UTC()
		record    = c.req.ToTransactionRecord(timestamp)

		previous transaction.Record
		source   account.Record
		target   account.Record
		res      responses.Detailed
	)

	if record.SourceID == record.TargetID {
		return res, errors.ErrCircularTransaction
	}

	previous, err := c.transactionRepo.Find(ctx, record.ID)
	if err != nil {
		return res, err
	}

	record.CreatedAt = previous.CreatedAt

	source, err = c.accountRepo.Find(ctx, record.SourceID)
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

	err = c.updateRepo.Save(ctx, record)
	if err != nil {
		return res, err
	}

	err = c.broker.Publish(messages.Updated{
		Current:  record,
		Previous: previous,
	})
	if err != nil {
		return res, err
	}

	res, err = c.detailedRepo.Find(ctx, record.ID)
	if err != nil {
		return res, err
	}

	return res, nil
}
