import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [question, setQuestion] = useState('');
  const [reply, setReply] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn('Speech synthesis not supported.');
    }
  };

  const askChef = async () => {
    if (!question.trim()) return; // avoid empty questions

    setLoading(true);
    setReply('');
    setImageUrl('');

    try {
      const response = await axios.post('/api/ask', { question });
      setReply(response.data.reply);
      setImageUrl(response.data.imageUrl);
      speak(response.data.reply);
    } catch (error) {
      setReply('حدث خطأ، حاول مرة ثانية.');
    }

    setLoading(false);
  };

  return (
    <div className="app-container">
      <div className="card">
        <h1 className="title">👨‍🍳 مساعد الشيف الذكي</h1>
        <p className="subtitle">اسألني عن كيفية تحضير أي طبق عربي وسأجيبك خطوة بخطوة!</p>

        <textarea
          className="input-textarea"
          rows={3}
          placeholder="اكتب سؤالك مثلاً: كيف أعمل معصوب؟"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={loading}
        />

        <button className="submit-button" onClick={askChef} disabled={loading}>
          {loading ? 'جاري التحضير...' : 'اسأل الشيف'}
        </button>

        {reply && (
          <div className="response-box">
            <p>{reply}</p>
          </div>
        )}

        {imageUrl && (
          <div className="image-box">
            <img src={imageUrl} alt="صورة الطبق" className="dish-image" />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
