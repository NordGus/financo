// umbilical is the websocket communications system develop for financo.
package umbilical

import (
	"errors"
	"fmt"
	"net"
	"sync"
)

var (
	instance *service
)

type service struct {
	mutex    sync.RWMutex
	channels map[string]*channel
}

type Service interface {
	Close() error
	Disconnect(id string) error
	Connect(id string, conn net.Conn) error
	Dispatch(message []uint8) error
}

type Packet []uint8

func New() Service {
	if instance != nil {
		return instance
	}

	instance = &service{
		channels: make(map[string]*channel, 10),
	}

	return instance
}

func (s *service) Connect(id string, conn net.Conn) error {
	s.mutex.Lock()
	defer s.mutex.Unlock()

	_, ok := s.channels[id]

	if ok {
		return fmt.Errorf("umbilical: channel %s present", id)
	}

	ch := newChannel(id, conn)

	s.channels[id] = ch

	return nil
}

func (s *service) Disconnect(id string) error {
	s.mutex.Lock()
	defer s.mutex.Unlock()

	ch, ok := s.channels[id]

	if !ok {
		return fmt.Errorf("umbilical: channel %s not present", id)
	}

	delete(s.channels, id)

	return ch.close()
}

func (s *service) Dispatch(message []uint8) error {
	s.mutex.RLock()
	defer s.mutex.RUnlock()

	var err error

	for _, ch := range s.channels {
		ch.send <- Packet(message)
	}

	return err
}

func (s *service) Close() error {
	var err error

	for _, ch := range s.channels {
		err = errors.Join(err, ch.close())
	}

	return err
}
