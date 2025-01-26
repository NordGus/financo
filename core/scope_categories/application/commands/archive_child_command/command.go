package archive_child_command

import (
	"context"
	"financo/core/domain/commands"
	"financo/core/scope_categories/domain/brokers"
	"financo/core/scope_categories/domain/messages"
	"financo/core/scope_categories/domain/repositories"
	"financo/core/scope_categories/domain/requests"
	"financo/core/scope_categories/domain/responses"
	"fmt"
	"time"
)

type command struct {
	req        requests.ArchiveChild
	categories repositories.CategoryRepository
	archival   repositories.ArchivalRepository
	broker     brokers.Archived
}

func New(
	req requests.ArchiveChild,
	categories repositories.CategoryRepository,
	archival repositories.ArchivalRepository,
	broker brokers.Archived,
) commands.Command[responses.ListedChild] {
	return &command{
		req:        req,
		categories: categories,
		archival:   archival,
		broker:     broker,
	}
}

func (c *command) Run(ctx context.Context) (responses.ListedChild, error) {
	var (
		timestamp = time.Now().UTC()

		res responses.ListedChild
	)

	parent, err := c.categories.Find(ctx, c.req.ParentID)
	if err != nil {
		return res, err
	}

	if parent.Parent.ParentID.Valid {
		return res, fmt.Errorf("archive_child_command: category id=(%d) is not a parent category", c.req.ParentID)
	}

	if parent.Parent.ID <= 0 {
		return res, fmt.Errorf("archive_child_command: parent category id=(%d) not found", c.req.ParentID)
	}

	record, err := c.categories.Find(ctx, c.req.ID)
	if err != nil {
		return res, err
	}

	if !record.Parent.ParentID.Valid {
		return res, fmt.Errorf("archive_child_command: category id=(%d) is not a child category", c.req.ID)
	}

	if record.Parent.ID <= 0 {
		return res, fmt.Errorf("archive_child_command: child category id=(%d) not found", c.req.ID)
	}

	if record.Parent.ParentID.Val != parent.Parent.ID {
		return res, fmt.Errorf(
			"archive_child_command: category id=(%d) is not the parent of category id=(%d)",
			c.req.ParentID,
			c.req.ID,
		)
	}

	record, err = c.archival.Archive(ctx, record, timestamp)
	if err != nil {
		return res, err
	}

	err = c.broker.Publish(messages.Archived{Record: record.Parent})
	if err != nil {
		return res, err
	}

	return responses.NewListedChildFromAccountRecord(record.Parent), nil
}
