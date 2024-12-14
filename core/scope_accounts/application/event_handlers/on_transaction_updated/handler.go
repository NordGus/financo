package on_transaction_updated

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
) event_handlers.EventHandler[messages.Updated] {
	return &handler{
		accountRepo:      accountRepo,
		transactionsRepo: transactionsRepo,
		repo:             repo,
	}
}

func (h *handler) Handle(event messages.Updated) error {
	var (
		ctx       = context.Background()
		timestamp = time.Now().UTC()
	)

	prevSource, err := h.accountRepo.Find(ctx, event.Previous.SourceID)
	if err != nil {
		return err
	}

	prevTarget, err := h.accountRepo.Find(ctx, event.Previous.TargetID)
	if err != nil {
		return err
	}

	source, err := h.accountRepo.Find(ctx, event.Current.SourceID)
	if err != nil {
		return err
	}

	target, err := h.accountRepo.Find(ctx, event.Current.TargetID)
	if err != nil {
		return err
	}

	ids := []int64{source.ID, target.ID, prevSource.ID, prevTarget.ID}

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

	prevSource.UpdatedAt = timestamp
	prevSource.DynamicData.Balance = balances[prevSource.ID]
	prevSource.DynamicData.Transactions = counts[prevSource.ID]

	prevTarget.UpdatedAt = timestamp
	prevTarget.DynamicData.Balance = balances[prevTarget.ID]
	prevTarget.DynamicData.Transactions = counts[prevTarget.ID]

	err = h.repo.Save(ctx, []account.Record{source, target, prevSource, prevTarget})
	if err != nil {
		return err
	}

	return nil
}
