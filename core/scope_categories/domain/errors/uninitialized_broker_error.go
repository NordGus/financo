package errors

import "errors"

var ErrUninitialized = errors.New("broker_handler: handler was not initialized")
