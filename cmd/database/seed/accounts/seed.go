package accounts

import (
	"context"
	"errors"
	"financo/cmd/database/seed/lib/helpers"
	"financo/core/domain/services"
	"financo/core/scope_accounts/application/commands/archive_command"
	"financo/core/scope_accounts/application/commands/create_command"
	"financo/core/scope_accounts/domain/requests"
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

func SeedAccounts(ctx context.Context, timestamp time.Time) (map[string]int64, error) {
	var (
		db       = postgresql_database.New()
		repo     = create_repository.NewPostgreSQL(db)
		accounts = accounts_repository.NewPostgreSQL(db)
		archival = archival_repository.NewPostgreSQL(db)
		broker   = message_broker.New()

		out     = make(map[string]int64, 10)
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

		out[helpers.AccountMapKey(key)] = res.ID

		children, err := getChildrenCategories(ctx, db, res.ID)
		if err != nil {
			return out, errors.Join(fmt.Errorf("accounts: failed to retrieve account %s children", req.Name), err)
		}

		for i := 0; i < len(children); i++ {
			out[helpers.ChildCategoryMapKey(key, "interest")] = children[i]
		}

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

func getChildrenCategories(ctx context.Context, db services.SQLDatabaseService, parent int64) ([]int64, error) {
	ids := make([]int64, 0, 10)

	conn, err := db.Conn(ctx)
	if err != nil {
		return ids, err
	}
	defer conn.Close()

	rows, err := conn.QueryContext(
		ctx,
		`
		SELECT id
		FROM accounts
		WHERE
			parent_id = $1
			AND deleted_at IS NULL
			AND archived_at IS NULL
			AND kind != $2
		`,
		parent,
		account.History,
	)
	if err != nil {
		return ids, err
	}

	for rows.Next() {
		var id int64

		err = rows.Scan(&id)
		if err != nil {
			_ = rows.Close()
			return ids, err
		}

		ids = append(ids, id)
	}

	_ = rows.Close()

	return ids, nil
}
