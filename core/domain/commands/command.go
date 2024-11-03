package commands

import (
	"context"
)

type Command[Response any] interface {
	Run(ctx context.Context) (Response, error)
}
