package update_command

import (
	"context"
	"financo/core/domain/commands"
	"financo/core/domain/primitives/date"
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
	req          requests.Update
	update       repositories.UpdateAccountRepository
	transactions repositories.TransactionsRepository
	broker       brokers.Updated
}

func New(
	req requests.Update,
	update repositories.UpdateAccountRepository,
	transactions repositories.TransactionsRepository,
	broker brokers.Updated,
) commands.Command[responses.Listed] {
	return &command{
		req:          req,
		update:       update,
		transactions: transactions,
		broker:       broker,
	}
}

func (c *command) Run(ctx context.Context) (responses.Listed, error) {
	var (
		timestamp = time.Now().UTC()

		res responses.Listed
	)

	// Retrieve the previous state for the account
	prev, err := c.update.Find(ctx, c.req.ID)
	if err != nil {
		return res, err
	}

	// Map the current state over the previous state
	current := repositories.UpdateAccountState{
		Record:      c.req.Record(prev.Record, timestamp),
		History:     c.req.HistoryRecord(prev.History, timestamp),
		Transaction: c.req.HistoryTransaction(prev.Transaction, timestamp),
	}

	// Prevents the creation of a zero capital debt in the system.
	if account.IsPassive(current.Record.Kind) && current.Record.Capital == 0 {
		return res, fmt.Errorf(
			"update_command: invalid capital %d for kind %s, reason: can't be zero",
			current.Record.Capital,
			current.Record.Kind,
		)
	}

	// Retrieve the account balance excluding the account's history to recalculate
	current.Record.DynamicData.Balance, err = c.transactions.BalanceWithoutHistoryFor(ctx, current.Record.ID)
	if err != nil {
		return res, err
	}

	// Retrieve the account transaction count excluding the account's history to recalculate
	current.Record.DynamicData.Transactions, err = c.transactions.CountWithoutHistoryFor(ctx, current.Record.ID)
	if err != nil {
		return res, err
	}

	// Fill the account balance for loans and credit full in case the account does
	// not have an incomplete ledger. By doing this the debt is filled with
	// capital for the user to transfer to the expected account.
	if (account.IsCredit(current.Record.Kind) || account.IsDebt(current.Record.Kind)) && !c.req.History.At.Valid {
		c.req.History.At = nullable.New(date.New(current.Record.CreatedAt))
		c.req.History.Balance = nullable.New(current.Record.Capital * -1)

		current.Record.DynamicData.History.At = nullable.New(c.req.History.At.Val.ToTime())
		current.Record.DynamicData.History.Balance = c.req.History.Balance

		current.History.DynamicData.Balance = current.Record.Capital
		current.History.DynamicData.Transactions = 1

		current.Transaction.DeletedAt = nullable.Type[time.Time]{}
		current.Transaction.SourceAmount = c.req.History.Balance.Val
		current.Transaction.TargetAmount = c.req.History.Balance.Val
		current.Transaction.IssuedAt = c.req.History.At.Val.ToTime()
		current.Transaction.ExecutedAt = nullable.New(c.req.History.At.Val.ToTime())
	}

	// Add the current history balance from the request
	current.Record.DynamicData.Balance += c.req.History.Balance.OrElse(0)

	// add the history transaction if the request has a valid History At value
	if c.req.History.At.Valid {
		current.Record.DynamicData.Transactions += 1
	}

	// determine transaction direction
	if c.req.History.Balance.Val >= 0 {
		current.Transaction.SourceID = current.History.ID
		current.Transaction.TargetID = current.Record.ID
	}

	if c.req.History.Balance.Val < 0 {
		current.Transaction.SourceID = current.Record.ID
		current.Transaction.TargetID = current.History.ID
		current.Transaction.SourceAmount = current.Transaction.SourceAmount * -1
		current.Transaction.TargetAmount = current.Transaction.TargetAmount * -1
	}

	// Persist the current state
	err = c.update.Save(ctx, current)
	if err != nil {
		return res, err
	}

	// Publish the message that the account has been updated
	err = c.broker.Publish(messages.Updated{Current: current.Record, Previous: prev.Record})
	if err != nil {
		return res, err
	}

	return responses.AccountRecordToListed(current.Record), nil
}
