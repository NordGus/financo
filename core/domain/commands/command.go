// Package commands defines the interfaces that commands must follow.
package commands

import (
	"context"
)

type Command[Response any] interface {
	Run(ctx context.Context) (Response, error)
}
