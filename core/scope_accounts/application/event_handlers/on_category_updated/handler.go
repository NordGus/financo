package on_category_updated

import (
	"context"
	"financo/core/domain/event_handlers"
	"financo/core/scope_accounts/domain/filters"
	"financo/core/scope_accounts/domain/repositories"
	"financo/core/scope_categories/domain/messages"
	"financo/models/account"
	"time"
)

type handler struct {
	accountsRepo     repositories.AccountsRepository
	transactionsRepo repositories.TransactionsRepository
	repo             repositories.UpdateDynamicDataRepository
}

func New(
	accountsRepo repositories.AccountsRepository,
	transactionsRepo repositories.TransactionsRepository,
	repo repositories.UpdateDynamicDataRepository,
) event_handlers.EventHandler[messages.Updated] {
	return &handler{
		accountsRepo:     accountsRepo,
		transactionsRepo: transactionsRepo,
		repo:             repo,
	}
}

func (h *handler) Handle(event messages.Updated) error {
	var (
		ctx       = context.Background()
		timestamp = time.Now().UTC()
	)

	records, err := h.accountsRepo.Where(ctx, filters.Accounts{
		Kinds: []account.Kind{
			account.CapitalNormal,
			account.CapitalSavings,
			account.DebtCredit,
			account.DebtLoan,
			account.DebtPersonal,
		},
	})
	if err != nil {
		return err
	}

	ids := make([]int64, len(records))

	for i := 0; i < len(records); i++ {
		ids[i] = records[i].ID
	}

	balances, err := h.transactionsRepo.BalanceFor(ctx, ids)
	if err != nil {
		return err
	}

	counts, err := h.transactionsRepo.CountFor(ctx, ids)
	if err != nil {
		return err
	}

	for i := 0; i < len(records); i++ {
		records[i].UpdatedAt = timestamp
		records[i].DynamicData.Balance = balances[records[i].ID]
		records[i].DynamicData.Transactions = counts[records[i].ID]
	}

	err = h.repo.Save(ctx, records)
	if err != nil {
		return err
	}

	return nil
}
