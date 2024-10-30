package requests

import (
	"financo/core/scope_graphs/domain/filters"
	"financo/lib/nullable"
	"financo/models/account"
	"time"
)

type BalanceForKinds struct {
	Kinds []account.Kind
	From  nullable.Type[time.Time]
	To    nullable.Type[time.Time]
}

func (r BalanceForKinds) ToFilter() filters.BalanceForKinds {
	return filters.BalanceForKinds{
		Kinds: r.Kinds,
		From:  r.From,
		To:    r.To,
	}
}
