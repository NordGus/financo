package queries

import "context"

type Query[Response any] interface {
	Find(ctx context.Context) (Response, error)
}
