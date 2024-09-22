package message_bus

import "sync"

// Consumer is a function that accepts a [*sync.WaitGroup] from the [Message]
// and the [Message] payload's.
//
// The [Consumer] should only use the provided [*sync.WaitGroup] to indicate
// when the work is done.
type Consumer[Payload any] func(wg *sync.WaitGroup, payload Payload)
