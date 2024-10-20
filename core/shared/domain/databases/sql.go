package databases

import (
	"context"
	"database/sql"
)

type SQLDatabaseAdapter interface {
	Conn(ctx context.Context) (*sql.Conn, error)
}
