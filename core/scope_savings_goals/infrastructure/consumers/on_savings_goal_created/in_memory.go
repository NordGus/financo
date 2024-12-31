package on_savings_goal_created

import (
	"financo/core/scope_savings_goals/application/event_handlers/on_savings_goal_created"
	"financo/core/scope_savings_goals/domain/messages"
	"financo/core/scope_savings_goals/infrastructure/lock"
	"financo/core/scope_savings_goals/infrastructure/repositories/savings_goals_repository"
	"financo/core/scope_savings_goals/infrastructure/repositories/savings_repository"
	"financo/core/scope_savings_goals/infrastructure/repositories/update_repository"
	"financo/services/postgresql_database"
	"log"
	"sync"
)

func NewInMemory(wg *sync.WaitGroup, payload messages.Created) {
	defer wg.Done()

	lock.GlobalLock().Lock()
	defer lock.GlobalLock().Unlock()

	var (
		db      = postgresql_database.New()
		goals   = savings_goals_repository.NewPostgreSQL(db)
		savings = savings_repository.NewPostgreSQL(db)
		update  = update_repository.NewPostgreSQL(db)
	)

	err := on_savings_goal_created.New(goals, savings, update).Handle(payload)
	if err != nil {
		log.Println("something went wrong while handling savings goal created message.", err)

		return
	}
}
