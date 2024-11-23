package middleware

import (
	"context"
	"financo/core/application/commands/get_session_command"
	"financo/core/domain/requests"
	"financo/core/infrastructure/repositories/session_repository"
	"financo/lib/nullable"
	"financo/services/in_memory_session_store"
	"log"
	"net/http"
)

// TODO: Make more robust

type SessionKeyType string

const (
	SessionCookieName                = "_financo_session"
	SessionKey        SessionKeyType = "_session_key"
)

func Session(sameSite http.SameSite) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			var req requests.Session

			cookie, err := r.Cookie(SessionCookieName)
			if err != nil {
				cookie = &http.Cookie{
					Name:     SessionCookieName,
					Path:     "/",
					MaxAge:   3600 * 24 * 365, // 365 days
					HttpOnly: true,
					Secure:   true,
					SameSite: sameSite,
				}
			} else {
				req.ID = nullable.New(cookie.Value)
			}

			session, err := get_session_command.New(
				req,
				session_repository.NewInMemory(in_memory_session_store.New()),
			).Run(r.Context())
			if err != nil {
				log.Println("failed to retrieve session", err)
				http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
				return
			}

			cookie.Value = session.ID

			http.SetCookie(w, cookie)

			ctx := context.WithValue(r.Context(), SessionKey, &session)

			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
