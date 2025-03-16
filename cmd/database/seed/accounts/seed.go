package accounts

import (
	"context"
	"errors"
	"financo/cmd/database/seed/lib/helpers"
	"financo/core/scope_accounts/application/commands/archive_command"
	"financo/core/scope_accounts/application/commands/create_command"
	"financo/core/scope_accounts/domain/requests"
	"financo/core/scope_accounts/domain/responses"
	"financo/core/scope_accounts/infrastructure/repositories/accounts_repository"
	"financo/core/scope_accounts/infrastructure/repositories/archival_repository"
	"financo/core/scope_accounts/infrastructure/repositories/create_repository"
	"financo/core/scope_accounts/infrastructure/services/message_broker"
	"financo/models/account"
	"financo/services/postgresql_database"
	"fmt"
	"log"
	"time"
)

func SeedAccounts(ctx context.Context, timestamp time.Time) (map[string]responses.Listed, error) {
	var (
		db       = postgresql_database.New()
		repo     = create_repository.NewPostgreSQL(db)
		accounts = accounts_repository.NewPostgreSQL(db)
		archival = archival_repository.NewPostgreSQL(db)
		broker   = message_broker.New()

		out     = make(map[string]responses.Listed, 10)
		summary = make(map[account.Kind]uint, 8)
	)

	log.Println("\tseeding accounts")

	for i := 0; i < len(create); i++ {
		var (
			key     = create[i].key
			archive = create[i].archived
			req     = create[i].req
		)

		res, err := create_command.New(req, repo, broker.Created()).Run(ctx)
		if err != nil {
			return out, errors.Join(fmt.Errorf("accounts: failed to seed account %s", req.Name), err)
		}

		out[helpers.AccountMapKey(key)] = res

		if archive {
			r := requests.Archive{ID: res.ID}

			_, err = archive_command.New(r, accounts, archival, broker.Archived()).Run(ctx)
			if err != nil {
				return out, errors.Join(fmt.Errorf("accounts: failed to archive account %s", req.Name), err)
			}
		}

		summary[res.Kind] += 1
	}

	// printing summary
	for kind, count := range summary {
		log.Printf("\t\t%d %v accounts seeded\n", count, kind)
	}

	return out, nil
}
