package list_achieved_query

import (
	"context"
	"database/sql"
	"errors"
	"financo/server/my_journey/types/response"
	"financo/server/services/postgres_database"
	"financo/server/types/queries"
	"financo/server/types/records/achievement"
	"financo/server/types/records/achievement/savings_goal"
	"time"
)

type query struct {
	db        postgres_database.Service
	timestamp time.Time
}

func New(db postgres_database.Service) queries.Query[[]response.Achievable] {
	return &query{
		db:        db,
		timestamp: time.Now().UTC(),
	}
}

func (q *query) Find(ctx context.Context) ([]response.Achievable, error) {
	var (
		res = make([]response.Achievable, 0, 20)
	)

	conn, err := q.db.Conn(ctx)
	if err != nil {
		return res, errors.Join(errors.New("list_achieved_query: failed to connect to database"), err)
	}
	defer conn.Close()

	achievables, err := q.findSavingsGoals(ctx, conn)
	if err != nil {
		return nil, errors.Join(errors.New("list_achieved_query: failed to retrieve savings goals"), err)
	}

	res = append(res, achievables...)

	return res, nil
}

func (q *query) findSavingsGoals(ctx context.Context, conn *sql.Conn) ([]response.Achievable, error) {
	res := make([]response.Achievable, 0, 10)

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
			achieved_at IS NOT NULL
			AND deleted_at IS NULL
			AND kind = $1
			AND achieved_at <= $2
		ORDER BY
			achieved_at DESC
		`,
		achievement.SavingsGoal,
		q.timestamp,
	)
	if err != nil {
		return res, errors.Join(errors.New("list_achieved_query: failed to retrieve records"), err)
	}
	defer rows.Close()

	for rows.Next() {
		var r savings_goal.Record

		err = rows.Scan(
			&r.ID,
			&r.Kind,
			&r.Name,
			&r.Description,
			&r.Settings,
			&r.AchievedAt,
			&r.DeletedAt,
			&r.CreatedAt,
			&r.UpdatedAt,
		)
		if err != nil {
			return res, errors.Join(errors.New("list_achieved_query: failed to scan record"), err)
		}

		res = append(res, r)
	}

	return res, nil
}
