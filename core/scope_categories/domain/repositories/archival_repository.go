package repositories

import (
	"context"
	"time"
)

type ArchivalRepository interface {
	Archive(ctx context.Context, id int64, timestamp time.Time) error
}
