package select_account_repository

import (
	"context"
	"financo/core/domain/databases"
	"financo/core/scope_accounts/domain/filters"
	"financo/core/scope_accounts/domain/repositories"
	"financo/core/scope_accounts/domain/responses"
	"financo/models/account"
)

type repository struct {
	db databases.SQLAdapter
}

func NewPostgreSQL(db databases.SQLAdapter) repositories.SelectAccountRepository {
	return &repository{
		db: db,
	}
}

const (
	queryString = `
	SELECT
		acc.id,
		acc.kind,
		acc.currency,
		acc.name,
		acc.description,
		acc.color,
		acc.icon,
		acc.archived_at,
		acc.created_at,
		acc.updated_at,
		child.id,
		child.kind,
		child.currency,
		child.name,
		child.description,
		child.color,
		child.icon,
		child.archived_at,
		child.created_at,
		child.updated_at
	FROM
		accounts acc
		LEFT JOIN accounts child ON child.parent_id = acc.id AND child.kind != $1 AND child.deleted_at IS NULL AND child.archived_at IS NULL
	WHERE
		acc.kind = ANY ($2)
		AND acc.parent_id IS NULL
		AND acc.deleted_at IS NULL
	`
)

func (r *repository) Find(
	ctx context.Context,
	filter repositories.SelectAccountRepositoryFilter,
) ([]responses.Select, error) {
	var (
		query    = queryString
		kinds    = filters.FilterKinds(filter.Kinds)
		idx      = -1
		archived = filter.Archived.OrElse(false)
		res      = make([]responses.Select, 0, 10)
	)

	conn, err := r.db.Conn(ctx)
	if err != nil {
		return res, err
	}
	defer conn.Close()

	if archived {
		query += " AND acc.archived_at IS NOT NULL"
	}

	if !archived {
		query += " AND acc.archived_at IS NULL"
	}

	query += " GROUP BY child.id, acc.id"

	rows, err := conn.QueryContext(ctx, query, account.SystemHistoric, kinds)
	if err != nil {
		return res, err
	}
	defer rows.Close()

	for rows.Next() {
		var r rowPostgreSQL

		err = rows.Scan(
			&r.id,
			&r.kind,
			&r.currency,
			&r.name,
			&r.description,
			&r.color,
			&r.icon,
			&r.archivedAt,
			&r.createdAt,
			&r.updatedAt,
			&r.childId,
			&r.childKind,
			&r.childCurrency,
			&r.childName,
			&r.childDescription,
			&r.childColor,
			&r.childIcon,
			&r.childArchivedAt,
			&r.childCreatedAt,
			&r.childUpdatedAt,
		)
		if err != nil {
			return res, err
		}

		if idx < 0 {
			res = append(res, r.toResponsesSelect())
			idx = 0
		}

		if res[idx].ID != r.id {
			res = append(res, r.toResponsesSelect())
			idx++
		}

		if r.childId.Valid {
			res[idx].Children = append(res[idx].Children, r.toResponsesSelectChild())
		}
	}

	return res, nil
}
