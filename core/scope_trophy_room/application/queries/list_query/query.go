package list_query

import (
	"context"
	"financo/core/domain/queries"
	"financo/core/scope_trophy_room/domain/filters"
	"financo/core/scope_trophy_room/domain/repositories"
	"financo/core/scope_trophy_room/domain/requests"
	"financo/core/scope_trophy_room/domain/responses"
	"financo/models/achievement"
)

type query struct {
	req        requests.List
	milestones repositories.Milestones
}

func New(req requests.List, milestonesRepo repositories.Milestones) queries.Query[[]responses.Milestone] {
	return &query{
		req:        req,
		milestones: milestonesRepo,
	}
}

func (q *query) Find(ctx context.Context) ([]responses.Milestone, error) {
	var (
		res      = make([]responses.Milestone, 0, 30)
		position = -1
	)

	milestones, err := q.milestones.Where(ctx, filters.Milestones{
		From:  filters.DateToLimit(q.req.From.OrElse(filters.FromDefault()), true),
		To:    filters.DateToLimit(q.req.To.OrElse(filters.ToDefault()), true),
		Kinds: filters.FilterMilestoneKinds(q.req.Kinds),
	})
	if err != nil {
		return res, err
	}

	// Values coming from milestones repository are assumed to be sorted from newest to oldest
	for _, milestone := range milestones {
		if position < 0 || !res[position].Timestamp.Equal(milestone.AchievedAtValue()) {
			res = append(res, responses.Milestone{
				Timestamp:    milestone.AchievedAtValue(),
				Achievements: make([]achievement.Milestone, 0, 10),
			})
			position++
		}

		res[position].Achievements = append(res[position].Achievements, milestone)
	}

	return res, nil
}
