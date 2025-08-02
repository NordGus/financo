package requests

type Reorder struct {
	ID   int64 `json:"id"`
	From int   `json:"from"`
	To   int   `json:"to"`
}
