// shutdown is a service to handle panic like states with ensuring correct
// shutdown of application's services and processes.
//
// It works as a Last-In-First-Out queue, where the last [Closure] registered is
// the first to be executed.
package shutdown

import (
	"log"
	"math"
	"os"
)

// Closure is a container that contains the closure func and its name for
// identification.
type Closure struct {
	Name string
	Func func()
}

var (
	deferred [math.MaxUint16]Closure

	size = 0
)

// Register adds a new [Closure] to the shutdown procedure. This [Closure] will
// become the first one to be executed when [Exit] is called.
func Register(closure Closure) {
	if size >= math.MaxUint16 {
		log.Printf("shutdown: failed to register %s the shutdown procedure, reason: shutdown stack full.\n", closure.Name)
		Exit(1)
	}

	deferred[size] = closure
	size++

	log.Printf("shutdown: %s was added to the shutdown procedure.\n", closure.Name)
}

// Exit execute the shutdown procedure and calls [os.Exit] with the given code
// after calling all registered [Closure].
func Exit(code int) {
	log.Println("shutdown: shutdown procedure started.")

	for i := size - 1; i >= 0; i-- {
		log.Printf("shutdown: shutting down %s.", deferred[i].Name)

		deferred[i].Func()
	}

	size = 0

	log.Println("shutdown: shutdown procedure finished.")
	os.Exit(code)
}
