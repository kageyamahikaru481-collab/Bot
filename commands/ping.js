module.exports = {
  name: "ping",
  aliases: ["p"],
  async execute(message, { api }) {
    return api.sendMessage("🏓 Pong! Bot is online.", message.threadID);
  }
};
