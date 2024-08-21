package available_credit_query

import (
	"context"
	"errors"
	"financo/server/summary/quries/summary_for_kind_query"
	"financo/server/summary/types/response"
	"financo/server/types/queries"
	"financo/server/types/records/account"
	"financo/server/types/shared/currency"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type capital struct {
	currency currency.Type
	capital  int64
}

type query struct {
	conn      *pgxpool.Conn
	kinds     []account.Kind
	timestamp time.Time
}

func New(conn *pgxpool.Conn) queries.Query[[]response.Global] {
	return &query{
		conn:      conn,
		kinds:     []account.Kind{account.DebtCredit},
		timestamp: time.Now().UTC(),
	}
}

func (q *query) Find(ctx context.Context) ([]response.Global, error) {
	var (
		cap = make([]capital, 0, 10)
	)

	res, err := summary_for_kind_query.New(q.kinds, q.conn).Find(ctx)
	if err != nil {
		return res, errors.Join(errors.New("query failed"), err)
	}

	rows, err := q.conn.Query(
		ctx,
		`
			SELECT currency, SUM(capital)
			FROM accounts
			WHERE kind = ANY($1) AND deleted_at IS NULL AND archived_at IS NULL
			GROUP BY currency
		`,
		q.kinds,
	)
	if err != nil {
		return res, errors.Join(errors.New("failed to retrieve capital"), err)
	}
	defer rows.Close()

	for rows.Next() {
		var r capital

		err = rows.Scan(&r.currency, &r.capital)
		if err != nil {
			return res, errors.Join(errors.New("failed to scan capital"), err)
		}

		cap = append(cap, r)
	}

	rows.Close()

	for i := 0; i < len(res); i++ {
		var (
			found = false
			c     capital
		)

		for j := 0; j < len(cap); j++ {
			if cap[j].currency == res[i].Currency {
				c = cap[j]
				found = true
				break
			}
		}

		if !found {
			continue
		}

		res[i].Amount += c.capital

		for j := 0; j < len(res[i].Series); j++ {
			res[i].Series[j].Amount = -res[i].Series[j].Amount
		}
	}

	return res, nil
}
