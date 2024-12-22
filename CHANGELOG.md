# dis-cogs

## 0.2.1-beta.2

### Patch Changes

- ## Feature Updates

  - `index.ts` is now renamed to `bot.ts`
  - Created new main file called `main.ts` to operate both `deploy.ts` and `bot.ts`
  - Modified `bot.ts` from execute on run code to export class
  - Modified `deploy.ts` from execute on run code to export class, just like `bot.ts`
  - Detached TUI from `bot.ts` and created a new class `TUI` and rendered inside `main.ts`
  - Configured `log.ts` util function argument `logTab` to type `blessed.Widgets.BlessedElement`
  - Fixed "installation" spelling on `README.md`

## 0.2.1-beta

### Patch Changes

- ## Feature Updates

  - Built rich TUI with `blessed` and `blessed-contrib`
  - Modified `log` function and logging methods from now on
    - Log **TYPE** is now removed and replaced with current time log in H:M:S format
  - The main file after build, is now on `dist/src` as it was `dist/` before

## 0.2.0

### Minor Changes

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

### Patch Changes

- # v0.1.1

  - Updated README.md to display current version
  - Added ESLint Workflow

## 0.1.0

### Minor Changes

- # v0.1.0

  - Added Slash command handling
  - Updated `README.md`
  - Added a slash command example on ping cog
  - Removed pong command on ping cog

## 0.0.1

### Patch Changes

- # v0.0.1 (Initial Update)

  - Typescript Support
  - Cogs
  - Dynamic Cogs Handler _(Command Handler that takes Cogs instead)_
