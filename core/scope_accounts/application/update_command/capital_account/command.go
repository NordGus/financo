package capital_account

import (
	"context"
	"errors"
	"financo/core/scope_accounts/domain/brokers"
	"financo/core/scope_accounts/domain/repositories"
	"financo/core/scope_accounts/domain/requests"
	"financo/core/scope_accounts/domain/responses"
	"financo/server/types/commands"
)

type command struct {
	req    requests.Update
	repo   repositories.UpdateAccountRepository
	broker brokers.UpdatedBroker
}

func New(
	req requests.Update,
	repo repositories.UpdateAccountRepository,
	broker brokers.UpdatedBroker,
) commands.Command[responses.Detailed] {
	return &command{
		req:    req,
		repo:   repo,
		broker: broker,
	}
}

func (c *command) Run(ctx context.Context) (responses.Detailed, error) {
	return responses.Detailed{}, errors.New("update_capital_account: not implemented")
}
