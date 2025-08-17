// Package termination contains the implementation details for financo's
// shutdown system, it is inspired by rockets flight terminations systems.
//
// It contains a global [sync.WaitGroup] to dirty state within financo, product
// of any early shutdowns while system events are being process in the
// background.
//
// It also contains a global
package termination

import (
	"errors"
	"log"
	"math"
	"os"
	"sync"
)

var (
	ErrShutdownStackFull = errors.New("termination: shutdown stack is full")

	// shutdownStack contains the [Closure] array for shutdownStack queue, it has a maximum size of [math.MaxUint16]
	// 65535 [Closure].
	shutdownStack [math.MaxUint16]closure

	// size is the pointer to the last element position in the deferred queue.
	size = 0

	// wg contains the global [sync.WaitGroup] for concurrency synchronization.
	wg *sync.WaitGroup

	// mu is the inner [sync.Mutex] of the shutdown service
	mu sync.Mutex

	// tracing is a simple flag that indicates if the system should run with
	// tracing on or not for debugging.
	tracing bool
)

// Arm initializes the termination system, it is design to prevent multiple
// initialization.
//
// withTracing param is used to active debug mode.
func Arm(withTracing bool) {
	if wg != nil {
		return
	}

	wg = new(sync.WaitGroup)
	tracing = withTracing
}

func RegisterShutdown(name string, shutdown func()) {
	clsr := newClosure(name, shutdown)

	mu.Lock()
	defer mu.Unlock()

	if size >= math.MaxUint16 {
		if tracing {
			log.Printf("termination: failed to register shutdown %s\n", clsr.name)
		}
		exit(1, ErrShutdownStackFull)
	}

	shutdownStack[size] = clsr
	size++

	if tracing {
		log.Printf("termination: %s registered\n", clsr.name)
	}
}

func AddTasks(delta int) {
	if tracing {
		log.Println("termination: tracking", delta, "system(s)")
	}

	wg.Add(delta)
}

func TaskDone() {
	if tracing {
		log.Println("termination: system has shutdown, removing tracking")
	}

	wg.Done()
}

func WaitForShutdownAndDisarm() {
	wg.Wait()
	exit(0, nil)
}

func TerminateWithErr(code int, err error) {
	exit(code, err)
}

func TerminateFromPanic(code int, systemPanic systemPanic) {
	exit(code, systemPanic)
}

func exit(code int, err error) {
	mu.Lock()
	defer mu.Unlock()

	if err != nil && tracing {
		log.Println("termination: something went terribly wrong, executing shutdown stack, reason:")
		log.Println(err.Error())
	} else if tracing {
		log.Println("termination: executing shutdown stack")
	}

	wg.Wait()

	for i := size - 1; i >= 0; i-- {
		if tracing {
			log.Printf("\ttermination: executing %s closure", shutdownStack[i].name)
		}

		shutdownStack[i].closure()
	}

	size = 0

	if tracing {
		log.Println("termination: defer closures executed")
		log.Println("\ttermination: exiting financo")
	}

	os.Exit(code)
}
