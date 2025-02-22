package main

import (
	"context"
	"database/sql"
	"financo/services/shutdown"
	"fmt"
	"log"
	"os"
	"strings"
	"time"

	_ "github.com/jackc/pgx/v5/stdlib"
	_ "github.com/joho/godotenv/autoload"
)

var (
	database = os.Getenv("DB_DATABASE")
	password = os.Getenv("DB_PASSWORD")
	username = os.Getenv("DB_USERNAME")
	port     = os.Getenv("DB_PORT")
	host     = os.Getenv("DB_HOST")
)

func main() {
	shutdown.Arm()

	var (
		ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
		connStr     = fmt.Sprintf("postgres://%s:%s@%s:%s/postgres?sslmode=disable", username, password, host, port)
	)

	shutdown.Defer(shutdown.Closure{
		Name: "context.CancelFunc",
		Func: cancel,
	})

	log.Println("creating database")

	db, err := sql.Open("pgx", connStr)
	if err != nil {
		log.Fatalln("failed to connect to database server", err)
	}

	shutdown.Defer(shutdown.Closure{
		Name: "db.Close",
		Func: func() { db.Close() },
	})

	_, err = db.ExecContext(ctx, fmt.Sprintf("CREATE DATABASE %v;", database))
	if err != nil {
		errCreateDatabase(err)
		return
	}

	log.Printf("\"%s\" created\n", database)
	shutdown.Exit(0)
}

func errCreateDatabase(err error) {
	if strings.Contains(err.Error(), fmt.Sprintf("database \"%s\" already exists", database)) {
		log.Printf("\"%s\" already exists\n", database)
	} else {
		log.Printf("failed to create database: %s\n", err.Error())
		shutdown.Exit(1)
	}
}
