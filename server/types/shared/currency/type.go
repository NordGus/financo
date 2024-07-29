package currency

// [ ] TODO: refactor to be able to use better constructions

type Type string

type Entry struct {
	Name string `json:"name"`
	Code string `json:"code"`
}

var (
	CAD Type = "CAD"
	USD Type = "USD"
	AUD Type = "AUD"
	EUR Type = "EUR"
	CHF Type = "CHF"
	GBP Type = "GBP"
	RUB Type = "RUB"
	JPY Type = "JPY"
	CNY Type = "CNY"

	List = []Entry{
		{Name: "Canadian Dollar", Code: "CAD"},
		{Name: "US Dollar", Code: "USD"},
		{Name: "Australian Dollar", Code: "AUD"},
		{Name: "Euro", Code: "EUR"},
		{Name: "Swiss Franc", Code: "CHF"},
		{Name: "Pound Sterling", Code: "GBP"},
		{Name: "Russian Ruble", Code: "RUB"},
		{Name: "Japanese Yen", Code: "JPY"},
		{Name: "Chinese Yuan", Code: "CNY"},
	}
)
