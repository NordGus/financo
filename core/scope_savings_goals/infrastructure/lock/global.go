// package lock implements a global mutex lock for the savings goals
// achievements feature inside financo.
//
// This is done because of the constant concurrency related with Go's stdlib
// net/http package concurrency model where a user can trigger recalculations
// by tracking, this ensures that the application maintains consistency in any
// moment.
package lock

import "sync"

var (
	// instance is an implementation detail for all the scope_saving_goals
	// consumers to prevent race conditions around savings goals automated
	// calculations.
	instance *sync.Mutex
)

// GlobalLock returns savings goal's tracking global mutex
func GlobalLock() *sync.Mutex {
	if instance != nil {
		return instance
	}

	instance = new(sync.Mutex)

	return instance
}
