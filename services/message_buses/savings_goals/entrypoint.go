package savings_goals

import (
	accmsg "financo/core/scope_accounts/domain/messages"
	"financo/core/scope_accounts/infrastructure/consumers/on_category_deleted"
	accountsbroker "financo/core/scope_accounts/infrastructure/services/message_broker"
	catmsg "financo/core/scope_categories/domain/messages"
	categoriesbroker "financo/core/scope_categories/infrastructure/services/message_broker"
	goalsmsg "financo/core/scope_savings_goals/domain/messages"
	"financo/core/scope_savings_goals/infrastructure/consumers/on_account_created"
	"financo/core/scope_savings_goals/infrastructure/consumers/on_account_deleted"
	"financo/core/scope_savings_goals/infrastructure/consumers/on_account_updated"
	"financo/core/scope_savings_goals/infrastructure/consumers/on_savings_goal_created"
	"financo/core/scope_savings_goals/infrastructure/consumers/on_savings_goal_deleted"
	"financo/core/scope_savings_goals/infrastructure/consumers/on_savings_goal_marked_as_achieved"
	"financo/core/scope_savings_goals/infrastructure/consumers/on_savings_goal_updated"
	"financo/core/scope_savings_goals/infrastructure/consumers/on_transaction_created"
	"financo/core/scope_savings_goals/infrastructure/consumers/on_transaction_deleted"
	"financo/core/scope_savings_goals/infrastructure/consumers/on_transaction_updated"
	goalsbroker "financo/core/scope_savings_goals/infrastructure/services/message_broker"
	trmsg "financo/core/scope_transactions/domain/messages"
	transactionsbroker "financo/core/scope_transactions/infrastructure/services/message_broker"
	bus "financo/lib/message_bus"
)

func Subscribe() error {
	accounts := accountsbroker.New()
	categories := categoriesbroker.New()
	transactions := transactionsbroker.New()
	goals := goalsbroker.New()

	err := accounts.Created().Subscribe(bus.ConsumerFunc[accmsg.Created](on_account_created.NewInMemory))
	if err != nil {
		return err
	}

	err = accounts.Deleted().Subscribe(bus.ConsumerFunc[accmsg.Deleted](on_account_deleted.NewInMemory))
	if err != nil {
		return err
	}

	err = accounts.Updated().Subscribe(bus.ConsumerFunc[accmsg.Updated](on_account_updated.NewInMemory))
	if err != nil {
		return err
	}

	err = categories.Deleted().Subscribe(bus.ConsumerFunc[catmsg.Deleted](on_category_deleted.NewInMemory))
	if err != nil {
		return err
	}

	err = goals.Created().Subscribe(bus.ConsumerFunc[goalsmsg.Created](on_savings_goal_created.NewInMemory))
	if err != nil {
		return err
	}

	err = goals.Deleted().Subscribe(bus.ConsumerFunc[goalsmsg.Deleted](on_savings_goal_deleted.NewInMemory))
	if err != nil {
		return err
	}

	err = goals.MarkedAsAchieved().Subscribe(
		bus.ConsumerFunc[goalsmsg.MarkedAsAchieved](on_savings_goal_marked_as_achieved.NewInMemory),
	)
	if err != nil {
		return err
	}

	err = goals.Updated().Subscribe(bus.ConsumerFunc[goalsmsg.Updated](on_savings_goal_updated.NewInMemory))
	if err != nil {
		return err
	}

	err = transactions.Created().Subscribe(bus.ConsumerFunc[trmsg.Created](on_transaction_created.NewInMemory))
	if err != nil {
		return err
	}

	err = transactions.Deleted().Subscribe(bus.ConsumerFunc[trmsg.Deleted](on_transaction_deleted.NewInMemory))
	if err != nil {
		return err
	}

	err = transactions.Updated().Subscribe(bus.ConsumerFunc[trmsg.Updated](on_transaction_updated.NewInMemory))
	if err != nil {
		return err
	}

	return nil
}
