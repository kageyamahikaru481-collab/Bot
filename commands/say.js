module.exports = {
  name: "say",
  aliases: ["echo"],
  async execute(message, { api }) {
    if (!message.args.length) return api.sendMessage("Usage: .say <message>", message.threadID);
    return api.sendMessage(message.args.join(" "), message.threadID);
  }
};
