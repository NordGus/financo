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

	if prevSource.Parent.ID > 0 {
		ids = append(ids, prevSource.Parent.ID)
	}

	if prevTarget.Parent.ID > 0 {
		ids = append(ids, prevSource.Parent.ID)
	}

	if source.Parent.ID > 0 {
		ids = append(ids, source.Parent.ID)
	}

	if target.Parent.ID > 0 {
		ids = append(ids, target.Parent.ID)
	}

	counts, err := h.transactionsRepo.CountFor(ctx, ids)
	if err != nil {
		return err
	}

	if prevSource.Parent.ID > 0 {
		prevSource.Parent.UpdatedAt = timestamp
		prevSource.Parent.DynamicData.Transactions = counts[prevSource.Parent.ID]

		update = append(update, prevSource)
	}

	if prevTarget.Parent.ID > 0 {
		prevTarget.Parent.UpdatedAt = timestamp
		prevTarget.Parent.DynamicData.Transactions = counts[prevTarget.Parent.ID]

		update = append(update, prevTarget)
	}

	if source.Parent.ID > 0 {
		source.Parent.UpdatedAt = timestamp
		source.Parent.DynamicData.Transactions = counts[source.Parent.ID]

		update = append(update, source)
	}

	if target.Parent.ID > 0 {
		target.Parent.UpdatedAt = timestamp
		target.Parent.DynamicData.Transactions = counts[target.Parent.ID]

		update = append(update, target)
	}

	err = h.repo.Save(ctx, update)
	if err != nil {
		return err
	}

	return nil
}
