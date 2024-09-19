package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"os"
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
	var (
		ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
		connStr     = fmt.Sprintf("postgres://%s:%s@%s:%s/postgres?sslmode=disable", username, password, host, port)
	)
	defer cancel()

	log.Println("dropping database")

	db, err := sql.Open("pgx", connStr)
	if err != nil {
		log.Fatalln("failed to connect to database server", err)
	}
	defer db.Close()

	_, err = db.ExecContext(ctx, fmt.Sprintf("DROP DATABASE IF EXISTS %v;", database))
	if err != nil {
		log.Fatalln("failed to drop database:", err.Error())
	}

	log.Printf("\"%s\" dropped\n", database)
}
