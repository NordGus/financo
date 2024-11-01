package requests

import (
	"financo/core/scope_graphs/domain/filters"
	"financo/lib/nullable"
	"financo/models/account"
	"time"
)

type AvailableCredit struct {
	From nullable.Type[time.Time]
	To   nullable.Type[time.Time]
}

func (r AvailableCredit) ToFilter() filters.BalanceForKinds {
	return filters.BalanceForKinds{
		Kinds: []account.Kind{account.DebtCredit},
		From:  r.From,
		To:    r.To,
	}
}
