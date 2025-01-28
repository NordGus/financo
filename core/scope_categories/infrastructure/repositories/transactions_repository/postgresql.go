package transactions_repository

import (
	"context"
	"financo/core/domain/databases"
	"financo/core/scope_categories/domain/repositories"
)

type postgresql struct {
	db databases.SQLAdapter
}

func NewPostgreSQL(db databases.SQLAdapter) repositories.TransactionsRepository {
	return &postgresql{
		db: db,
	}
}

func (p *postgresql) CountFor(ctx context.Context, ids []int64) (map[int64]int64, error) {
	counts := make(map[int64]int64, 10)

	conn, err := p.db.Conn(ctx)
	if err != nil {
		return counts, err
	}
	defer conn.Close()

	rows, err := conn.QueryContext(
		ctx,
		`
		SELECT acc.id, COUNT(tr.id) as trs
		FROM
				transactions tr
				INNER JOIN accounts acc ON (tr.source_id = acc.id OR tr.target_id = acc.id)
		WHERE
				tr.deleted_at IS NULL
				AND acc.id = ANY ($1)
		GROUP BY acc.id
		`,
		ids,
	)
	if err != nil {
		return counts, err
	}

	for rows.Next() {
		var (
			id    int64
			count int64
		)

		err = rows.Scan(&id, &count)
		if err != nil {
			_ = rows.Close()
			return counts, err
		}

		counts[id] = count
	}

	_ = rows.Close()

	return counts, nil
}
