package update_command

import (
	"context"
	"financo/core/domain/commands"
	"financo/core/scope_accounts/domain/brokers"
	"financo/core/scope_accounts/domain/messages"
	"financo/core/scope_accounts/domain/repositories"
	"financo/core/scope_accounts/domain/requests"
	"financo/core/scope_accounts/domain/responses"
	"time"
)

type command struct {
	req              requests.Update
	repo             repositories.UpdateAccountRepository
	transactionsRepo repositories.TransactionsRepository
	broker           brokers.Updated
}

func New(
	req requests.Update,
	repo repositories.UpdateAccountRepository,
	transactionsRepo repositories.TransactionsRepository,
	broker brokers.Updated,
) commands.Command[responses.Updated] {
	return &command{
		req:              req,
		repo:             repo,
		transactionsRepo: transactionsRepo,
		broker:           broker,
	}
}

func (c *command) Run(ctx context.Context) (responses.Updated, error) {
	var (
		timestamp = time.Now().UTC()

		res responses.Updated
	)

	// Retrieve the previous state for the account
	prev, err := c.repo.Find(ctx, c.req.ID)
	if err != nil {
		return res, err
	}

	// Map the current state over the previous state
	current := repositories.UpdateAccountState{
		Record:      c.req.Record(prev.Record, timestamp),
		History:     c.req.HistoryRecord(prev.History, timestamp),
		Transaction: c.req.HistoryTransaction(prev.Transaction, timestamp),
	}

	// Retrieve the account balance excluding the account's history to recalculate
	current.Record.DynamicData.Balance, err = c.transactionsRepo.BalanceWithoutHistoryFor(ctx, current.Record.ID)
	if err != nil {
		return res, err
	}

	// Add the current history balance from the request
	current.Record.DynamicData.Balance += c.req.History.Balance.OrElse(0)

	// Retrieve the account transaction count excluding the account's history to recalculate
	current.Record.DynamicData.Transactions, err = c.transactionsRepo.CountWithoutHistoryFor(ctx, current.Record.ID)
	if err != nil {
		return res, err
	}

	// add the history transaction if the request has a valid History At value
	if c.req.History.At.Valid {
		current.Record.DynamicData.Transactions += 1
	}

	// determine transaction direction
	if c.req.History.Balance.Val >= 0 {
		current.Transaction.SourceID = current.History.ID
		current.Transaction.TargetAmount = current.Record.ID
	}

	if c.req.History.Balance.Val < 0 {
		current.Transaction.SourceID = current.Record.ID
		current.Transaction.TargetAmount = current.History.ID
		current.Transaction.SourceAmount = current.Transaction.SourceAmount * -1
		current.Transaction.TargetAmount = current.Transaction.TargetAmount * -1
	}

	// Persist the current state
	err = c.repo.Save(ctx, current)
	if err != nil {
		return res, err
	}

	// Publish the message that the account has been updated
	err = c.broker.Publish(messages.Updated{Current: current.Record, Previous: prev.Record})
	if err != nil {
		return res, err
	}

	return responses.Updated{
		ID:    current.Record.ID,
		Name:  current.Record.Name,
		Kind:  current.Record.Kind,
		Color: current.Record.Color,
		Icon:  current.Record.Icon,
	}, nil
}
