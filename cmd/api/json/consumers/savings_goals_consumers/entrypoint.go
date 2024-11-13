package savings_goals_consumers

import (
	account_messages "financo/core/scope_accounts/domain/messages"
	accounts_broker "financo/core/scope_accounts/infrastructure/broker_handler"
	"financo/core/scope_savings_goals/infrastructure/consumers/on_account_created"
	"financo/lib/message_bus"
)

func Subscribe() error {
	accounts, err := accounts_broker.Instance()
	if err != nil {
		return err
	}

	err = accounts.CreatedBroker().Subscribe(
		message_bus.ConsumerFunc[account_messages.Created](on_account_created.NewInMemory),
	)
	if err != nil {
		return err
	}

	return nil
}
