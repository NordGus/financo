# financo

A simple personal finances application to bring order to the chaos of your personal finances.

## TODO

- [x] Find the datetime spec for javascript/ecmascript to add to the dummy server.
- [x] Move the docs files from the other projects to this one.
- [x] Learn how to use Makefile for task automation.
- [x] Select migration tool.
  - [x] Implement Accounts Record design.
  - [x] Implement Transactions Record design.
  - [ ] Write documentation explaining decision an usages.
- [x] Write migration command/script.
  - [x] Implement Accounts Record design in code.
  - [x] Implement Transactions Record design in code.
  - [x] Migrate Accounts from `json-server`'s `db.json` file to script.
  - [x] Migrate Transactions from `json-server`'s `db.json` file to script.
  - [ ] Write documentation.
- [x] Develop initial implementation of the API server.
  - [x] Migrate Summary endpoints from `json-server` to server.
  - [x] Migrate Account lists endpoint from `json-server` to server.
  - [x] Migrate Transactions lists endpoint from `json-server` to server.
  - [x] Migrate Pending Transactions lists endpoint from `json-server` to server.
- [x] Develop initial implementation of Transactions History filters.
  - [ ] Make design in `drawio` board.
  - [x] Refactor Account list endpoint to return a simplified.
- [ ] Develop initial implementation of Transactions Upcoming filters.
  - [ ] Make design in `drawio` board.
  - [ ] Develop initial implementation of Upcoming Transactions API endpoint.
- [ ] Develop an initial implementation of the Accounts flow.
  - [x] Develop Account Creation
    - [ ] Write design document
    - [ ] Make design in `drawio`
  - [x] Develop Account Update and show
    - [ ] Write design document
    - [ ] Make design in `drawio`
    - [x] Develop Pending Transactions implementation.
      - [ ] Write design document
      - [ ] Make design in `drawio`
    - [x] Develop Upcoming Transactions implementation.
      - [ ] Write design document
      - [ ] Make design in `drawio`
    - [x] Develop Transactions History implementation.
      - [ ] Write design document
      - [ ] Make design in `drawio`
- [x] Refactor Account list endpoint.
- [x] Develop an Account list endpoint for selects in the app.
- [ ] Migrate elements from this list to a Notion project.
- [ ] Migrate to `shadcn/ui` for ui
  - [x] Layout
  - [x] Accounts
    - [x] Redesign index
    - [x] Redesign flow
    - [x] Redesign show/update
  - [ ] Transactions
    - [x] Redesign index
    - [ ] Redesign flow
    - [x] Redesign show/update
