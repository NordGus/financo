-- +goose Up
-- +goose StatementBegin
ALTER TABLE IF EXISTS ONLY transactions ADD COLUMN IF NOT EXISTS metadata JSONB NOT NULL DEFAULT '{}';
ALTER TABLE IF EXISTS ONLY transactions ADD COLUMN IF NOT EXISTS currency VARCHAR NOT NULL DEFAULT 'MULTI';
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE IF EXISTS ONLY accounts DROP COLUMN IF EXISTS currency CASCADE;
ALTER TABLE IF EXISTS ONLY accounts DROP COLUMN IF EXISTS metadata CASCADE;
-- +goose StatementEnd
