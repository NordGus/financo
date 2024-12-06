package create_command

import (
	"context"
	"financo/core/domain/commands"
	"financo/core/scope_accounts/application/commands/create_command/capital_normal_account"
	"financo/core/scope_accounts/application/commands/create_command/capital_savings_account"
	"financo/core/scope_accounts/application/commands/create_command/debt_credit_account"
	"financo/core/scope_accounts/application/commands/create_command/debt_loan_account"
	"financo/core/scope_accounts/application/commands/create_command/debt_personal_account"
	"financo/core/scope_accounts/domain/brokers"
	"financo/core/scope_accounts/domain/repositories"
	"financo/core/scope_accounts/domain/requests"
	"financo/core/scope_accounts/domain/responses"
	"financo/models/account"
	"fmt"
)

type command struct {
	req    requests.Create
	repo   repositories.CreateAccountRepository
	broker brokers.CreatedBroker
}

func New(
	req requests.Create,
	repo repositories.CreateAccountRepository,
	broker brokers.CreatedBroker,
) commands.Command[responses.Created] {
	switch req.Kind {
	case account.CapitalNormal:
		return capital_normal_account.New(req, repo, broker)
	case account.CapitalSavings:
		return capital_savings_account.New(req, repo, broker)
	case account.DebtCredit:
		return debt_credit_account.New(req, repo, broker)
	case account.DebtLoan:
		return debt_loan_account.New(req, repo, broker)
	case account.DebtPersonal:
		return debt_personal_account.New(req, repo, broker)
	default:
		return &command{
			req:    req,
			repo:   repo,
			broker: broker,
		}
	}
}

func (c *command) Run(ctx context.Context) (responses.Created, error) {
	// This is a fallback command to communicate an internal error
	return responses.Created{}, fmt.Errorf("create_command: invalid account kind: %s", c.req.Kind)
}
