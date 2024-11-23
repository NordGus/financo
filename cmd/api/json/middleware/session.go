package middleware

import (
	"context"
	"financo/cmd/api/json/config"
	"financo/core/application/commands/get_session_command"
	"financo/core/domain/requests"
	"financo/core/infrastructure/repositories/session_repository"
	"financo/services/in_memory_session_store"
	"log"
	"net/http"
)

func Session(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var req requests.Session

		cookie, err := r.Cookie(config.SessionCookieName)
		if err != nil {
			log.Println("failed to retrieve session", err)
			http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
			return
		}

		err = cookie.Valid()
		if err != nil {
			log.Println("failed to retrieve session", err)
			http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
			return
		}

		req.ID = cookie.Value

		session, err := get_session_command.New(
			req,
			session_repository.NewInMemory(in_memory_session_store.New()),
		).Run(r.Context())
		if err != nil {
			log.Println("failed to retrieve session", err)
			http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
			return
		}

		ctx := context.WithValue(r.Context(), config.SessionKey, &session)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
