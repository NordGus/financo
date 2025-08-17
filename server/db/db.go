// Package db contains the implementation for the database initialization and
// management.
package db

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"server/utils"
	"time"

	"github.com/uptrace/bun"
	"github.com/uptrace/bun/dialect/pgdialect"
	"github.com/uptrace/bun/driver/pgdriver"
)

var (
	ErrInitialization    = errors.New("db: failed to initialize database")
	ErrInitialConnFailed = errors.New("db: failed to stablish initial connection to database")

	database = utils.GetEnv("DB_DATABASE", "financo_development")
	password = utils.GetEnv("DB_PASSWORD", "local_dev")
	username = utils.GetEnv("DB_USERNAME", "financo")
	port     = utils.GetEnv("DB_PORT", "5432")
	host     = utils.GetEnv("DB_HOST", "postgres")
	schema   = utils.GetEnv("DB_SCHEMA", "public")
)

func NewDatabase(ctx context.Context) (*bun.DB, error) {
	db, err := newDatabase(ctx)
	if err != nil {
		return nil, errors.Join(ErrInitialization, err)
	}

	return db, nil
}

func newDatabase(ctx context.Context) (*bun.DB, error) {
	sqlDB := sql.OpenDB(pgdriver.NewConnector(
		pgdriver.WithDSN(
			fmt.Sprintf(
				"postgres://%s:%s@%s:%s/%s?sslmode=disable&search_path=%s",
				username,
				password,
				host,
				port,
				database,
				schema,
			),
		),
	))

	sqlDB.SetMaxOpenConns(25)                 // Maximum open database connections
	sqlDB.SetMaxIdleConns(10)                 // Maximum idle database connections
	sqlDB.SetConnMaxLifetime(5 * time.Minute) // Connection lifetime
	sqlDB.SetConnMaxIdleTime(5 * time.Minute) // Idle connection timeout

	// Testing connection to the database
	if err := sqlDB.Ping(); err != nil {
		return nil, errors.Join(ErrInitialConnFailed, err)
	}

	db := bun.NewDB(sqlDB, pgdialect.New())

	return db, nil
}
