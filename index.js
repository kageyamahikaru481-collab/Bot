const readline = require("readline");
const config = require("./config.json");

// Local test mode: no Facebook account or AppState required.
const commands = new Map();
const commandDir = require("path").join(__dirname, "commands");
for (const file of require("fs").readdirSync(commandDir).filter(f => f.endsWith(".js"))) {
  const command = require(require("path").join(commandDir, file));
  if (!command.name || typeof command.execute !== "function") continue;
  commands.set(command.name.toLowerCase(), command);
  for (const alias of command.aliases || []) commands.set(alias.toLowerCase(), command);
}

const api = {
  sendMessage(text) {
    console.log(`\nBOT: ${text}\n`);
  }
};

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
console.log(`🤖 ${config.botName} - LOCAL TEST MODE`);
console.log(`Prefix: ${config.prefix}`);
console.log("No Facebook account/AppState needed.");
console.log("Try: .help, .ping, .uid, .say hello, .time\n");

rl.setPrompt("> ");
rl.prompt();
rl.on("line", async line => {
  const body = line.trim();
  if (!body.startsWith(config.prefix)) return rl.prompt();

  const parts = body.slice(config.prefix.length).trim().split(/\s+/);
  const name = (parts.shift() || "").toLowerCase();
  const command = commands.get(name);
  if (!command) {
    console.log(`\nBOT: Unknown command. Use ${config.prefix}help\n`);
    return rl.prompt();
  }

  const message = {
    body,
    threadID: "LOCAL_TEST_THREAD",
    senderID: "LOCAL_TEST_USER",
    messageID: "LOCAL_TEST_MESSAGE",
    args: parts
  };

  try {
    await command.execute(message, { api, event: message, args: parts, config });
  } catch (err) {
    console.error("Command error:", err);
  }
  rl.prompt();
});
