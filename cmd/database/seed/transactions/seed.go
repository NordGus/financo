package transactions

import (
	"context"
	"errors"
	"financo/core/infrastructure/repositories/account_repository"
	"financo/core/scope_transactions/application/commands/create_command"
	"financo/core/scope_transactions/application/commands/delete_command"
	"financo/core/scope_transactions/domain/requests"
	"financo/core/scope_transactions/infrastructure/repositories/create_repository"
	"financo/core/scope_transactions/infrastructure/repositories/delete_repository"
	"financo/core/scope_transactions/infrastructure/repositories/transaction_repository"
	"financo/core/scope_transactions/infrastructure/services/message_broker"
	"financo/lib/currency"
	"financo/services/postgresql_database"
	"fmt"
	"log"
	"time"
)

func SeedTransactions(
	ctx context.Context,
	ids map[string]int64,
	currencies map[string]currency.Type,
	timestamp time.Time,
) error {
	var (
		db       = postgresql_database.New()
		accounts = account_repository.NewPostgreSQL(db)
		create   = create_repository.NewPostgreSQL(db)
		transact = transaction_repository.NewPostgreSQL(db)
		destroy  = delete_repository.NewPostgreSQL(db)
		broker   = message_broker.New()

		summary uint = 0
		ts           = timestamp.UTC()
	)

	log.Println("\tseeding transactions")

	for i := 0; i < len(transactions); i++ {
		var (
			data   = transactions[i]
			source = ids[data.Source]
			target = ids[data.Target]
			curr   = currencies[data.CurrencySource]
			kind   = data.Kind
		)

		req := requests.Create{
			IssuedAt:     data.IssuedAt(ts),
			ExecutedAt:   data.ExecutedAt(ts),
			Notes:        data.Notes,
			Currency:     curr,
			SourceID:     source,
			TargetID:     target,
			SourceAmount: data.SourceAmount,
			TargetAmount: data.TargetAmount,
			Kind:         kind,
		}

		res, err := create_command.New(req, accounts, create, broker.Created()).Run(ctx)
		if err != nil {
			return errors.Join(
				fmt.Errorf(
					"transactions: failed to seed transaction between %s(%d) and %s(%d)",
					data.Source,
					source,
					data.Target,
					target,
				),
				err,
			)
		}

		if data.DeletedAt(ts).Valid {
			r := requests.Delete{ID: res.ID}

			_, err = delete_command.New(r, transact, destroy, broker.Deleted()).Run(ctx)
			if err != nil {
				return errors.Join(
					fmt.Errorf("transactions: failed to destroy transaction between %s and %s", data.Source, data.Target),
					err,
				)
			}
		}

		summary += 1
	}

	log.Printf("\t\t%d transactions seeded\n", summary)

	return nil
}
