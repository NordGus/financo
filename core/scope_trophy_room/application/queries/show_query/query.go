package show_query

import (
	"context"
	"financo/core/domain/queries"
	"financo/core/scope_trophy_room/domain/repositories"
	"financo/core/scope_trophy_room/domain/requests"
	"financo/models/achievement"
)

type query struct {
	req        requests.Show
	milestones repositories.Milestone
}

func New(req requests.Show, milestoneRepo repositories.Milestone) queries.Query[achievement.Milestone] {
	return &query{
		req:        req,
		milestones: milestoneRepo,
	}
}

func (q *query) Find(ctx context.Context) (achievement.Milestone, error) {
	var res achievement.Milestone

	res, err := q.milestones.Find(ctx, q.req.ID)
	if err != nil {
		return res, err
	}

	return res, nil
}
