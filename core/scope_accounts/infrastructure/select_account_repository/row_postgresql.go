package select_account_repository

import (
	"financo/core/domain/records/account"
	"financo/core/scope_accounts/domain/responses"
	"financo/server/types/generic/nullable"
	"financo/server/types/shared/color"
	"financo/server/types/shared/currency"
	"financo/server/types/shared/icon"
	"time"
)

type rowPostgreSQL struct {
	id               int64
	kind             account.Kind
	currency         currency.Type
	name             string
	description      nullable.Type[string]
	color            color.Type
	icon             icon.Type
	archivedAt       nullable.Type[time.Time]
	createdAt        time.Time
	updatedAt        time.Time
	childId          nullable.Type[int64]
	childKind        nullable.Type[account.Kind]
	childCurrency    nullable.Type[currency.Type]
	childName        nullable.Type[string]
	childDescription nullable.Type[string]
	childColor       nullable.Type[color.Type]
	childIcon        nullable.Type[icon.Type]
	childArchivedAt  nullable.Type[time.Time]
	childCreatedAt   nullable.Type[time.Time]
	childUpdatedAt   nullable.Type[time.Time]
}

func (r rowPostgreSQL) toResponsesSelect() responses.Select {
	return responses.Select{
		ID:          r.id,
		Kind:        r.kind,
		Currency:    r.currency,
		Name:        r.name,
		Description: r.description,
		Color:       r.color,
		Icon:        r.icon,
		ArchivedAt:  r.archivedAt,
		CreatedAt:   r.createdAt,
		UpdatedAt:   r.updatedAt,
		Children:    make([]responses.SelectChild, 0, 10),
	}
}

func (r rowPostgreSQL) toResponsesSelectChild() responses.SelectChild {
	return responses.SelectChild{
		ID:          r.childId.Val,
		Kind:        r.childKind.Val,
		Currency:    r.childCurrency.Val,
		Name:        r.childName.Val,
		Description: r.childDescription,
		Color:       r.childColor.Val,
		Icon:        r.childIcon.Val,
		ArchivedAt:  r.childArchivedAt,
		CreatedAt:   r.childCreatedAt.Val,
		UpdatedAt:   r.childUpdatedAt.Val,
	}
}
