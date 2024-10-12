package transactions

import (
	"financo/server/types/generic/nullable"
	"time"
)

type accountKey struct {
	Key       string
	ParentKey nullable.Type[string]
}

type transactionsSeed struct {
	Source       accountKey
	Target       accountKey
	SourceAmount int64
	TargetAmount int64
	Notes        nullable.Type[string]
	IssuedAt     func(moment time.Time) time.Time
	ExecutedAt   func(moment time.Time) nullable.Type[time.Time]
	DeletedAt    func(moment time.Time) nullable.Type[time.Time]
}

var (
	data = []transactionsSeed{}
)
