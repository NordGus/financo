package requests

type Unarchive struct {
	ID int64
}

type UnarchiveChild struct {
	ID       int64
	ParentID int64
}
