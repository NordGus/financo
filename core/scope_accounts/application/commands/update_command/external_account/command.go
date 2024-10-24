package external_account

import (
	"cmp"
	"context"
	"errors"
	"financo/core/domain/commands"
	"financo/core/scope_accounts/domain/brokers"
	"financo/core/scope_accounts/domain/messages"
	"financo/core/scope_accounts/domain/repositories"
	"financo/core/scope_accounts/domain/requests"
	"financo/core/scope_accounts/domain/responses"
	"financo/models/account"
	"slices"
	"time"
)

type command struct {
	req    requests.Update
	repo   repositories.UpdateAccountWithChildrenRepository
	broker brokers.UpdatedBroker
}

func New(
	req requests.Update,
	repo repositories.UpdateAccountWithChildrenRepository,
	broker brokers.UpdatedBroker,
) commands.Command[responses.Detailed] {
	return &command{
		req:    req,
		repo:   repo,
		broker: broker,
	}
}

func (c *command) Run(ctx context.Context) (responses.Detailed, error) {
	var (
		res responses.Detailed

		timestamp = time.Now().UTC()
		children  = make([]account.Record, 0, 10)
		record    = requests.UpdateToAccountRecord(c.req, timestamp)
	)

	record.Capital = 0

	for i := 0; i < len(c.req.Children); i++ {
		child := requests.UpdateChildToAccountRecord(record, c.req.Children[i], timestamp)

		children = append(children, child)
	}

	records, err := c.repo.FindWithChildren(ctx, record.ID)
	if err != nil {
		return res, err
	}

	if records.Record.Kind != record.Kind {
		return res, errors.New("update_command: account's kind can't be changed")
	}

	record.CreatedAt = records.Record.CreatedAt

	slices.SortFunc(children, func(a, b account.Record) int {
		return cmp.Compare(a.ID, b.ID)
	})

	offset := 0

	for i := 0; i < len(children); i++ {
		if children[i].ID <= 0 {
			offset++
			continue
		}

		children[i].CreatedAt = records.Children[i-offset].CreatedAt
	}

	res, err = c.repo.SaveWithChildren(ctx, repositories.SaveAccountWithChildrenArgs{
		Record:   record,
		Children: children,
	})
	if err != nil {
		return res, err
	}

	err = c.broker.Publish(messages.Updated{
		Previous: records.Record,
		Current:  record,
	})
	if err != nil {
		return res, err
	}

	return res, nil
}
