package requests

type Archive struct {
	ID int64
}

type ArchiveChild struct {
	ID       int64
	ParentID int64
}
