-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS achievements (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    kind VARCHAR NOT NULL,
    name TEXT NOT NULL,
    settings JSONB NOT NULL,
    achieved_at TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX achievement_kind_on_achievements_index ON achievements (kind);

CREATE INDEX achievement_archived_at_on_achievements_index ON achievements (achieved_at);

CREATE INDEX achievement_deleted_at_on_achievements_index ON achievements (deleted_at);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP INDEX achievement_kind_on_achievements_index;

DROP INDEX achievement_archived_at_on_achievements_index;

DROP INDEX achievement_deleted_at_on_achievements_index;

DROP TABLE IF EXISTS achievements;
-- +goose StatementEnd