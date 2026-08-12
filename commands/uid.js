module.exports = {
  name: "uid",
  aliases: ["id"],
  async execute(message, { api }) {
    return api.sendMessage(`🆔 Your UID: ${message.senderID}`, message.threadID);
  }
};
