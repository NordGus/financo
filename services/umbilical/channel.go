package umbilical

import (
	"encoding/json"
	"log"
	"net"

	"github.com/gobwas/ws"
	"github.com/gobwas/ws/wsutil"
)

const (
	channelSendBufferSize = 10
)

type channel struct {
	id   string
	conn net.Conn     // Websocket connection
	send chan []uint8 // Outgoing packets queue
}

// newChannel returns a [Channel] for the user to handle
func newChannel(id string, conn net.Conn) *channel {
	c := &channel{
		id:   id,
		conn: conn,
		send: make(chan []uint8, channelSendBufferSize),
	}

	go c.reader()
	go c.writer()

	return c
}

func (ch *channel) reader() {
	defer instance.Disconnect(ch.id)

	for {
		pkt, op, err := wsutil.ReadClientData(ch.conn)
		if err != nil {
			log.Printf("umbilical: channel %s failed to read packet: %s\n", ch.id, err.Error())
			break
		}

		if op == ws.OpClose {
			log.Printf("umbilical: channel %s close by the client\n", ch.id)
			break
		}

		msg := make(map[string]any)

		err = json.Unmarshal(pkt, &msg)
		if err != nil {
			log.Printf("umbilical: channel %s failed to unmarshal packet: %s\n", ch.id, err.Error())
			break
		}

		log.Printf("umbilical: channel %s received packet: %+v", ch.id, msg)
	}
}

func (ch *channel) writer() {
	defer instance.Disconnect(ch.id)

	for packet := range ch.send {
		err := wsutil.WriteServerMessage(ch.conn, ws.OpText, packet)
		if err != nil {
			log.Printf("umbilical: channel %s failed to write message: %s", ch.id, err.Error())
		}
	}
}

func (ch *channel) close() error {
	err := ch.conn.Close()
	if err != nil {
		log.Println("umbilical: channel fail to close connection:", err)
	}

	close(ch.send)

	return err
}
