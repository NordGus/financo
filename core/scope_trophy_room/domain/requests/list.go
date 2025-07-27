package requests

import (
	"financo/lib/nullable"
	"financo/models/achievement"
	"time"
)

type List struct {
	From  nullable.Type[time.Time]
	To    nullable.Type[time.Time]
	Kinds []achievement.Kind
}
