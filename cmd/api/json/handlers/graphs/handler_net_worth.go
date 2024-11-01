package graphs

import (
	"encoding/json"
	"financo/core/scope_graphs/application/balance_summary_query"
	"financo/core/scope_graphs/domain/requests"
	"financo/core/scope_graphs/infrastructure/balance_for_kinds_repository"
	"financo/models/account"
	"financo/services/postgresql_database"
	"log"
	"net/http"
)

func NetWorth(w http.ResponseWriter, r *http.Request) {
	req := requests.BalanceForKinds{
		Kinds: []account.Kind{
			account.CapitalNormal,
			account.CapitalSavings,
			account.DebtLoan,
			account.DebtPersonal,
			account.DebtCredit,
		},
	}

	res, err := balance_summary_query.New(
		req,
		balance_for_kinds_repository.NewPostgreSQL(postgresql_database.New()),
	).Find(r.Context())
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
