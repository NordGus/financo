-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS accounts (
    id BIGINT PRIMARY KEY,
    parent_id BIGINT,
    kind VARCHAR NOT NULL,
    currency VARCHAR NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    color VARCHAR NOT NULL,
    icon VARCHAR NOT NULL,
    capital BIGINT NOT NULL DEFAULT 0,
    archived_at TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX account_parent_id_on_accounts_index ON accounts (parent_id);
CREATE INDEX account_kind_on_accounts_index ON accounts (kind);
CREATE INDEX account_currency_on_accounts_index ON accounts (currency);
CREATE INDEX account_kind_currency_on_accounts_index ON accounts (kind, currency);
CREATE INDEX account_archived_at_on_accounts_index ON accounts (archived_at);
CREATE INDEX account_deleted_at_on_accounts_index ON accounts (deleted_at);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP INDEX account_parent_id_on_accounts_index;
DROP INDEX account_kind_on_accounts_index;
DROP INDEX account_currency_on_accounts_index;
DROP INDEX account_kind_currency_on_accounts_index;
DROP INDEX account_archived_at_on_accounts_index;
DROP INDEX account_deleted_at_on_accounts_index;

DROP TABLE accounts;
-- +goose StatementEnd
