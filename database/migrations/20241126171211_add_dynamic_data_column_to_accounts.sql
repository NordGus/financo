-- +goose Up
-- +goose StatementBegin
ALTER TABLE IF EXISTS ONLY accounts
ADD COLUMN IF NOT EXISTS dynamic_data JSONB NOT NULL;
-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
ALTER TABLE IF EXISTS ONLY accounts
DROP COLUMN IF EXISTS dynamic_data CASCADE;
-- +goose StatementEnd