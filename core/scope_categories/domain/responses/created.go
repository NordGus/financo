package responses

import (
	"financo/lib/color"
	"financo/lib/icon"
	"financo/models/account"
)

type Created struct {
	ID    int64        `json:"id"`
	Name  string       `json:"name"`
	Kind  account.Kind `json:"kind"`
	Color color.Type   `json:"color"`
	Icon  icon.Type    `json:"icon"`
}
