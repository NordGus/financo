package on_transaction_deleted

import (
	"context"
	"financo/core/domain/event_handlers"
	"financo/core/scope_accounts/domain/repositories"
	"financo/core/scope_transactions/domain/messages"
	"financo/models/account"
	"time"
)

type handler struct {
	accountRepo      repositories.AccountRepository
	transactionsRepo repositories.TransactionsRepository
	repo             repositories.UpdateDynamicDataRepository
}

func New(
	accountRepo repositories.AccountRepository,
	transactionsRepo repositories.TransactionsRepository,
	repo repositories.UpdateDynamicDataRepository,
) event_handlers.EventHandler[messages.Deleted] {
	return &handler{
		accountRepo:      accountRepo,
		transactionsRepo: transactionsRepo,
		repo:             repo,
	}
}

func (h *handler) Handle(event messages.Deleted) error {
	var (
		ctx       = context.Background()
		timestamp = time.Now().UTC()
	)

	source, err := h.accountRepo.Find(ctx, event.Record.SourceID)
	if err != nil {
		return err
	}

	target, err := h.accountRepo.Find(ctx, event.Record.TargetID)
	if err != nil {
		return err
	}

	ids := []int64{source.ID, target.ID}

	balances, err := h.transactionsRepo.BalanceFor(ctx, ids)
	if err != nil {
		return err
	}

	counts, err := h.transactionsRepo.CountFor(ctx, ids)
	if err != nil {
		return err
	}

	source.UpdatedAt = timestamp
	source.DynamicData.Balance = balances[source.ID]
	source.DynamicData.Transactions = counts[source.ID]

	target.UpdatedAt = timestamp
	target.DynamicData.Balance = balances[target.ID]
	target.DynamicData.Transactions = counts[target.ID]

	err = h.repo.Save(ctx, []account.Record{source, target})
	if err != nil {
		return err
	}

	return nil
}
