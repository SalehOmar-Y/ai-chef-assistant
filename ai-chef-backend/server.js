require('dotenv').config();
console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY ? "✅ Loaded" : "❌ Missing");
const express = require('express');
const cors = require('cors');
app.use(cors());
const bodyParser = require('body-parser');
const OpenAI = require('openai');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Initialize OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to generate an image of the dish
const generateImage = async (dishName) => {
  const imageResponse = await openai.images.generate({
    prompt: `A realistic photo of traditional Arabic dish called ${dishName}, served on a plate`,
    n: 1,
    size: '512x512',
  });
  return imageResponse.data[0].url;
};

app.post('/ask', async (req, res) => {
  const { question } = req.body;

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
    const imageUrl = await generateImage(dishName);

    res.json({ reply, imageUrl });
  } catch (error) {
  if (error.response) {
    console.error('OpenAI API error:', error.response.status, error.response.data);
   } else {
    console.error('OpenAI API error:', error.message);
   }
   res.status(500).json({ error: 'حدث خطأ أثناء التواصل مع GPT' });
}


});

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
