package credit_accounts_repository

import (
	"context"
	"database/sql"
	"financo/core/domain/databases"
	"financo/core/scope_graphs/domain/repositories"
	"financo/models/account"
)

type postgresql struct {
	db databases.SQLAdapter
}

func NewPostgreSQL(db databases.SQLAdapter) repositories.CreditAccounts {
	return &postgresql{
		db: db,
	}
}

func (r *postgresql) Find(ctx context.Context) ([]account.Record, error) {
	var out []account.Record

	conn, err := r.db.Conn(ctx)
	if err != nil {
		return out, err
	}
	defer conn.Close()

	out, err = r.find(ctx, conn)
	if err != nil {
		return out, err
	}

	return out, nil
}

func (r *postgresql) find(ctx context.Context, conn *sql.Conn) ([]account.Record, error) {
	var (
		out  = make([]account.Record, 0, 10)
		kind = account.DebtCredit
	)

	rows, err := conn.QueryContext(
		ctx,
		`
		SELECT
			id,
			parent_id,
			kind,
			currency,
			name,
			description,
			color,
			icon,
			capital,
			archived_at,
			deleted_at,
			created_at,
			updated_at
		FROM accounts
		WHERE deleted_at IS NULL
			AND archived_at IS NULL
			AND kind = $1
		`,
		kind,
	)
	if err != nil {
		return out, err
	}
	defer rows.Close()

	for rows.Next() {
		var r account.Record

		err = rows.Scan()
		if err != nil {
			return out, err
		}

		out = append(out, r)
	}

	return out, nil
}
