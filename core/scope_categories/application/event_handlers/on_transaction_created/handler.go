package on_transaction_created

import (
	"context"
	"financo/core/domain/event_handlers"
	"financo/core/scope_categories/domain/models/category"
	"financo/core/scope_categories/domain/repositories"
	"financo/core/scope_transactions/domain/messages"
	"time"
)

type handler struct {
	accountRepo      repositories.CategoryRepository
	transactionsRepo repositories.TransactionsRepository
	repo             repositories.UpdateDynamicDataRepository
}

func New(
	accountRepo repositories.CategoryRepository,
	transactionsRepo repositories.TransactionsRepository,
	repo repositories.UpdateDynamicDataRepository,
) event_handlers.EventHandler[messages.Created] {
	return &handler{
		accountRepo:      accountRepo,
		transactionsRepo: transactionsRepo,
		repo:             repo,
	}
}

func (h *handler) Handle(event messages.Created) error {
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

	ids := []int64{source.Account.ID, target.Account.ID}

	counts, err := h.transactionsRepo.CountFor(ctx, ids)
	if err != nil {
		return err
	}

	source.Account.UpdatedAt = timestamp
	source.Account.DynamicData.Transactions = counts[source.Account.ID]

	target.Account.UpdatedAt = timestamp
	target.Account.DynamicData.Transactions = counts[target.Account.ID]

	err = h.repo.Save(ctx, []category.Record{source, target})
	if err != nil {
		return err
	}

	return nil
}
