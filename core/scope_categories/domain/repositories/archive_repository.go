package repositories

import (
	"context"
	"time"
)

type ArchiveRepository interface {
	Archive(ctx context.Context, id int64, timestamp time.Time) error
}
