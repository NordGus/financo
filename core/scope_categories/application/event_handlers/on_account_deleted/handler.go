package on_account_deleted

import (
	"context"
	"financo/core/domain/event_handlers"
	"financo/core/scope_accounts/domain/messages"
	"financo/core/scope_categories/domain/filters"
	"financo/core/scope_categories/domain/repositories"
	"financo/models/account"
	"time"
)

type handler struct {
	categoryRepo     repositories.CategoriesRepository
	transactionsRepo repositories.TransactionsRepository
	repo             repositories.UpdateDynamicDataRepository
}

func New(
	categoryRepo repositories.CategoriesRepository,
	transactionsRepo repositories.TransactionsRepository,
	repo repositories.UpdateDynamicDataRepository,
) event_handlers.EventHandler[messages.Deleted] {
	return &handler{
		categoryRepo:     categoryRepo,
		transactionsRepo: transactionsRepo,
		repo:             repo,
	}
}

func (h *handler) Handle(event messages.Deleted) error {
	var (
		ctx       = context.Background()
		timestamp = time.Now().UTC()
	)

	records, err := h.categoryRepo.Where(ctx, filters.Categories{
		Kinds: []account.Kind{
			account.Income,
			account.Expense,
		},
	})
	if err != nil {
		return err
	}

	ids := make([]int64, 0, len(records))

	for i := 0; i < len(records); i++ {
		ids = append(ids, records[i].Parent.ID)
		for j := 0; j < len(records[i].Children); j++ {
			ids = append(ids, records[i].Children[j].ID)
		}
	}

	counts, err := h.transactionsRepo.CountFor(ctx, ids)
	if err != nil {
		return err
	}

	for i := 0; i < len(records); i++ {
		records[i].Parent.UpdatedAt = timestamp
		records[i].Parent.DynamicData.Transactions = counts[records[i].Parent.ID]
		for j := 0; j < len(records[i].Children); j++ {
			records[i].Children[j].UpdatedAt = timestamp
			records[i].Children[j].DynamicData.Transactions = counts[records[i].Children[j].ID]
		}
	}

	err = h.repo.Save(ctx, records)
	if err != nil {
		return err
	}

	return nil
}
