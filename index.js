const fs = require("fs");
const path = require("path");
const login = require("fca-unofficial");
const config = require("./config.json");

const appStatePath = path.join(__dirname, "appstate.json");
if (!fs.existsSync(appStatePath)) {
  console.error("Missing appstate.json. Add your own AppState locally; never commit it.");
  process.exit(1);
}

let appState;
try { appState = JSON.parse(fs.readFileSync(appStatePath, "utf8")); }
catch (e) { console.error("Invalid appstate.json:", e.message); process.exit(1); }

const commands = new Map();
const commandDir = path.join(__dirname, "commands");
for (const file of fs.readdirSync(commandDir).filter(f => f.endsWith(".js"))) {
  const command = require(path.join(commandDir, file));
  if (!command.name || typeof command.execute !== "function") continue;
  commands.set(command.name.toLowerCase(), command);
  for (const alias of command.aliases || []) commands.set(alias.toLowerCase(), command);
}

login({ appState }, (err, api) => {
  if (err) return console.error("Login failed:", err);
  api.setOptions({ listenEvents: true, selfListen: false, logLevel: "info" });
  console.log(`Bot online | prefix: ${config.prefix}`);

  api.listenMqtt(async (listenErr, event) => {
    if (listenErr || !event || event.type !== "message" || !event.body) return;
    const body = event.body.trim();
    if (!body.startsWith(config.prefix)) return;

    const parts = body.slice(config.prefix.length).trim().split(/\s+/);
    const name = (parts.shift() || "").toLowerCase();
    const command = commands.get(name);
    if (!command) return api.sendMessage(`Unknown command. Use ${config.prefix}help`, event.threadID);

    try {
      await command.execute({ body, threadID: event.threadID, senderID: event.senderID, messageID: event.messageID, args: parts }, { api, event, args: parts, config });
    } catch (e) {
      console.error(`Command ${name} failed:`, e);
      api.sendMessage("Command error.", event.threadID);
    }
  });
});
