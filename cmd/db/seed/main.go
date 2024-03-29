package main

import (
	"context"
	"database/sql"
	"log"
	"os"
	"time"

	pgadapter "financo/internal/adapters/secondary/postgres"
	"financo/internal/core/services/users"
	pgdb "financo/internal/database/postgresql"
)

func main() {
	var (
		pg = pgdb.New(
			os.Getenv("PG_DB_USERNAME"),
			os.Getenv("PG_DB_PASSWORD"),
			os.Getenv("PG_DB_HOST"),
			os.Getenv("PG_DB_PORT"),
			os.Getenv("PG_DB_DATABASE"),
			func(db *sql.DB) { db.SetMaxOpenConns(10) },
			func(db *sql.DB) { db.SetMaxIdleConns(5) },
			func(db *sql.DB) { db.SetConnMaxIdleTime(15 * time.Second) },
		)

		usersRepo = pgadapter.NewUsersRepository(pg.DB())

		usersserv = users.NewService(usersRepo)
	)
	defer pg.Close()

	resp, err := usersserv.CreateUser(context.Background(), users.CreateReq{
		Username:             "jrico",
		Password:             "localdev",
		PasswordConfirmation: "localdev",
	})
	if err != nil {
		log.Fatalln(err)
	}

	log.Println(resp)
}
