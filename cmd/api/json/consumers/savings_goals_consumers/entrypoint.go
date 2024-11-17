package savings_goals_consumers

import (
	acc_msg "financo/core/scope_accounts/domain/messages"
	accounts_broker "financo/core/scope_accounts/infrastructure/broker_handler"
	"financo/core/scope_savings_goals/infrastructure/consumers/on_account_created"
	"financo/core/scope_savings_goals/infrastructure/consumers/on_account_deleted"
	"financo/core/scope_savings_goals/infrastructure/consumers/on_account_updated"
	"financo/core/scope_savings_goals/infrastructure/consumers/on_transaction_created"
	tr_msg "financo/core/scope_transactions/domain/messages"
	transactions_broker "financo/core/scope_transactions/infrastructure/broker_handler"
	bus "financo/lib/message_bus"
)

func Subscribe() error {
	accounts, err := accounts_broker.Instance()
	if err != nil {
		return err
	}

	transactions, err := transactions_broker.Instance()
	if err != nil {
		return err
	}

	err = accounts.CreatedBroker().Subscribe(
		bus.ConsumerFunc[acc_msg.Created](on_account_created.NewInMemory),
	)
	if err != nil {
		return err
	}

	err = accounts.DeletedBroker().Subscribe(
		bus.ConsumerFunc[acc_msg.Deleted](on_account_deleted.NewInMemory),
	)
	if err != nil {
		return err
	}

	err = accounts.UpdatedBroker().Subscribe(
		bus.ConsumerFunc[acc_msg.Updated](on_account_updated.NewInMemory),
	)
	if err != nil {
		return err
	}

	err = transactions.CreatedBroker().Subscribe(
		bus.ConsumerFunc[tr_msg.Created](on_transaction_created.NewInMemory),
	)
	if err != nil {
		return err
	}

	return nil
}
