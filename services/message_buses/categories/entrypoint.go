package categories

import (
	acc_msg "financo/core/scope_accounts/domain/messages"
	accounts_broker "financo/core/scope_accounts/infrastructure/services/message_broker"
	"financo/core/scope_categories/infrastructure/consumers/on_account_deleted"
	"financo/core/scope_categories/infrastructure/consumers/on_transaction_created"
	"financo/core/scope_categories/infrastructure/consumers/on_transaction_deleted"
	"financo/core/scope_categories/infrastructure/consumers/on_transaction_updated"
	tr_msg "financo/core/scope_transactions/domain/messages"
	transactions_broker "financo/core/scope_transactions/infrastructure/services/message_broker"
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

	err = accounts.Deleted().Subscribe(
		bus.ConsumerFunc[acc_msg.Deleted](on_account_deleted.NewInMemory),
	)
	if err != nil {
		return err
	}

	err = transactions.Created().Subscribe(
		bus.ConsumerFunc[tr_msg.Created](on_transaction_created.NewInMemory),
	)
	if err != nil {
		return err
	}

	err = transactions.Deleted().Subscribe(
		bus.ConsumerFunc[tr_msg.Deleted](on_transaction_deleted.NewInMemory),
	)
	if err != nil {
		return err
	}

	err = transactions.Updated().Subscribe(
		bus.ConsumerFunc[tr_msg.Updated](on_transaction_updated.NewInMemory),
	)
	if err != nil {
		return err
	}

	return nil
}
