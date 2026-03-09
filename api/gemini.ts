import OpenAI from 'openai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userPrompt, systemInstruction, temperature = 0.8, useSearch = false } = req.body;

  if (!userPrompt || !systemInstruction) {
    return res.status(400).json({ error: 'userPrompt dan systemInstruction wajib diisi' });
  }

  try {
    const client = new OpenAI({
      apiKey: process.env.GEMINI_API_KEY,
      baseURL: 'https://litellm.koboi2026.biz.id/v1',
    });

    const response = await client.chat.completions.create({
      model: 'gemini/gemini-2.5-flash', // format LiteLLM untuk Gemini
      temperature,
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: userPrompt },
      ],
    });

    const text = response.choices[0]?.message?.content || '';
    return res.status(200).json({ text });

  } catch (error: any) {
    console.error('LiteLLM error:', error);
    return res.status(500).json({ error: error.message || 'Terjadi kesalahan pada server' });
  }
}
