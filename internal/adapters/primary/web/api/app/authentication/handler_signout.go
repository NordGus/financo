package authentication

import (
	"net/http"

	"financo/internal/adapters/primary/web/api/app/models"
	"financo/internal/core/services/authentication"
	"github.com/labstack/echo/v4"
)

func (h *handler) SignOutHandlerFunc(c echo.Context) error {
	var (
		usr = c.Get(CurrentUserCtxKey).(models.User)

		req = authentication.SignOutUserReq{
			UserID: usr.ID.String(),
		}
	)

	// this api call is basically fire and forget, but I'll still gonna check the error for login purposes
	_, err := h.api.SignOut(c.Request().Context(), req)
	if err != nil {
		c.Logger().Error(err)
	}

	return c.Redirect(http.StatusTemporaryRedirect, LoginRoute)
}
