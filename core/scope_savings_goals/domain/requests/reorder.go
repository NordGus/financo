package requests

type Reorder struct {
	ID   int64 `json:"id"`
	From int64 `json:"from"`
	To   int64 `json:"to"`
}
