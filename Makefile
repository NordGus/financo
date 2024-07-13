WEBAPP_WORKSPACE=webapp
SERVER_CMD = server/cmd

.PHONY: webapp webapp-server webapp-lint db-setup db-migrate db-rollback db-reset db-validate-migrations db-seed

# Webapp targets
webapp:
	@npm run -w ${WEBAPP_WORKSPACE} dev
webapp-server:
	@npm run -w ${WEBAPP_WORKSPACE} dummy:server
webapp-lint:
	@npm run -w ${WEBAPP_WORKSPACE} lint

# Database targets
db-setup: db-reset db-migrate db-seed
db-migrate:
	@echo "running migrations"
	@goose up
db-rollback:
	@echo "rolling back last migration"
	@goose down
db-reset:
	@echo "reseting database"
	@goose reset
db-seed:
	@echo "running database seeds"
	@go run ${SERVER_CMD}/database/seed/main.go