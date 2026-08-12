# Messenger Bot

Modular Node.js Messenger bot using `fca-unofficial` and a local AppState.

## Setup

1. Install Node.js.
2. Clone/download this repository.
3. Run `npm install`.
4. Put your own `appstate.json` beside `index.js`.
5. Set your Facebook UID in `config.json` if you use admin features later.
6. Run `npm start`.

### Commands

- `.help`
- `.ping`
- `.uid`
- `.say <text>`
- `.time`

**Never commit `appstate.json`. It is ignored by `.gitignore` because it contains a login session.**
