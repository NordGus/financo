// shutdown is a service to handle panic like states while ensuring correct
// shutdown of application's defer processes.
//
// It works as a Last-In-First-Out queue, where the last [Closure] registered is
// the first to be executed.
//
// This is a dumb idea. It would help me to implement a panic like behavior.
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
	// deferred contains the defer queue, it has a maximum size of [math.MaxUint16]
	// 65535 [Closure].
	deferred [math.MaxUint16]Closure

	// size is the pointer to the last element position in the deferred queue.
	size = 0
)

// Defer adds a new [Closure] to the defer queue. This [Closure] will  become
// the first one to be executed when [Exit] is called.
func Defer(closure Closure) {
	if size >= math.MaxUint16 {
		log.Printf("shutdown: failed to defer %s, reason: shutdown stack full.\n", closure.Name)
		Exit(1)
	}

	deferred[size] = closure
	size++

	log.Printf("shutdown: %s deferred.\n", closure.Name)
}

// Exit execute all [Closure] deferred and calls [os.Exit] with the given code
// afterwards.
func Exit(code int) {
	log.Println("shutdown: executing defer queue.")

	for i := size - 1; i >= 0; i-- {
		log.Printf("shutdown: executing %s.", deferred[i].Name)

		deferred[i].Func()
	}

	size = 0

	log.Println("shutdown: defer queue executed.")
	os.Exit(code)
}
