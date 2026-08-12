const fs = require("fs");
const path = require("path");
const config = require("./config.json");

const commands = new Map();
const dir = path.join(__dirname, "commands");
for (const file of fs.readdirSync(dir).filter(f => f.endsWith(".js"))) {
  const command = require(path.join(dir, file));
  commands.set(command.name, command);
  for (const alias of command.aliases || []) commands.set(alias, command);
}

const fakeApi = {
  sendMessage(text) {
    console.log(`\nBOT: ${text}`);
    return Promise.resolve();
  }
};

async function run(input) {
  if (!input.startsWith(config.prefix)) return console.log("Type a command beginning with .");
  const parts = input.slice(config.prefix.length).trim().split(/\s+/);
  const name = (parts.shift() || "").toLowerCase();
  const command = commands.get(name);
  if (!command) return console.log("Unknown command. Try .help");

  await command.execute(
    { body: input, threadID: "TEST_THREAD", senderID: "TEST_USER", messageID: "TEST_MESSAGE", args: parts },
    { api: fakeApi, event: { type: "message" }, args: parts, config }
  );
}

console.log("🧪 Messenger Bot TEST MODE");
console.log("No Facebook/AppState required.");
console.log("Commands: .help .ping .uid .say hello .time");
console.log("Type a command and press Enter. Type exit to quit.\n");

const readline = require("readline");
const rl = readline.createInterface({ input: process.stdin, output: process.stdout, prompt: "> " });
rl.prompt();
rl.on("line", async line => {
  if (line.trim().toLowerCase() === "exit") return rl.close();
  try { await run(line.trim()); } catch (e) { console.error("TEST ERROR:", e); }
  rl.prompt();
});
