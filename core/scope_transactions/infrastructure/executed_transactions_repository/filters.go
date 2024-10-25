package executed_transactions_repository

import "time"

func minimumDate() time.Time {
	return time.Now().UTC().AddDate(-200, 0, 0)
}

func maximumDate() time.Time {
	return time.Now().UTC().AddDate(200, 0, 0)
}
