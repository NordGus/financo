# financo

A simple personal finances application to bring order to the chaos of your personal finances.

## Requirements

For the development environment to work, you need to install the following:

- `Visual Studio Code`
  - `Dev Containers` extension
  - `Containers` extension
- `Docker`
  - `docker compose`

## Setup your development environment

1. To start your Dev Container open the Command Pallette (`Ctrl+Shift+P` or
`Cmd+Shift+P` or `F1`) search `Dev Containers: Reopen in Container`, press enter
to run it and wait for Visual Studio Code to build the Dev Container.

2. Now that the environment is setup, yes that's the magic of
Dev Containers. Open again the Command Pallette (`Ctrl+Shift+P` or
`Cmd+Shift+P` or `F1`) search `Go: Install/Update Tools`, press enter to start
the installation dialog. In the dialog select all tools (checkboxes), press `Ok`
and wait for the `Go Extension` to install all its dependencies.

3. Your environment is ready for development

- To start the api's server, open a new terminal and run:

  ```shell
  make server
  ```

- To start the webapp's dev server, open a new terminal and run:

  ```shell
  make webapp
  ```

## TODO

- [ ] Refactor message consumers to be more centralized or implement a mutex.
