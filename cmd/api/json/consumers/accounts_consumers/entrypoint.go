package accounts_consumers

import (
	acc_msg "financo/core/scope_accounts/domain/messages"
	accounts_broker "financo/core/scope_accounts/infrastructure/broker_handler"
	"financo/core/scope_accounts/infrastructure/consumers/on_account_deleted"
	"financo/core/scope_accounts/infrastructure/consumers/on_category_deleted"
	"financo/core/scope_accounts/infrastructure/consumers/on_category_updated"
	"financo/core/scope_accounts/infrastructure/consumers/on_transaction_created"
	"financo/core/scope_accounts/infrastructure/consumers/on_transaction_deleted"
	"financo/core/scope_accounts/infrastructure/consumers/on_transaction_updated"
	cat_msg "financo/core/scope_categories/domain/messages"
	categories_broker "financo/core/scope_categories/infrastructure/broker_handler"
	tr_msg "financo/core/scope_transactions/domain/messages"
	transactions_broker "financo/core/scope_transactions/infrastructure/broker_handler"
	bus "financo/lib/message_bus"
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

	err = accounts.DeletedBroker().Subscribe(
		bus.ConsumerFunc[acc_msg.Deleted](on_account_deleted.NewInMemory),
	)
	if err != nil {
		return err
	}

	err = categories.DeletedBroker().Subscribe(
		bus.ConsumerFunc[cat_msg.Deleted](on_category_deleted.NewInMemory),
	)
	if err != nil {
		return err
	}

	err = categories.UpdatedBroker().Subscribe(
		bus.ConsumerFunc[cat_msg.Updated](on_category_updated.NewInMemory),
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

	err = transactions.DeletedBroker().Subscribe(
		bus.ConsumerFunc[tr_msg.Deleted](on_transaction_deleted.NewInMemory),
	)
	if err != nil {
		return err
	}

	err = transactions.UpdatedBroker().Subscribe(
		bus.ConsumerFunc[tr_msg.Updated](on_transaction_updated.NewInMemory),
	)
	if err != nil {
		return err
	}

	return nil
}
