package savings_goals

import (
	"context"
	"errors"
	"financo/cmd/database/seed/lib/helpers"
	"financo/core/scope_savings_goals/application/commands/create_command"
	"financo/core/scope_savings_goals/application/commands/mark_as_achieved_command"
	"financo/core/scope_savings_goals/domain/requests"
	"financo/core/scope_savings_goals/domain/responses"
	"financo/core/scope_savings_goals/infrastructure/repositories/create_repository"
	"financo/core/scope_savings_goals/infrastructure/repositories/savings_goals_repository"
	"financo/core/scope_savings_goals/infrastructure/repositories/update_repository"
	"financo/core/scope_savings_goals/infrastructure/services/message_broker"
	"financo/lib/currency"
	"financo/services/postgresql_database"
	"fmt"
	"log"
)

func CreateSavingsGoals(ctx context.Context) ([]responses.Created, error) {
	var (
		db     = postgresql_database.New()
		goals  = savings_goals_repository.NewPostgreSQL(db)
		repo   = create_repository.NewPostgreSQL(db)
		broker = message_broker.New()

		summary = make(map[currency.Type]uint, 10)

		out = make([]responses.Created, 0, len(create))
	)

	log.Println("\tseeding savings goals achievements")

	for i := 0; i < len(create); i++ {
		res, err := create_command.New(create[i], goals, repo, broker.Created()).Run(ctx)
		if err != nil {
			return out, errors.Join(fmt.Errorf("savings_goals: failed to seed savings goal %s", create[i].Name), err)
		}

		out = append(out, res)
		summary[res.Currency] += 1
	}

	// printing summary
	for kind, count := range summary {
		log.Printf("\t\t%d savings goals seeded for %v\n", count, kind)
	}

	return out, nil
}

func AchieveSavingsGoals(ctx context.Context, created []responses.Created) ([]responses.MarkedAsAchieved, error) {
	var (
		db     = postgresql_database.New()
		goals  = savings_goals_repository.NewPostgreSQL(db)
		update = update_repository.NewPostgreSQL(db)
		broker = message_broker.New()

		summary = make(map[currency.Type]uint, 10)

		out  = make([]responses.MarkedAsAchieved, 0, len(created))
		mark = make([]responses.Created, 0, len(created))
	)

	for i := 0; i < len(created); i++ {
		if _, ok := achieved[helpers.SavingsGoalMapKey(created[i].Name, created[i].Currency)]; ok {
			mark = append(mark, created[i])
		}
	}

	for i := 0; i < len(mark); i++ {
		var (
			req  = requests.MarkAsAchieved{ID: mark[i].ID, AchievedAt: achieved[helpers.SavingsGoalMapKey(mark[i].Name, mark[i].Currency)]}
			curr = mark[i].Currency
		)

		res, err := mark_as_achieved_command.New(req, goals, update, broker.MarkedAsAchieved()).Run(ctx)
		if err != nil {
			return out, errors.Join(
				fmt.Errorf("savings_goals: failed to mark savings goal %s as achieved", create[i].Name),
				err,
			)
		}

		out = append(out, res)
		summary[curr] += 1
	}

	// printing summary
	for kind, count := range summary {
		log.Printf("\t\t%d savings goals marked as achieved for %v\n", count, kind)
	}

	return out, nil
}
