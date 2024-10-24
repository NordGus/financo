package preview_account_repository

import (
	"context"
	"financo/core/domain/databases"
	"financo/core/scope_accounts/domain/filters"
	"financo/core/scope_accounts/domain/repositories"
	"financo/core/scope_accounts/domain/responses"
	"financo/server/types/records/account"
)

type repository struct {
	db databases.SQLAdapter
}

func NewPostgreSQL(db databases.SQLAdapter) repositories.PreviewAccountRepository {
	return &repository{
		db: db,
	}
}

// TODO: Refactor to use math/big package

const (
	queryString = `
	WITH
		active_transactions (
			id,
			source_id,
			target_id,
			issued_at,
			executed_at,
			source_amount,
			target_amount
		) AS (
			SELECT
				id,
				source_id,
				target_id,
				issued_at,
				executed_at,
				source_amount,
				target_amount
			FROM transactions
			WHERE
				deleted_at IS NULL
				AND (executed_at IS NULL OR executed_at <= NOW())
				AND issued_at <= NOW()
		),
		children (
			id,
			parent_id,
			kind,
			currency,
			name,
			description,
			balance,
			capital,
			color,
			icon,
			archived_at,
			created_at,
			updated_at
		) AS (
			SELECT
				acc.id,
				acc.parent_id,
				acc.kind,
				acc.currency,
				acc.name,
				acc.description,
				SUM(
					CASE
						WHEN tr.source_id = acc.id THEN - tr.source_amount
						WHEN tr.target_id = acc.id THEN tr.target_amount
						ELSE 0
					END
				) AS balance,
				acc.capital,
				acc.color,
				acc.icon,
				acc.archived_at,
				acc.created_at,
				acc.updated_at
			FROM
				accounts acc
				LEFT JOIN active_transactions tr ON tr.source_id = acc.id
				OR tr.target_id = acc.id
			WHERE
				acc.parent_id IS NOT NULL
				AND acc.deleted_at IS NULL
				AND acc.archived_at IS NULL
				AND acc.kind != $1
			GROUP BY
				acc.id
		)
	SELECT
		acc.id,
		acc.kind,
		acc.currency,
		acc.name,
		acc.description,
		SUM(
			CASE
				WHEN blc.source_id = acc.id THEN - blc.source_amount
				WHEN blc.target_id = acc.id THEN blc.target_amount
				ELSE 0
			END
		) AS balance,
		acc.capital,
		acc.color,
		acc.icon,
		acc.archived_at,
		acc.created_at,
		acc.updated_at,
		child.id,
		MAX(child.kind) AS child_kind,
		MAX(child.currency) AS child_currency,
		MAX(child.name) AS child_name,
		MAX(child.description) AS child_description,
		MAX(child.balance)::bigint AS child_balance,
		MAX(child.capital) AS child_capital,
		MAX(child.color) AS child_color,
		MAX(child.icon) AS child_icon,
		MAX(child.archived_at) AS child_archived_at,
		MAX(child.created_at) AS child_created_at,
		MAX(child.updated_at) AS child_updated_at
	FROM
		accounts acc
		LEFT JOIN children child ON child.parent_id = acc.id
		LEFT JOIN active_transactions blc ON blc.source_id = acc.id
		OR blc.target_id = acc.id
	WHERE
		acc.kind = ANY ($2)
		AND acc.parent_id IS NULL
		AND acc.deleted_at IS NULL
	`
)

func (r *repository) Find(
	ctx context.Context,
	filter repositories.PreviewAccountRepositoryFilter,
) ([]responses.Preview, error) {
	var (
		query    = queryString
		kinds    = filters.FilterKinds(filter.Kinds)
		idx      = -1
		archived = filter.Archived.OrElse(false)
		res      = make([]responses.Preview, 0, 10)
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
			&r.balance,
			&r.capital,
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
			&r.childBalance,
			&r.childCapital,
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
			res = append(res, r.toResponsesPreview())
			idx = 0
		}

		if res[idx].ID != r.id {
			res = append(res, r.toResponsesPreview())
			idx++
		}

		if r.childId.Valid {
			res[idx].Children = append(res[idx].Children, r.toResponsesPreviewChild())
		}
	}

	return res, nil
}
