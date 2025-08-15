package requests

import "financo/lib/currency"

type List struct {
	Currencies []currency.Type
}
