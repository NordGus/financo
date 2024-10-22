package update_account_repository

import (
	"context"
	"errors"
	"financo/core/domain/databases"
	"financo/core/scope_accounts/domain/repositories"
	"financo/core/scope_accounts/domain/responses"
)

type repository struct {
	db databases.SQLAdapter
}

func NewPostgreSQL(db databases.SQLAdapter) repositories.UpdateAccountRepository {
	return &repository{
		db: db,
	}
}

// FindWithChildren implements repositories.UpdateAccountRepository.
func (r *repository) FindWithChildren(ctx context.Context, id int64) (repositories.AccountWithChildren, error) {
	return repositories.AccountWithChildren{}, errors.New("not implemented")
}

// FindWithHistory implements repositories.UpdateAccountRepository.
func (r *repository) FindWithHistory(ctx context.Context, id int64) (repositories.AccountWithHistory, error) {
	return repositories.AccountWithHistory{}, errors.New("not implemented")
}

// SaveWithChildren implements repositories.UpdateAccountRepository.
func (r *repository) SaveWithChildren(
	ctx context.Context,
	args repositories.SaveAccountWithChildrenArgs,
) (responses.Detailed, error) {
	return responses.Detailed{}, errors.New("not implemented")
}

// SaveWithHistory implements repositories.UpdateAccountRepository.
func (r *repository) SaveWithHistory(
	ctx context.Context,
	args repositories.SaveAccountWithHistoryArgs,
) (responses.Detailed, error) {
	return responses.Detailed{}, errors.New("not implemented")
}
