package categories

import (
	"context"
	"errors"
	"financo/cmd/database/seed/lib/helpers"
	"financo/core/domain/services"
	"financo/core/scope_categories/application/commands/archive_child_command"
	"financo/core/scope_categories/application/commands/archive_command"
	"financo/core/scope_categories/application/commands/create_command"
	"financo/core/scope_categories/domain/requests"
	"financo/core/scope_categories/infrastructure/repositories/archival_repository"
	"financo/core/scope_categories/infrastructure/repositories/categories_repository"
	"financo/core/scope_categories/infrastructure/repositories/create_repository"
	"financo/core/scope_categories/infrastructure/services/message_broker"
	"financo/models/account"
	"financo/services/postgresql_database"
	"fmt"
	"log"
	"time"
)

type childID struct {
	ID   int64
	Name string
}

func SeedCategories(ctx context.Context, timestamp time.Time) (map[string]int64, error) {
	var (
		db         = postgresql_database.New()
		repo       = create_repository.NewPostgreSQL(db)
		categories = categories_repository.NewPostgreSQL(db)
		archival   = archival_repository.NewPostgreSQL(db)
		broker     = message_broker.New()

		out     = make(map[string]int64, 10)
		summary = make(map[account.Kind]uint, 8)
	)

	log.Println("\tseeding categories")

	for i := 0; i < len(create); i++ {
		var (
			key      = create[i].key
			archive  = create[i].archived
			req      = create[i].req
			children = create[i].children
		)

		for i := 0; i < len(children); i++ {
			req.Children = append(req.Children, children[i].req)
		}

		res, err := create_command.New(req, repo, broker.Created()).Run(ctx)
		if err != nil {
			return out, errors.Join(fmt.Errorf("categories: failed to seed category %s", req.Name), err)
		}

		out[helpers.CategoryMapKey(key)] = res.ID

		c, err := getChildrenCategories(ctx, db, res.ID)
		if err != nil {
			return out, errors.Join(fmt.Errorf("categories: failed to retrieve category %s children", req.Name), err)
		}

		for i := 0; i < len(c); i++ {
			for j := 0; j < len(children); j++ {
				if children[j].req.Name != c[i].Name {
					continue
				}

				out[helpers.ChildCategoryMapKey(key, children[j].key)] = c[i].ID

				if children[j].archived {
					r := requests.ArchiveChild{ID: c[i].ID, ParentID: res.ID}

					_, err = archive_child_command.New(r, categories, archival, broker.Archived()).Run(ctx)
					if err != nil {
						return out, errors.Join(
							fmt.Errorf("categories: failed to archive category %s (%s)", req.Name, children[j].req.Name),
							err,
						)
					}
				}

				break
			}
		}

		if archive {
			r := requests.Archive{ID: res.ID}

			_, err = archive_command.New(r, categories, archival, broker.Archived()).Run(ctx)
			if err != nil {
				return out, errors.Join(fmt.Errorf("categories: failed to archive category %s", req.Name), err)
			}
		}

		summary[res.Kind] += 1
	}

	// printing summary
	for kind, count := range summary {
		log.Printf("\t\t%d %v categories seeded\n", count, kind)
	}

	return out, nil
}

func getChildrenCategories(ctx context.Context, db services.SQLDatabaseService, parent int64) ([]childID, error) {
	children := make([]childID, 0, 10)

	conn, err := db.Conn(ctx)
	if err != nil {
		return children, err
	}
	defer conn.Close()

	rows, err := conn.QueryContext(
		ctx,
		`
		SELECT id, name
		FROM accounts
		WHERE
			parent_id = $1
			AND deleted_at IS NULL
			AND archived_at IS NULL
			AND kind != $2
		`,
		parent,
		account.SystemHistoric,
	)
	if err != nil {
		return children, err
	}

	for rows.Next() {
		var child childID

		err = rows.Scan(&child.ID, &child.Name)
		if err != nil {
			_ = rows.Close()
			return children, err
		}

		children = append(children, child)
	}

	_ = rows.Close()

	return children, nil
}
