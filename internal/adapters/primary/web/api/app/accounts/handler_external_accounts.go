package accounts

import (
	"financo/internal/adapters/primary/web/api/app/models"
	view "financo/internal/adapters/primary/web/api/app/views/accounts"
	"github.com/labstack/echo/v4"
)

func (h *handler) ExternalAccountsHandlerFunc(c echo.Context) error {
	acc := []models.Account{
		models.NewAccount(models.ExternalAccount, "Market", 10000, 0, models.EUR),
		models.NewAccount(models.ExternalAccount, "Subscriptions", 5000, 0, models.EUR),
		models.NewAccount(models.ExternalAccount, "Rent", 90000, 0, models.EUR),
		models.NewAccount(models.ExternalAccount, "Gifts", 7000, 0, models.EUR),
		models.NewAccount(models.ExternalAccount, "Health Care", 15000, 0, models.EUR),
		models.NewAccount(models.ExternalAccount, "Free Time", 2500, 0, models.EUR),
		models.NewAccount(models.ExternalAccount, "Interest", 20000, 0, models.EUR),
		models.NewAccount(models.ExternalAccount, "Lottery", 2000, 0, models.EUR),
	}

	return view.HTMXList(acc).Render(c.Request().Context(), c.Response())
}
