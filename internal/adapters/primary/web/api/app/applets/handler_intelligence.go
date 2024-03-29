package applets

import (
	view "financo/internal/adapters/primary/web/api/app/views/applets"
	"github.com/labstack/echo/v4"
)

func (h *handler) IntelligenceAppletHandlerFunc(c echo.Context) error {
	return view.NotImplemented(
		layoutData(getUser(c), "financo | intelligence", intelligence),
		IntelligenceAppletRoute,
	).Render(c.Request().Context(), c.Response())
}
