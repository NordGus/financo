package errors

import "errors"

var ErrTransactionNotesTooLong = errors.New("create_command: transaction notes too long")
