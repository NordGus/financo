package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"server/db"
	"server/internal/systems/termination"
	"syscall"
)

func main() {
	// Initializing termination system
	termination.Arm(true)

	// Adding a panic protection defer function
	defer func() {
		if err := recover(); err != nil {
			termination.TerminateFromPanic(69, termination.NewUnexpectedPanic(err))
		}
	}()

	// initializing base application context
	ctx, cancel := context.WithCancel(context.Background())

	// initializing database
	database, err := db.NewDatabase(ctx)
	if err != nil {
		termination.TerminateWithErr(1, err)
	}

	termination.RegisterShutdown("database", func() {
		err := database.Close()

		if err != nil {
			log.Println("financo: an error occurred while shooting down database, reason:", err.Error())
		}
	})

	// Listen for termination signals
	signalCh := make(chan os.Signal, 1)
	signal.Notify(signalCh, syscall.SIGINT, syscall.SIGTERM)

	<-signalCh

	cancel()

	termination.WaitForShutdownAndDisarm()
}
