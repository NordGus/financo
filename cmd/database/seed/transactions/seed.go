package transactions

import (
	"context"
	"errors"
	"financo/cmd/database/seed/accounts"
	"financo/core/infrastructure/repositories/account_repository"
	"financo/core/scope_transactions/application/commands/create_command"
	"financo/core/scope_transactions/application/commands/delete_command"
	"financo/core/scope_transactions/domain/requests"
	"financo/core/scope_transactions/infrastructure/repositories/create_transaction_repository"
	"financo/core/scope_transactions/infrastructure/repositories/delete_transaction_repository"
	"financo/core/scope_transactions/infrastructure/repositories/detailed_transaction_repository"
	"financo/core/scope_transactions/infrastructure/repositories/transaction_repository"
	"financo/core/scope_transactions/infrastructure/services/message_broker"
	"financo/services/postgresql_database"
	"fmt"
	"log"
	"time"
)

func SeedTransactions(ctx context.Context, seeds map[string]accounts.AccountRecord, timestamp time.Time) error {
	var (
		db       = postgresql_database.New()
		accounts = account_repository.NewPostgreSQL(db)
		create   = create_transaction_repository.NewPostgreSQL(db)
		detailed = detailed_transaction_repository.NewPostgreSQL(db)
		transact = transaction_repository.NewPostgreSQL(db)
		delete   = delete_transaction_repository.NewPostgreSQL(db)

		summary uint = 0
		ts           = timestamp.UTC()
	)

	broker, err := message_broker.Instance()
	if err != nil {
		return errors.Join(errors.New("transactions: failed to retrieve message_broker instance"), err)
	}

	log.Println("\tseeding transactions")

	for i := 0; i < len(transactions); i++ {
		var (
			data   = transactions[i]
			source = seeds[data.Source.Key].Account
			target = seeds[data.Target.Key].Account
		)

		if data.Source.ParentKey.Valid {
			source = seeds[data.Source.ParentKey.Val].Children[data.Source.Key]
		}

		if data.Target.ParentKey.Valid {
			target = seeds[data.Target.ParentKey.Val].Children[data.Target.Key]
		}

		req := requests.Create{
			IssuedAt:     data.IssuedAt(ts),
			ExecutedAt:   data.ExecutedAt(ts),
			Notes:        data.Notes,
			SourceID:     source.ID,
			TargetID:     target.ID,
			SourceAmount: data.SourceAmount,
			TargetAmount: data.TargetAmount,
		}

		res, err := create_command.New(req, accounts, create, detailed, broker.Created()).Run(ctx)
		if err != nil {
			return errors.Join(
				fmt.Errorf("transactions: failed to seed transaction between %s and %s", source.Name, target.Name),
				err,
			)
		}

		if data.DeletedAt(ts).Valid {
			r := requests.Delete{ID: res.ID}

			_, err = delete_command.New(r, transact, delete, detailed, broker.Deleted()).Run(ctx)
			if err != nil {
				return errors.Join(
					fmt.Errorf("transactions: failed to delete transaction between %s and %s", source.Name, target.Name),
					err,
				)
			}
		}

		summary += 1
	}

	log.Printf("\t\t%d transactions seeded\n", summary)

	return nil
}
