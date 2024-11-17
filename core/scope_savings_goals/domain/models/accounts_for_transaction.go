package models

import "financo/models/account"

type AccountsForTransaction struct {
	Source account.Record
	Target account.Record
}
