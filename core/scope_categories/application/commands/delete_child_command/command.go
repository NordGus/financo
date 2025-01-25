package delete_child_command

import (
	"context"
	"financo/core/domain/commands"
	"financo/core/scope_categories/domain/brokers"
	"financo/core/scope_categories/domain/messages"
	"financo/core/scope_categories/domain/repositories"
	"financo/core/scope_categories/domain/requests"
	"financo/core/scope_categories/domain/responses"
	"financo/lib/nullable"
	"fmt"
	"time"
)

type command struct {
	req     requests.DeleteChild
	destroy repositories.DeleteRepository
	broker  brokers.Deleted
}

func New(
	req requests.DeleteChild,
	destroy repositories.DeleteRepository,
	broker brokers.Deleted,
) commands.Command[responses.ListedChild] {
	return &command{
		req:     req,
		destroy: destroy,
		broker:  broker,
	}
}

func (c *command) Run(ctx context.Context) (responses.ListedChild, error) {
	var (
		timestamp = time.Now().UTC()

		res responses.ListedChild
	)

	parent, err := c.destroy.Find(ctx, c.req.ParentID)
	if err != nil {
		return res, err
	}

	record, err := c.destroy.Find(ctx, c.req.ID)
	if err != nil {
		return res, err
	}

	if !record.Parent.ParentID.Valid {
		return res, fmt.Errorf("delete_child_command: category id=(%d) is not a child category", c.req.ID)
	}

	if record.Parent.ParentID.Val != parent.Parent.ID {
		return res, fmt.Errorf(
			"delete_child_command: category id=(%d) is not the parent of category id=(%d)",
			c.req.ParentID,
			c.req.ID,
		)
	}

	if record.Parent.ID <= 0 {
		return res, fmt.Errorf("delete_child_command: category id=(%d) not found", record.Parent.ID)
	}

	record.Parent.DeletedAt = nullable.New(timestamp)
	record.Parent.UpdatedAt = timestamp

	for i := 0; i < len(record.Children); i++ {
		record.Children[i].DeletedAt = nullable.New(timestamp)
		record.Children[i].UpdatedAt = timestamp
	}

	err = c.destroy.SoftDelete(ctx, record)
	if err != nil {
		return res, err
	}

	err = c.broker.Publish(messages.Deleted{Record: record.Parent})
	if err != nil {
		return res, err
	}

	return responses.NewListedChildFromAccountRecord(record.Parent), nil
}
