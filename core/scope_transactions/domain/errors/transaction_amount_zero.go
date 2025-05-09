package errors

import "errors"

var ErrTransactionAmountZero = errors.New("create_command: transaction amount is zero")
