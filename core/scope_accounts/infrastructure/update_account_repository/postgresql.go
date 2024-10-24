package update_account_repository

import (
	"context"
	"financo/core/domain/databases"
	"financo/core/domain/records/account"
	"financo/core/domain/records/transaction"
	"financo/lib/nullable"
	"financo/core/scope_accounts/domain/repositories"
	"financo/core/scope_accounts/domain/responses"
)

type repository struct {
	db databases.SQLAdapter
}

func NewPostgreSQL(db databases.SQLAdapter) repositories.UpdateAccountRepository {
	return &repository{
		db: db,
	}
}

func (r *repository) FindWithChildren(ctx context.Context, id int64) (repositories.AccountWithChildren, error) {
	var (
		children []account.Record
		record   account.Record
		out      repositories.AccountWithChildren
	)

	conn, err := r.db.Conn(ctx)
	if err != nil {
		return out, err
	}
	defer conn.Close()

	record, err = findRecord(ctx, conn, id)
	if err != nil {
		return out, err
	}

	children, err = findChildrenRecords(ctx, conn, record.ID)
	if err != nil {
		return out, err
	}

	out = repositories.AccountWithChildren{
		Record:   record,
		Children: children,
	}

	return out, nil
}

func (r *repository) FindWithHistory(ctx context.Context, id int64) (repositories.AccountWithHistory, error) {
	var (
		record  account.Record
		history account.Record
		tr      nullable.Type[transaction.Record]
		out     repositories.AccountWithHistory
	)

	conn, err := r.db.Conn(ctx)
	if err != nil {
		return out, err
	}
	defer conn.Close()

	record, err = findRecord(ctx, conn, id)
	if err != nil {
		return out, err
	}

	history, err = findHistoryRecord(ctx, conn, record.ID)
	if err != nil {
		return out, err
	}

	tr, err = findHistoryTransactionRecord(ctx, conn, record.ID, history.ID)
	if err != nil {
		return out, err
	}

	out = repositories.AccountWithHistory{
		Record:      record,
		History:     history,
		Transaction: tr,
	}

	return out, nil
}

func (r *repository) SaveWithChildren(
	ctx context.Context, args repositories.SaveAccountWithChildrenArgs,
) (responses.Detailed, error) {
	var res responses.Detailed

	conn, err := r.db.Conn(ctx)
	if err != nil {
		return res, err
	}
	defer conn.Close()

	tx, err := conn.BeginTx(ctx, nil)
	if err != nil {
		return res, err
	}
	defer tx.Rollback()

	err = updateAccountRecord(ctx, tx, args.Record)
	if err != nil {
		return res, err
	}

	for _, child := range args.Children {
		if child.ID <= 0 {
			err = createAccountRecord(ctx, tx, child)
		} else {
			err = updateAccountRecord(ctx, tx, child)
		}

		if err != nil {
			return res, err
		}
	}

	err = tx.Commit()
	if err != nil {
		return res, err
	}

	res, err = findResponseDetailed(ctx, conn, args.Record)
	if err != nil {
		return res, err
	}

	return res, nil
}

func (r *repository) SaveWithHistory(
	ctx context.Context, args repositories.SaveAccountWithHistoryArgs,
) (responses.Detailed, error) {
	var res responses.Detailed

	conn, err := r.db.Conn(ctx)
	if err != nil {
		return res, err
	}
	defer conn.Close()

	tx, err := conn.BeginTx(ctx, nil)
	if err != nil {
		return res, err
	}
	defer tx.Rollback()

	err = updateAccountRecord(ctx, tx, args.Record)
	if err != nil {
		return res, err
	}

	if args.Transaction.Valid && args.Transaction.Val.ID <= 0 {
		err = createTransactionRecord(ctx, tx, args.Transaction.Val)
	} else if args.Transaction.Valid {
		err = updateTransactionRecord(ctx, tx, args.Transaction.Val)
	} else {
		err = deleteTransactionRecord(ctx, tx, args.Record, args.History)
	}

	if err != nil {
		return res, err
	}

	err = tx.Commit()
	if err != nil {
		return res, err
	}

	res, err = findResponseDetailed(ctx, conn, args.Record)
	if err != nil {
		return res, err
	}

	return res, nil
}
