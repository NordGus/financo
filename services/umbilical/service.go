// umbilical is the websocket communications system develop for financo.
package umbilical

import (
	"encoding/json"
	"errors"
	"financo/services/shutdown"
	"fmt"
	"log"
	"net"
	"sync"
)

var (
	instance *service
)

type Packet interface {
	PacketKind() string
}

type service struct {
	mutex    sync.RWMutex
	channels map[string]*channel
}

type Service interface {
	Close() error
	Disconnect(id string) error
	Connect(id string, conn net.Conn) error
	Dispatch(packet Packet) error
}

func New() Service {
	if instance != nil {
		return instance
	}

	instance = &service{
		channels: make(map[string]*channel, 10),
	}

	shutdown.Defer(shutdown.Closure{
		Name: "umbilical service",
		Func: func() {
			if err := instance.Close(); err != nil {
				log.Printf("failed to close umbilical connection: %s\n", err)
			}
		},
	})

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

func (s *service) Dispatch(packet Packet) error {
	s.mutex.RLock()
	defer s.mutex.RUnlock()

	msg, err := json.Marshal(packet)
	if err != nil {
		return err
	}

	for _, ch := range s.channels {
		ch.send <- msg
	}

	return nil
}

func (s *service) Close() error {
	var err error

	for _, ch := range s.channels {
		err = errors.Join(err, ch.close())
	}

	return err
}
