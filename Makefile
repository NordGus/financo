WEBAPP_WORKSPACE=webapp
SERVER_CMD = server/cmd

.PHONY: webapp webapp-server webapp-lint db-setup db-migrate db-rollback db-reset db-create db-seed db-migration-reset server db-drop

# Webapp targets
webapp:
	@npm run -w ${WEBAPP_WORKSPACE} dev
webapp-lint:
	@npm run -w ${WEBAPP_WORKSPACE} lint


# Database targets
db-setup: db-create db-migrate db-seed
db-reset: db-migration-reset db-migrate db-seed
db-migrate:
	@echo "running migrations"
	@goose up
db-rollback:
	@echo "rolling back last migration"
	@goose down
db-migration-reset:
	@echo "reseting database"
	@goose reset
db-seed:
	@echo "running database seeds"
	@go run ${SERVER_CMD}/database/seed/main.go
db-create:
	@echo "creating database"
	@go run ${SERVER_CMD}/database/create/main.go
db-drop:
	@echo "dropping database"
	@go run ${SERVER_CMD}/database/drop/main.go

# Server targets
server:
	@air