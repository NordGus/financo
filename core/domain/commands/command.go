package commands

import (
	"context"
)

type Command[Response any] interface {
	Run(context.Context) (Response, error)
}
