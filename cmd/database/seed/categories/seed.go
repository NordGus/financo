package categories

import (
	"context"
	"errors"
	"financo/cmd/database/seed/lib/helpers"
	"financo/core/scope_categories/application/commands/archive_command"
	"financo/core/scope_categories/application/commands/create_command"
	"financo/core/scope_categories/application/commands/update_command"
	"financo/core/scope_categories/domain/requests"
	"financo/core/scope_categories/infrastructure/repositories/archival_repository"
	"financo/core/scope_categories/infrastructure/repositories/categories_repository"
	"financo/core/scope_categories/infrastructure/repositories/create_repository"
	"financo/core/scope_categories/infrastructure/repositories/update_repository"
	"financo/core/scope_categories/infrastructure/services/message_broker"
	"financo/lib/currency"
	"financo/lib/nullable"
	"financo/models/account"
	"financo/services/postgresql_database"
	"fmt"
	"log"
	"slices"
	"time"
)

type childID struct {
	ID       int64
	Name     string
	Currency currency.Type
}

type seeded struct {
	ID       int64
	Currency currency.Type
}

func SeedCategories(ctx context.Context, timestamp time.Time) (map[string]seeded, error) {
	var (
		db         = postgresql_database.New()
		repo       = create_repository.NewPostgreSQL(db)
		categories = categories_repository.NewPostgreSQL(db)
		update     = update_repository.NewPostgreSQL(db)
		archival   = archival_repository.NewPostgreSQL(db)
		broker     = message_broker.New()

		out          = make(map[string]seeded, 10)
		summary      = make(map[account.Kind]uint, 8)
		childSummary = make(map[account.Kind]uint, 8)
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

		out[helpers.CategoryMapKey(key)] = seeded{ID: res.ID, Currency: res.Currency}

		updateReq := requests.Update{
			ID:            res.ID,
			Name:          res.Name,
			Description:   res.Description,
			Color:         res.Color,
			Icon:          res.Icon,
			Subcategories: make([]requests.UpdateSubcategory, 0, len(res.Children)),
		}

		for _, child := range res.Children {
			i := slices.IndexFunc(children, func(c childCreateReq) bool {
				return c.req.Name == child.Name
			})

			if i < 0 {
				return out, errors.Join(
					fmt.Errorf(
						"categories: find data for subcategory %s (%s)",
						req.Name,
						child.Name,
					),
					err,
				)
			}

			childSummary[child.Kind] += 1

			out[helpers.ChildCategoryMapKey(key, children[i].key)] = seeded{ID: child.ID, Currency: child.Currency}

			subcategory := requests.UpdateSubcategory{
				ID:          nullable.New(child.ID),
				Name:        child.Name,
				Description: child.Description,
				Icon:        child.Icon,
				Intent:      requests.UPDATE,
			}

			if children[i].archived {
				subcategory.Intent = requests.ARCHIVE
			}

			updateReq.Subcategories = append(updateReq.Subcategories, subcategory)
		}

		_, err = update_command.New(
			updateReq,
			update,
			broker.Updated(),
			broker.Created(),
			broker.Archived(),
			broker.Unarchived(),
			broker.Deleted(),
		).Run(ctx)
		if err != nil {
			return out, errors.Join(
				fmt.Errorf(
					"categories: failed to update category %s to run child archival",
					req.Name,
				),
				err,
			)
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
		log.Printf("\t\t\t%d subcategories seeded\n", count)
	}

	return out, nil
}
