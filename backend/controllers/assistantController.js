// backend/controllers/assistantController.js
const { Groq } = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

exports.chatWithAssistant = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    const messages = [
      {
        role: 'system',
        content: `You are an empathetic AI assistant named MoodSphere. 
        Speak in a supportive, caring, and concise tone. 
        Use emojis appropriately to show emotional support (like 😊, 💙, 🌈, 🙌, etc.).
        Keep responses under 3 lines.
        Avoid long paragraphs. Always sound human-like and gentle.`,
      },
      {
        role: 'user',
        content: prompt,
      },
    ];

    const chatCompletion = await groq.chat.completions.create({
      messages,
      model: 'llama3-8b-8192',
    });

    const reply = chatCompletion.choices[0]?.message?.content || 'I’m here for you 💙';

    res.json({ reply });
  } catch (err) {
    console.error('[Groq Chat Error]', err);
    res.status(500).json({ error: 'AI assistant failed to respond' });
  }
};
