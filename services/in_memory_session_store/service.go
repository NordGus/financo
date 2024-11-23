package in_memory_session_store

import (
	"context"
	"errors"
	"financo/core/domain/services"
	"financo/models/session"
	"fmt"
	"log"
	"sync"
)

type service struct {
	mutex    sync.RWMutex
	up       bool
	sessions map[string]session.Record
}

var (
	ErrServiceDown = errors.New("in_memory_session_store: service is down")
	instance       *service
)

// New returns an instance of an In Memory [services.SessionStoreService].
//
// - It will either return the exiting instance or initialize a new one.
func New() services.SessionStoreService {
	if instance != nil {
		return instance
	}

	instance = &service{
		up:       true,
		sessions: make(map[string]session.Record, 10),
	}

	return instance
}

// Health checks the health of the session connection by checking the instance.
// It returns a map with keys indicating various health statistics.
func (s *service) Health() map[string]string {
	s.mutex.RLock()
	defer s.mutex.RUnlock()

	stats := make(map[string]string)

	if !s.up {
		stats["status"] = "down"
		stats["error"] = "session store down"
		log.Fatal("session store down") // Log the error and terminate the program
		return stats
	}

	stats["status"] = "up"
	stats["message"] = "It's healthy"

	return stats
}

// Get retrieves the [session.Record] associated with the given ID.
func (s *service) Get(ctx context.Context, id string) (session.Record, error) {
	s.mutex.RLock()
	defer s.mutex.RUnlock()

	var record session.Record

	if !s.up {
		return record, ErrServiceDown
	}

	record, ok := s.sessions[id]
	if !ok {
		return record, fmt.Errorf("in_memory_session_store: session %s not found", id)
	}

	return record, nil
}

// Save persists the given [session.Record] to memory.
func (s *service) Save(_ context.Context, record session.Record) error {
	s.mutex.Lock()
	defer s.mutex.Unlock()

	if !s.up {
		return ErrServiceDown
	}

	s.sessions[record.ID] = record

	return nil
}

func (s *service) Delete(_ context.Context, id string) error {
	s.mutex.Lock()
	defer s.mutex.Unlock()

	if !s.up {
		return ErrServiceDown
	}

	_, present := s.sessions[id]
	if !present {
		return fmt.Errorf("in_memory_session_store: session %s not found", id)
	}

	delete(s.sessions, id)

	return nil
}

func (s *service) Close() error {
	s.mutex.Lock()
	defer s.mutex.Unlock()

	if !s.up {
		return ErrServiceDown
	}

	s.up = false

	ids := make([]string, 0, len(s.sessions))

	for id := range s.sessions {
		ids = append(ids, id)
	}

	for i := 0; i < len(ids); i++ {
		delete(s.sessions, ids[i])
	}

	return nil
}
