package category

import "financo/models/account"

type Record struct {
	Account  account.Record
	Children []account.Record
}
