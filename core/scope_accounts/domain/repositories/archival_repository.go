package repositories

import (
	"context"
	"financo/lib/nullable"
	"time"
)

type ArchivalRepository interface {
	Archive(ctx context.Context, id int64, at nullable.Type[time.Time], timestamp time.Time) error
}
