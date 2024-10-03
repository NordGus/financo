-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS transactions (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    source_id BIGINT CONSTRAINT transaction_source_reference REFERENCES accounts (id),
    target_id BIGINT CONSTRAINT transaction_target_reference REFERENCES accounts (id),
    source_amount BIGINT NOT NULL,
    target_amount BIGINT NOT NULL,
    notes TEXT,
    issued_at DATE NOT NULL,
    executed_at DATE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX transaction_source_reference_index ON transactions (source_id);

CREATE INDEX transaction_target_reference_index ON transactions (target_id);

CREATE INDEX transaction_issued_at_index ON transactions (issued_at);

CREATE INDEX transaction_executed_at_index ON transactions (executed_at);

CREATE INDEX transaction_deleted_at_on_transactions_index ON transactions (deleted_at);
-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP INDEX transaction_source_reference_index;

DROP INDEX transaction_target_reference_index;

DROP INDEX transaction_issued_at_index;

DROP INDEX transaction_executed_at_index;

DROP INDEX transaction_deleted_at_on_transactions_index;

DROP TABLE IF EXISTS transactions;
-- +goose StatementEnd