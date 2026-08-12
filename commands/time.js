module.exports = {
  name: "time",
  async execute(message, { api }) {
    const now = new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila", dateStyle: "full", timeStyle: "medium" });
    return api.sendMessage(`🕐 Philippine Time:\n${now}`, message.threadID);
  }
};
