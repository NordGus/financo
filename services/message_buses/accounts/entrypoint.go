package accounts

import (
	accountmsg "financo/core/scope_accounts/domain/messages"
	"financo/core/scope_accounts/infrastructure/consumers/on_account_deleted"
	"financo/core/scope_accounts/infrastructure/consumers/on_category_deleted"
	"financo/core/scope_accounts/infrastructure/consumers/on_category_updated"
	"financo/core/scope_accounts/infrastructure/consumers/on_transaction_created"
	"financo/core/scope_accounts/infrastructure/consumers/on_transaction_deleted"
	"financo/core/scope_accounts/infrastructure/consumers/on_transaction_updated"
	accountsbroker "financo/core/scope_accounts/infrastructure/services/message_broker"
	categorymsg "financo/core/scope_categories/domain/messages"
	categoriesbroker "financo/core/scope_categories/infrastructure/services/message_broker"
	transactionmsg "financo/core/scope_transactions/domain/messages"
	transactionsbroker "financo/core/scope_transactions/infrastructure/services/message_broker"
	"financo/lib/message_bus"
)

func Subscribe() error {
	accounts := accountsbroker.New()
	categories := categoriesbroker.New()
	transactions := transactionsbroker.New()

	err := accounts.Deleted().Subscribe(
		message_bus.ConsumerFunc[accountmsg.Deleted](on_account_deleted.NewInMemory),
	)
	if err != nil {
		return err
	}

	err = categories.Deleted().Subscribe(
		message_bus.ConsumerFunc[categorymsg.Deleted](on_category_deleted.NewInMemory),
	)
	if err != nil {
		return err
	}

	err = categories.Updated().Subscribe(
		message_bus.ConsumerFunc[categorymsg.Updated](on_category_updated.NewInMemory),
	)
	if err != nil {
		return err
	}

	err = transactions.Created().Subscribe(
		message_bus.ConsumerFunc[transactionmsg.Created](on_transaction_created.NewInMemory),
	)
	if err != nil {
		return err
	}

	err = transactions.Deleted().Subscribe(
		message_bus.ConsumerFunc[transactionmsg.Deleted](on_transaction_deleted.NewInMemory),
	)
	if err != nil {
		return err
	}

	err = transactions.Updated().Subscribe(
		message_bus.ConsumerFunc[transactionmsg.Updated](on_transaction_updated.NewInMemory),
	)
	if err != nil {
		return err
	}

	return nil
}
