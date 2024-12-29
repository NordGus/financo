package errors

import "errors"

var ErrMessageBrokerUninitialized = errors.New("message_broker: handler was not initialized")
