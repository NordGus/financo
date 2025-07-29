// Package lock implements a global mutex lock for the savings goals
// achievements feature inside financo.
//
// This is done to prevent race conditions related with Go's stdlib net/http
// package concurrency model and how financo is designed. Because a user can
// trigger recalculations related to event consuming, this ensures that the
// subsystem maintains data consistency.
package lock

import "sync"

var instance *sync.RWMutex

// GlobalLock returns savings goal's global mutex
func GlobalLock() *sync.RWMutex {
	if instance == nil {
		instance = new(sync.RWMutex)
	}

	return instance
}
