import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [question, setQuestion] = useState('');
  const [reply, setReply] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const speak = (text) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA'; // Arabic Saudi dialect
    window.speechSynthesis.speak(utterance);
  } else {
    console.warn('Speech synthesis not supported in this browser.');
  }
};
  // Function to ask the chef

  const askChef = async () => {
    setLoading(true);
    setReply('');
    setImageUrl('');

    try {
      const response = await axios.post('http://localhost:5000/ask', { question });
      setReply(response.data.reply);
      setImageUrl(response.data.imageUrl);
      speak(response.data.reply);
    } catch (error) {
      setReply('حدث خطأ، حاول مرة ثانية.');
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20, fontFamily: 'Arial' }}>
      <h1>👨‍🍳 مساعد الشيف الذكي</h1>
      <p>اسألني عن كيفية تحضير أي طبق عربي وسأجيبك خطوة بخطوة!</p>

      <textarea
        rows={3}
        style={{ width: '100%', padding: 10 }}
        placeholder="اكتب سؤالك مثلاً: كيف أعمل معصوب؟"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button onClick={askChef} disabled={loading} style={{ marginTop: 10 }}>
        {loading ? 'جاري التحضير...' : 'اسأل الشيف'}
      </button>

      {reply && (
        <div style={{ marginTop: 20, background: '#f9f9f9', padding: 15, borderRadius: 5 }}>
          <strong>الرد:</strong>
          <p>{reply}</p>
        </div>
      )}

      {imageUrl && (
        <div style={{ marginTop: 20 }}>
          <strong>صورة الطبق:</strong>
          <img src={imageUrl} alt="صورة الطبق" style={{ maxWidth: '100%', borderRadius: 8 }} />
        </div>
      )}
    </div>
  );
}
export default App;