package databases

import (
	"context"
	"database/sql"
)

type SQLAdapter interface {
	Conn(ctx context.Context) (*sql.Conn, error)
}
