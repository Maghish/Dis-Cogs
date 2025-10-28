![Dis-Cogs](imgs/DisCogsLogo.svg)

> Current version: **v1.0.0**

Discogs is a discord.js bot template that uses the idea of discord.py's Cogs feature and implements it on discord.js

![GitHub License](https://img.shields.io/github/license/Maghish/Dis-Cogs)
![GitHub commit activity](https://img.shields.io/github/commit-activity/t/Maghish/Dis-Cogs?label=total%20commits)
![GitHub Created At](https://img.shields.io/github/created-at/Maghish/Dis-Cogs)
![GitHub top language](https://img.shields.io/github/languages/top/Maghish/Dis-Cogs)
![GitHub Issues or Pull Requests](https://img.shields.io/github/issues/Maghish/Dis-Cogs)
![Node LTS](https://img.shields.io/node/v-lts/discord.js)
![GitHub package.json prod dependency version](https://img.shields.io/github/package-json/dependency-version/Maghish/Dis-Cogs/discord.js)

## Requirements:

- Typescript (Only)
- Supports only `discord.js` v14+

## Features:

- Cogs & Cogs Handler
- Typescript Support
- Built-in Permissions Handler, Owner-only command handler, etc
- Customizable Text Interface (using [`blessed.js`](https://github.com/chjj/blessed)) for better monitoring logs, etc
- Hybrid Commands
- Extendable

## Installation

1. Clone this repo into your local machine using

   ```bash
   git clone <REPO_URL/REPO_SSH>
   ```

2. Then create a `.env` file on the base folder, here is an example `.env`

   ```env
   TOKEN="DISCORD_BOT_TOKEN"
   PREFIX="!"
   CLIENTID="BOT_CLIENT_ID"
   ```

3. Run the bot using
   ```bash
   npm run dev
   ```
4. For production purposes, build and run the bot using
   ```bash
   npm run build && npm run start
   ```

<center>

_Special thanks to [@NamVr](https://github.com/NamVr) 🌟_

</center>
