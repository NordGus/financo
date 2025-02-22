package categories

import (
	accmsg "financo/core/scope_accounts/domain/messages"
	accountsbroker "financo/core/scope_accounts/infrastructure/services/message_broker"
	"financo/core/scope_categories/infrastructure/consumers/on_account_deleted"
	"financo/core/scope_categories/infrastructure/consumers/on_transaction_created"
	"financo/core/scope_categories/infrastructure/consumers/on_transaction_deleted"
	"financo/core/scope_categories/infrastructure/consumers/on_transaction_updated"
	trmsg "financo/core/scope_transactions/domain/messages"
	transactionsbroker "financo/core/scope_transactions/infrastructure/services/message_broker"
	bus "financo/lib/message_bus"
)

func Subscribe() error {
	accounts := accountsbroker.New()
	transactions := transactionsbroker.New()

	err := accounts.Deleted().Subscribe(
		bus.ConsumerFunc[accmsg.Deleted](on_account_deleted.NewInMemory),
	)
	if err != nil {
		return err
	}

	err = transactions.Created().Subscribe(
		bus.ConsumerFunc[trmsg.Created](on_transaction_created.NewInMemory),
	)
	if err != nil {
		return err
	}

	err = transactions.Deleted().Subscribe(
		bus.ConsumerFunc[trmsg.Deleted](on_transaction_deleted.NewInMemory),
	)
	if err != nil {
		return err
	}

	err = transactions.Updated().Subscribe(
		bus.ConsumerFunc[trmsg.Updated](on_transaction_updated.NewInMemory),
	)
	if err != nil {
		return err
	}

	return nil
}
