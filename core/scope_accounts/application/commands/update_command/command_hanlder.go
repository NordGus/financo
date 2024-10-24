package update_command

import (
	"errors"
	"financo/core/domain/records/account"
	"financo/core/scope_accounts/application/commands/update_command/capital_account"
	"financo/core/scope_accounts/application/commands/update_command/debt_account"
	"financo/core/scope_accounts/application/commands/update_command/external_account"
	"financo/core/scope_accounts/domain/brokers"
	"financo/core/scope_accounts/domain/repositories"
	"financo/core/scope_accounts/domain/requests"
	"financo/core/scope_accounts/domain/responses"
	"financo/server/types/commands"
)

func New(
	req requests.Update,
	repo repositories.UpdateAccountRepository,
	broker brokers.UpdatedBroker,
) (commands.Command[responses.Detailed], error) {
	switch req.Kind {
	case account.CapitalNormal, account.CapitalSavings:
		return capital_account.New(req, repo, broker), nil
	case account.DebtCredit, account.DebtLoan, account.DebtPersonal:
		return debt_account.New(req, repo, broker), nil
	case account.ExternalExpense, account.ExternalIncome:
		return external_account.New(req, repo, broker), nil
	default:
		return nil, errors.New("update_command: invalid account kind")
	}
}
