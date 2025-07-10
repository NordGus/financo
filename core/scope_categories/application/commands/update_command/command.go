// Package update_command contains the command to update a category
package update_command

import (
	"context"
	"financo/core/domain/commands"
	"financo/core/scope_categories/domain/brokers"
	"financo/core/scope_categories/domain/messages"
	"financo/core/scope_categories/domain/models/category"
	"financo/core/scope_categories/domain/repositories"
	"financo/core/scope_categories/domain/requests"
	"financo/core/scope_categories/domain/responses"
	"financo/models/account"
	"fmt"
	"slices"
	"time"
)

type command struct {
	req             requests.Update
	repo            repositories.UpdateRepository
	updatedBroker   brokers.Updated
	createdBroker   brokers.Created
	archiveBroker   brokers.Archived
	unarchiveBroker brokers.Unarchived
	deletedBroker   brokers.Deleted
}

func New(
	req requests.Update,
	repo repositories.UpdateRepository,
	updatedBroker brokers.Updated,
	createdBroker brokers.Created,
	archiveBroker brokers.Archived,
	unarchiveBroker brokers.Unarchived,
	deletedBroker brokers.Deleted,
) commands.Command[responses.Listed] {
	return &command{
		req:             req,
		repo:            repo,
		updatedBroker:   updatedBroker,
		createdBroker:   createdBroker,
		archiveBroker:   archiveBroker,
		unarchiveBroker: unarchiveBroker,
		deletedBroker:   deletedBroker,
	}
}

func (c *command) Run(ctx context.Context) (responses.Listed, error) {
	var (
		timestamp = time.Now().UTC()
		// applied represents the applied subcategory request for event publish
		applied = make([]requests.UpdateSubcategory, 0, len(c.req.Subcategories))

		res      responses.Listed
		previous category.Record
		current  category.Record
	)

	previousData, err := c.repo.Find(ctx, c.req.ID)
	if err != nil {
		return res, err
	}

	if previousData.Parent.ParentID.Valid {
		return res, fmt.Errorf("update_command: category id=(%d) is not a parent category", c.req.ID)
	}

	if previousData.Parent.ID <= 0 {
		return res, fmt.Errorf("update_command: category id=(%d) not found", c.req.ID)
	}

	previous.Parent = previousData.Parent
	previous.Children = make([]account.Record, 0, len(c.req.Subcategories))

	current.Parent = c.req.ToRecord(previousData.Parent, timestamp)
	current.Children = make([]account.Record, 0, len(c.req.Subcategories))

	// map subcategories to records by intent
	for _, subcategory := range c.req.Subcategories {
		if subcategory.Intent == requests.CREATE { // handle create children
			previous.Children = append(
				previous.Children,
				subcategory.ToRecord(account.Record{ID: -1}, previous.Parent, timestamp),
			)
			current.Children = append(
				current.Children,
				subcategory.ToRecord(account.Record{ID: -1}, current.Parent, timestamp),
			)

			// because it was found added to an applied slice that maintains the same indexes and size of the records
			applied = append(applied, subcategory)
			continue
		}

		// search existing children in data from subcategory
		idx := slices.IndexFunc(previousData.Children, func(r account.Record) bool {
			return r.ID == subcategory.ID.Val // non-CREATE subcategories contain a valid ID
		})

		// ignore subcategories that do not have a matching record
		if idx < 0 {
			continue
		}

		previous.Children = append(
			previous.Children,
			subcategory.ToRecord(previousData.Children[idx], previous.Parent, timestamp),
		)
		current.Children = append(
			current.Children,
			subcategory.ToRecord(previousData.Children[idx], current.Parent, timestamp),
		)

		// because it was found added to an applied slice that maintains the same indexes and size of the records
		applied = append(applied, subcategory)
	}

	current, err = c.repo.Save(ctx, current)
	if err != nil {
		return res, err
	}

	err = c.updatedBroker.Publish(messages.Updated{Current: current.Parent, Previous: previous.Parent})
	if err != nil {
		return res, err
	}

	// emit subcategories messages
	for i, subcategory := range applied {
		switch subcategory.Intent {
		case requests.CREATE:
			err = c.createdBroker.Publish(
				messages.Created{
					Record: current.Children[i],
				},
			)
			if err != nil {
				return res, err
			}

			continue
		case requests.UPDATE:
			err = c.updatedBroker.Publish(
				messages.Updated{
					Current:  current.Children[i],
					Previous: previous.Children[i],
				},
			)
			if err != nil {
				return res, err
			}

			continue
		case requests.ARCHIVE:
			err = c.archiveBroker.Publish(
				messages.Archived{
					Record: current.Children[i],
				},
			)
			if err != nil {
				return res, err
			}

			continue
		case requests.UNARCHIVE:
			err = c.unarchiveBroker.Publish(
				messages.Unarchived{
					Record: current.Children[i],
				},
			)
			if err != nil {
				return res, err
			}

			continue
		case requests.DESTROY:
			err = c.deletedBroker.Publish(
				messages.Deleted{
					Record: current.Children[i],
				},
			)
			if err != nil {
				return res, err
			}

			continue
		default:
			return res, fmt.Errorf("update_command: unsupported subcategory intent %s", subcategory.Intent)
		}
	}

	return responses.NewListedFromCategoryRecord(current), nil
}
