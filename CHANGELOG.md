# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.3.0](https://github.com/Maghish/Dis-Cogs/compare/v0.2.1...v0.3.0) (2025-06-06)


### Features

* add new TUI components for bot logs, errors, and cogs; rename mainbot to general_log ([c8811d5](https://github.com/Maghish/Dis-Cogs/commit/c8811d58e7ae2e8afd8f083b4d1f180da6a3f865))
* added a new field to ModuleConfigType + new module type MAIN + implemented the utilization of MAIN type modules (TUI works now) ([e4afef4](https://github.com/Maghish/Dis-Cogs/commit/e4afef4387755caeb8bfbad9d62a75f309284d01))
* added hybrid commands [#42](https://github.com/Maghish/Dis-Cogs/issues/42) ([e71ce87](https://github.com/Maghish/Dis-Cogs/commit/e71ce87859be4658ad2cd264828fa266018b31cf))
* added timestamp field to embed built via buildEmbed function ([2eb6353](https://github.com/Maghish/Dis-Cogs/commit/2eb63538c5e440c033d06c460b1626b7fe4b2c2f))
* Discord bot restart on edit ([d7bce28](https://github.com/Maghish/Dis-Cogs/commit/d7bce2856f6ca27b7b564990daf59a28fc4f587c))
* enhance TUI logging by appending module names and general logs for thread creation ([7741ef1](https://github.com/Maghish/Dis-Cogs/commit/7741ef1506ad9299b1c25dc360df11bc901f447e))
* import function removed ([88a89c6](https://github.com/Maghish/Dis-Cogs/commit/88a89c68c92e61eb74248d34c8d28fa483accd80))
* issue [#35](https://github.com/Maghish/Dis-Cogs/issues/35) ([c8b984d](https://github.com/Maghish/Dis-Cogs/commit/c8b984d58890af5cb80c52206799917f53596fa8))
* modified TUI to better struct and detached components from main TUI file and create a handler instead ([ccaa2a0](https://github.com/Maghish/Dis-Cogs/commit/ccaa2a0074d2c0beb343ad742df164a149d664e9))
* update logging system to use specific log types for bot events and errors ([3cf8b24](https://github.com/Maghish/Dis-Cogs/commit/3cf8b24bf574d7c20c50b9862e6cfd4f64694daf))


### Bug Fixes

* added modifiedClient to message.client and interaction.client ([51e52ae](https://github.com/Maghish/Dis-Cogs/commit/51e52aefddba51d6f11ef5c00b76fe4ef183fc26))
* added try-catch on messageCreate on command execution ([d488554](https://github.com/Maghish/Dis-Cogs/commit/d488554cfd63e9a40b4d398dd7d07a76ada546d7))
* bot cogs adding instead of replacing for every restart ([6911279](https://github.com/Maghish/Dis-Cogs/commit/6911279281cfcce8f83e451f97daa1d7fe99769b))
* fixed bot crash on error ([083c0dc](https://github.com/Maghish/Dis-Cogs/commit/083c0dc34ea5abc0a39ec6c11941e434d6eff2bc))
* fixed bot_cog component has unnecessary commas & renamed ping cog to basic cog ([5104969](https://github.com/Maghish/Dis-Cogs/commit/5104969ffd59347144ab0826564299cd2cfdc76d))
* issue [#24](https://github.com/Maghish/Dis-Cogs/issues/24) ([5e428d2](https://github.com/Maghish/Dis-Cogs/commit/5e428d21b7f5f59a5aa5313a645cea744599152f))
* removed unwanted commented code ([ae13711](https://github.com/Maghish/Dis-Cogs/commit/ae13711c6b66f2460b6b35e7bcbdffee11751741))
* resolved issue [#22](https://github.com/Maghish/Dis-Cogs/issues/22) [#33](https://github.com/Maghish/Dis-Cogs/issues/33)  [#23](https://github.com/Maghish/Dis-Cogs/issues/23) ([45dc23e](https://github.com/Maghish/Dis-Cogs/commit/45dc23e22b861477682020905ab7e05387134642))
* resolved issue [#22](https://github.com/Maghish/Dis-Cogs/issues/22) [#33](https://github.com/Maghish/Dis-Cogs/issues/33) [#23](https://github.com/Maghish/Dis-Cogs/issues/23) ([69cc4eb](https://github.com/Maghish/Dis-Cogs/commit/69cc4ebf9c1ca9bbd7d6684b24dc379e56c2b881))
* slash commands fixed ([d31195f](https://github.com/Maghish/Dis-Cogs/commit/d31195fec82473afc5edeb7058558b19df60b0a3))
* update main entry point to src directory and bump version to 0.3.0-beta.1 ([78136e7](https://github.com/Maghish/Dis-Cogs/commit/78136e7a3e152dd9f747191a6f2717e7fb650c67))
* updated the current tag on README ([328c3a4](https://github.com/Maghish/Dis-Cogs/commit/328c3a49bf40b6a93b101e53f78b511ad996a0dc))

## 0.3.0-beta-2

- ## Improvements

  - Added some error handling on usage of default components on `tui/main.ts`

## 0.3.0-beta.1

### Minor Update

- ## Feature Updates

  - New infrastructure with `main.ts` as the prime module manager, now running and managing multiple modules
  - Revamped `TUI` on `main.ts` to a detached/separated module `TUI`, that handles the TUI and its components
    - Newly and fully updated TUI design than past versions
    - Added `bot_cogs` component
    - Added `general_log` component
    - Added `module_logs` components
    - Added `logo` component
    - Added `bot_error` component
    - Added `bot_log` component
    - Added `modules` component
  - Revamped the main bot files and code to a detached/separated module `mainbot`, that handles the main discord bot instance
    - Modified `log` function logic to now contact the TUI module via fetch and also able to log on different new TUI components _(e.g. `bot_error`, `bot_log`, `bot_cogs`, `general_log`)_

## 0.2.1-beta.2

### Patch Update

- ## Feature Updates

  - `index.ts` is now renamed to `bot.ts`
  - Created new main file called `main.ts` to operate both `deploy.ts` and `bot.ts`
  - Modified `bot.ts` from execute on run code to export class
  - Modified `deploy.ts` from execute on run code to export class, just like `bot.ts`
  - Detached TUI from `bot.ts` and created a new class `TUI` and rendered inside `main.ts`
  - Configured `log.ts` util function argument `logTab` to type `blessed.Widgets.BlessedElement`
  - Fixed "installation" spelling on `README.md`

## 0.2.1-beta

### Patch Update

- ## Feature Updates

  - Built rich TUI with `blessed` and `blessed-contrib`
  - Modified `log` function and logging methods from now on
    - Log **TYPE** is now removed and replaced with current time log in H:M:S format
  - The main file after build, is now on `dist/src` as it was `dist/` before

## 0.2.0

### Minor Update

- ## Feature Updates

  - Implemented Dm-Resolvable for Legacy Command (issue #13)
  - Implemented aliases handler for Legacy Command (issue #15)
  - Created owner-only handler for Legacy and Slash Command (issue #16)
  - Created embed template builder (issue #11)

  ## Bug Fixes

  - Removed useless regex on `messageCreate` event on event cog (issue #8)

  ## Repo Updates

  - Updated `README.md` to display current version

## 0.1.1

### Patch Update

- # v0.1.1

  - Updated README.md to display current version
  - Added ESLint Workflow

## 0.1.0

### Minor Update

- # v0.1.0

  - Added Slash command handling
  - Updated `README.md`
  - Added a slash command example on ping cog
  - Removed pong command on ping cog

## 0.0.1

### Patch Update

- # v0.0.1 (Initial Update)

  - Typescript Support
  - Cogs
  - Dynamic Cogs Handler _(Command Handler that takes Cogs instead)_
