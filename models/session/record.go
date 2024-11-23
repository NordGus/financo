package session

import "time"

type Record struct {
	ID        string
	ExpiresAt time.Time
}
