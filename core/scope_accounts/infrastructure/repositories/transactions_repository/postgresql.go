package transactions_repository

import (
	"context"
	"financo/core/domain/databases"
	"financo/core/scope_accounts/domain/repositories"
	"financo/models/account"
)

type postgresql struct {
	db databases.SQLAdapter
}

func NewPostgreSQL(db databases.SQLAdapter) repositories.TransactionsRepository {
	return &postgresql{
		db: db,
	}
}

func (p *postgresql) BalanceWithoutHistoryFor(ctx context.Context, id int64) (int64, error) {
	type row struct {
		SourceID     int64
		TargetID     int64
		SourceAmount int64
		TargetAmount int64
	}

	var balance int64

	conn, err := p.db.Conn(ctx)
	if err != nil {
		return balance, err
	}
	defer conn.Close()

	rows, err := conn.QueryContext(
		ctx,
		`
		SELECT tr.source_id, tr.target_id, tr.source_amount, tr.target_amount
		FROM
				transactions tr
				INNER JOIN accounts src ON tr.source_id = src.id AND src.kind != $2
				INNER JOIN accounts trg ON tr.target_id = trg.id AND trg.kind != $2
		WHERE
				tr.deleted_at IS NULL
				AND (src.id = $1 OR trg.id = $1)
		`,
		id,
		account.SystemHistoric,
	)
	if err != nil {
		return balance, err
	}

	for rows.Next() {
		var r row

		err = rows.Scan(&r.SourceID, &r.TargetID, &r.SourceAmount, &r.TargetAmount)
		if err != nil {
			_ = rows.Close()
			return balance, err
		}

		if r.SourceID == id {
			balance -= r.SourceAmount
		} else {
			balance += r.TargetAmount
		}
	}

	_ = rows.Close()

	return balance, nil
}

// CountWithoutHistoryFor implements repositories.TransactionsRepository.
func (p *postgresql) CountWithoutHistoryFor(ctx context.Context, id int64) (int64, error) {
	var count int64

	conn, err := p.db.Conn(ctx)
	if err != nil {
		return count, err
	}
	defer conn.Close()

	err = conn.QueryRowContext(
		ctx,
		`
		SELECT COUNT(tr.id)
		FROM
				transactions tr
				INNER JOIN accounts src ON tr.source_id = src.id AND src.kind != $2
				INNER JOIN accounts trg ON tr.target_id = trg.id AND trg.kind != $2
		WHERE
				tr.deleted_at IS NULL
				AND (src.id = $1 OR trg.id = $1)
		`,
		id,
		account.SystemHistoric,
	).Scan(&count)
	if err != nil {
		return count, err
	}

	return count, nil
}
