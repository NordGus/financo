package list_active_query

import (
	"context"
	"errors"
	"financo/models/achievement"
	"financo/models/achievement/savings_goal"
	"financo/server/savings_goals/types/response"
	"financo/server/types/queries"
	"financo/services/postgresql_database"
)

type query struct {
	db postgresql_database.Service
}

func New(db postgresql_database.Service) queries.Query[[]response.Active] {
	return &query{
		db: db,
	}
}

func (q *query) Find(ctx context.Context) ([]response.Active, error) {
	var (
		res = make([]response.Active, 0, 10)
		idx = -1
	)

	conn, err := q.db.Conn(ctx)
	if err != nil {
		return res, errors.Join(errors.New("failed to get database connection"), err)
	}
	defer conn.Close()

	rows, err := conn.QueryContext(
		ctx,
		`
		SELECT
			id,
			kind,
			name,
			description,
			settings,
			achieved_at,
			deleted_at,
			created_at,
			updated_at
		FROM achievements
		WHERE
			kind = $1
			AND achieved_at IS NULL
			AND deleted_at IS NULL
		ORDER BY
			settings->'currency', settings->'position' ASC
		`,
		achievement.SavingsGoal,
	)
	if err != nil {
		return res, errors.Join(errors.New("failed to execute database"), err)
	}
	defer rows.Close()

	for rows.Next() {
		var record savings_goal.Record

		err = rows.Scan(
			&record.ID,
			&record.Kind,
			&record.Name,
			&record.Description,
			&record.Settings,
			&record.AchievedAt,
			&record.DeletedAt,
			&record.CreatedAt,
			&record.UpdatedAt,
		)
		if err != nil {
			return res, errors.Join(errors.New("failed to scan rows"), err)
		}

		if idx < 0 {
			res = append(res, buildResponse(record))
			idx = 0
		}

		if res[idx].Currency != record.Settings.Currency {
			res = append(res, buildResponse(record))
			idx++
		}

		res[idx].Goals = append(res[idx].Goals, record)
	}

	return res, nil
}

func buildResponse(record savings_goal.Record) response.Active {
	return response.Active{
		Currency: record.Settings.Currency,
		Goals:    make([]savings_goal.Record, 0, 10),
	}
}
