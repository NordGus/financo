package category

import "financo/models/account"

type Record struct {
	Parent   account.Record
	Children []account.Record
}
