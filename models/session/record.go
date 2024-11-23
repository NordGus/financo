package session

import "time"

type Record struct {
	ID        string
	ExpiresAt time.Time
}

func (s *Record) HasExpired() bool {
	return s.ExpiresAt.Before(time.Now().UTC())
}
