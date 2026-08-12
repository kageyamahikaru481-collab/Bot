module.exports = {
  name: "chatgpt",
  aliases: ["ai", "gpt"],
  async execute(message, { api, config, args }) {
    const prompt = args.join(" ").trim();
    if (!prompt) {
      return api.sendMessage(`Usage: ${config.prefix}chatgpt <tanong>\nExample: ${config.prefix}chatgpt tulungan mo ako sa JavaScript`);
    }

    const key = process.env.OPENAI_API_KEY;
    if (!key) {
      return api.sendMessage("⚠️ Wala pang OPENAI_API_KEY. Sa Termux, i-set muna ito gamit ang: export OPENAI_API_KEY='YOUR_API_KEY'");
    }

    try {
      const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${key}`
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || "gpt-5-mini",
          instructions: "You are a helpful Filipino Messenger bot assistant. Answer clearly and concisely. If the user asks for code, provide safe and practical code.",
          input: prompt,
          max_output_tokens: 800
        })
      });

      const data = await response.json();
      if (!response.ok) {
        console.error("OpenAI API error:", data);
        return api.sendMessage("❌ Hindi makuha ang sagot mula sa AI. I-check ang API key at internet connection.");
      }

      const answer = data.output_text || "Walang text response na natanggap.";
      return api.sendMessage(`🤖 ChatGPT:\n${answer.slice(0, 3500)}`);
    } catch (error) {
      console.error("ChatGPT command error:", error);
      return api.sendMessage("❌ May error habang kumokonekta sa ChatGPT. I-check ang internet connection.");
    }
  }
};
