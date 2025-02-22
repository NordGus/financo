// Package shutdown is a service to handle panic like states while ensuring correct
// shutdown of application's defer processes.
//
// It works as a Last-In-First-Out queue, where the last [Closure] registered is
// the first to be executed.
//
// It would help me to implement a panic like behavior and centralize application shutdown.
package shutdown

import (
	"log"
	"math"
	"os"
	"sync"
)

// Closure is a container that contains the closure func and its name for
// identification.
type Closure struct {
	Name string
	Func func()
}

var (
	// deferred contains the [Closure] array for deferred queue, it has a maximum size of [math.MaxUint16]
	// 65535 [Closure].
	deferred [math.MaxUint16]Closure

	// size is the pointer to the last element position in the deferred queue.
	size = 0

	// wg contains the global [sync.WaitGroup] for concurrency synchronization.
	wg *sync.WaitGroup

	// mu is the inner [sync.Mutex] of the shutdown service
	mu sync.Mutex
)

// Arm initializes the shutdown service.
func Arm() {
	if wg == nil {
		wg = new(sync.WaitGroup)
	}
}

// AddTask adds delta, which may be negative, to the global [sync.WaitGroup] counter.
// If the counter becomes zero, all goroutines blocked on [WaitTasks] are released.
// If the counter goes negative, Add panics.
func AddTask(delta int) {
	wg.Add(delta)
}

// TaskDone decrements the global [sync.WaitGroup] counter by one.
func TaskDone() {
	wg.Done()
}

// WaitForTasksAndExit blocks until the global [sync.WaitGroup] counter is zero.
func WaitForTasksAndExit() {
	wg.Wait()
	Exit(0)
}

// Defer adds a new [Closure] to the defer queue. This [Closure] will  become
// the first one to be executed when [Exit] is called.
func Defer(closure Closure) {
	mu.Lock()
	defer mu.Unlock()

	if size >= math.MaxUint16 {
		log.Printf("shutdown: failed to defer %s, reason: shutdown stack full.\n", closure.Name)
		Exit(1)
	}

	deferred[size] = closure
	size++

	log.Printf("shutdown: %s deferred.\n", closure.Name)
}

// Exit execute all [Closure] deferred and calls [os.Exit] with the given code afterward.
func Exit(code int) {
	exit(code, nil)
}

// ExitWithErr execute all [Closure] deferred and calls [os.Exit] with the given code afterward,
// but logs the given error.
func ExitWithErr(code int, err error) {
	exit(code, err)
}

// exit executes the shutdown sequence.
func exit(code int, err error) {
	mu.Lock()
	defer mu.Unlock()

	if err != nil {
		log.Printf("shutdown: executing defer queue, reason: %s", err.Error())
	} else {
		log.Println("shutdown: executing defer queue.")
	}

	wg.Wait()

	for i := size - 1; i >= 0; i-- {
		log.Printf("shutdown: executing %s.", deferred[i].Name)

		deferred[i].Func()
	}

	size = 0

	log.Println("shutdown: defer queue executed.")
	os.Exit(code)
}
