package requests

type Delete struct {
	ID int64
}

type DeleteChild struct {
	ID       int64
	ParentID int64
}
