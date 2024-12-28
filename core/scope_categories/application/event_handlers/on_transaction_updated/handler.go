package on_transaction_updated

import (
	"context"
	"financo/core/domain/event_handlers"
	"financo/core/scope_categories/domain/models/category"
	"financo/core/scope_categories/domain/repositories"
	"financo/core/scope_transactions/domain/messages"
	"time"
)

type handler struct {
	categoryRepo     repositories.CategoryRepository
	transactionsRepo repositories.TransactionsRepository
	repo             repositories.UpdateDynamicDataRepository
}

func New(
	categoryRepo repositories.CategoryRepository,
	transactionsRepo repositories.TransactionsRepository,
	repo repositories.UpdateDynamicDataRepository,
) event_handlers.EventHandler[messages.Updated] {
	return &handler{
		categoryRepo:     categoryRepo,
		transactionsRepo: transactionsRepo,
		repo:             repo,
	}
}

func (h *handler) Handle(event messages.Updated) error {
	var (
		ctx       = context.Background()
		timestamp = time.Now().UTC()
		ids       = make([]int64, 0, 4)
		update    = make([]category.Record, 0, 4)
	)

	prevSource, err := h.categoryRepo.Find(ctx, event.Previous.SourceID)
	if err != nil {
		return err
	}

	prevTarget, err := h.categoryRepo.Find(ctx, event.Previous.TargetID)
	if err != nil {
		return err
	}

	source, err := h.categoryRepo.Find(ctx, event.Current.SourceID)
	if err != nil {
		return err
	}

	target, err := h.categoryRepo.Find(ctx, event.Current.TargetID)
	if err != nil {
		return err
	}

	if prevSource.Account.ID > 0 {
		ids = append(ids, prevSource.Account.ID)
	}

	if prevTarget.Account.ID > 0 {
		ids = append(ids, prevSource.Account.ID)
	}

	if source.Account.ID > 0 {
		ids = append(ids, source.Account.ID)
	}

	if target.Account.ID > 0 {
		ids = append(ids, target.Account.ID)
	}

	counts, err := h.transactionsRepo.CountFor(ctx, ids)
	if err != nil {
		return err
	}

	if prevSource.Account.ID > 0 {
		prevSource.Account.UpdatedAt = timestamp
		prevSource.Account.DynamicData.Transactions = counts[prevSource.Account.ID]

		update = append(update, prevSource)
	}

	if prevTarget.Account.ID > 0 {
		prevTarget.Account.UpdatedAt = timestamp
		prevTarget.Account.DynamicData.Transactions = counts[prevTarget.Account.ID]

		update = append(update, prevTarget)
	}

	if source.Account.ID > 0 {
		source.Account.UpdatedAt = timestamp
		source.Account.DynamicData.Transactions = counts[source.Account.ID]

		update = append(update, source)
	}

	if target.Account.ID > 0 {
		target.Account.UpdatedAt = timestamp
		target.Account.DynamicData.Transactions = counts[target.Account.ID]

		update = append(update, target)
	}

	err = h.repo.Save(ctx, update)
	if err != nil {
		return err
	}

	return nil
}
