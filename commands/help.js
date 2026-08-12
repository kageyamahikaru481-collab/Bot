module.exports = {
  name: "help",
  aliases: ["h", "commands"],
  async execute(message, { api, config }) {
    return api.sendMessage(
      `🤖 ${config.botName}\n\n${config.prefix}help - commands\n${config.prefix}ping - status\n${config.prefix}uid - your UID\n${config.prefix}say <text> - repeat text\n${config.prefix}time - Philippine time\n${config.prefix}chatgpt <tanong> - AI assistant`,
      message.threadID
    );
  }
};
