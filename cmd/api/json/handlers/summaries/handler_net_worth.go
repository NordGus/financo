package summaries

import (
	"encoding/json"
	"financo/server/summary/quries/summary_for_kind_query"
	"financo/server/types/records/account"
	"log"
	"net/http"
)

func NetWorth(w http.ResponseWriter, r *http.Request) {
	var (
		kinds = []account.Kind{
			account.CapitalNormal,
			account.CapitalSavings,
			account.DebtLoan,
			account.DebtPersonal,
			account.DebtCredit,
		}
	)

	res, err := summary_for_kind_query.New(kinds).Find(r.Context())
	if err != nil {
		log.Println("query failed", err)
		http.Error(
			w,
			http.StatusText(http.StatusInternalServerError),
			http.StatusInternalServerError,
		)
		return
	}

	response, err := json.Marshal(res)
	if err != nil {
		log.Println("failed json Marshal", err)
		http.Error(
			w,
			http.StatusText(http.StatusInternalServerError),
			http.StatusInternalServerError,
		)
		return
	}

	_, err = w.Write(response)
	if err != nil {
		http.Error(
			w,
			http.StatusText(http.StatusInternalServerError),
			http.StatusInternalServerError,
		)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Header().Add("Content-Type", "application/json")
}
