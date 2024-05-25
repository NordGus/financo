WEBAPP_WORKSPACE=webapp

.PHONY: webapp webapp-server webapp-lint

webapp:
	@npm run -w ${WEBAPP_WORKSPACE} dev
webapp-server:
	@npm run -w ${WEBAPP_WORKSPACE} dummy:server
webapp-lint:
	@npm run -w ${WEBAPP_WORKSPACE} lint