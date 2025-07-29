import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Missing question' });
  }

  try {
    const dishName = question
      .replace('كيف أعمل', '')
      .replace('كيف أطبخ', '')
      .replace('؟', '')
      .trim();

    const prompt = `
    أنت شيف عربي محترف. عندما يسألك المستخدم "كيف أطبخ ${dishName}؟"، تجاوب بالتفصيل، خطوة بخطوة، بالعربية، وبطريقة سهلة ومبسطة للمبتدئين.

    السؤال: ${question}
    الجواب:
    `;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const reply = completion.choices[0].message.content;

    res.status(200).json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'حدث خطأ أثناء التواصل مع GPT' });
  }
}
