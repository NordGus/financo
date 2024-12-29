package accounts

import (
	account_msg "financo/core/scope_accounts/domain/messages"
	"financo/core/scope_accounts/infrastructure/consumers/on_account_deleted"
	"financo/core/scope_accounts/infrastructure/consumers/on_category_deleted"
	"financo/core/scope_accounts/infrastructure/consumers/on_category_updated"
	"financo/core/scope_accounts/infrastructure/consumers/on_transaction_created"
	"financo/core/scope_accounts/infrastructure/consumers/on_transaction_deleted"
	"financo/core/scope_accounts/infrastructure/consumers/on_transaction_updated"
	accounts_broker "financo/core/scope_accounts/infrastructure/services/message_broker"
	category_msg "financo/core/scope_categories/domain/messages"
	categories_broker "financo/core/scope_categories/infrastructure/broker_handler"
	transaction_msg "financo/core/scope_transactions/domain/messages"
	transactions_broker "financo/core/scope_transactions/infrastructure/broker_handler"
	"financo/lib/message_bus"
)

func Subscribe() error {
	accounts, err := accounts_broker.Instance()
	if err != nil {
		return err
	}

	categories, err := categories_broker.Instance()
	if err != nil {
		return err
	}

	transactions, err := transactions_broker.Instance()
	if err != nil {
		return err
	}

	err = accounts.Deleted().Subscribe(
		message_bus.ConsumerFunc[account_msg.Deleted](on_account_deleted.NewInMemory),
	)
	if err != nil {
		return err
	}

	err = categories.DeletedBroker().Subscribe(
		message_bus.ConsumerFunc[category_msg.Deleted](on_category_deleted.NewInMemory),
	)
	if err != nil {
		return err
	}

	err = categories.UpdatedBroker().Subscribe(
		message_bus.ConsumerFunc[category_msg.Updated](on_category_updated.NewInMemory),
	)
	if err != nil {
		return err
	}

	err = transactions.CreatedBroker().Subscribe(
		message_bus.ConsumerFunc[transaction_msg.Created](on_transaction_created.NewInMemory),
	)
	if err != nil {
		return err
	}

	err = transactions.DeletedBroker().Subscribe(
		message_bus.ConsumerFunc[transaction_msg.Deleted](on_transaction_deleted.NewInMemory),
	)
	if err != nil {
		return err
	}

	err = transactions.UpdatedBroker().Subscribe(
		message_bus.ConsumerFunc[transaction_msg.Updated](on_transaction_updated.NewInMemory),
	)
	if err != nil {
		return err
	}

	return nil
}
