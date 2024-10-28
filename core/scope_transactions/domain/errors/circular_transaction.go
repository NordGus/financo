package errors

import "errors"

var ErrCircularTransaction = errors.New("create_command: circular transaction")
