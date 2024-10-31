package requests

import (
	"financo/core/scope_graphs/domain/filters"
	"financo/lib/nullable"
	"time"
)

type BalanceForAccount struct {
	ID   int64
	From nullable.Type[time.Time]
	To   nullable.Type[time.Time]
}

func (r BalanceForAccount) ToFilter() filters.BalanceForAccount {
	return filters.BalanceForAccount{
		ID:   r.ID,
		From: r.From,
		To:   r.To,
	}
}
