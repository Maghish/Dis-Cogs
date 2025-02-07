# Dis-Cogs

> Current version: **v0.2.1 (Stable)**

Discogs is a discord.js bot template that uses the idea of discord.py's Cogs feature and implements it on discord.js

## Requirements:

- Typescript (Only)
- Supports only `discord.js` v14+

## Features:

- Cogs & Cogs Handler
- Typescript Support
- Built-in Permissions Handler, Owner-only command handler, etc
- Customizable Text Interface (using [`blessed.js`](https://github.com/chjj/blessed)) for better monitoring logs, etc
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
