const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: 'YOUR_OPENAI_API_KEY',
});
const openai = new OpenAIApi(configuration);

app.post('/ask', async (req, res) => {
  const { question } = req.body;

  try {
    const prompt = `
    أنت شيف عربي محترف. عندما يسألك المستخدم "كيف أطبخ معصوب؟" أو أي طبق آخر، تجاوب بالتفصيل، خطوة بخطوة، بالعربية، وبطريقة سهلة ومبسطة للمبتدئين.

    السؤال: ${question}
    الجواب:
    `;

    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const reply = completion.data.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'حدث خطأ أثناء التواصل مع GPT' });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));