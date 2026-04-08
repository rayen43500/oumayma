import React, { useState } from 'react';

function ChatbotWidget() {
  const botName = 'Rigoula AI';
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: 'Bonjour, je suis Rigoula AI. Posez-moi une question sur la boutique.'
    }
  ]);

  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
  const modelName = process.env.REACT_APP_GEMINI_MODEL || 'gemini-3-flash-preview';

  const askGemini = async (question) => {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: question }]
            }
          ]
        })
      }
    );

    if (!response.ok) {
      const details = await response.text();
      throw new Error(`Gemini request failed: ${response.status} ${details}`);
    }

    const data = await response.json();
    const text =
      data?.candidates?.[0]?.content?.parts
        ?.map((part) => part.text)
        .join('')
        .trim() || 'Je n\'ai pas pu generer une reponse pour le moment.';

    return text;
  };

  const onSend = async (event) => {
    event.preventDefault();
    const question = input.trim();
    if (!question || loading) return;

    if (!apiKey) {
      setMessages((prev) => [
        ...prev,
        { role: 'user', text: question },
        {
          role: 'bot',
          text: 'La cle API Gemini est manquante. Ajoutez REACT_APP_GEMINI_API_KEY dans ecommerce-frontend/.env.'
        }
      ]);
      setInput('');
      return;
    }

    setMessages((prev) => [...prev, { role: 'user', text: question }]);
    setInput('');
    setLoading(true);

    try {
      const answer = await askGemini(question);
      setMessages((prev) => [...prev, { role: 'bot', text: answer }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          text: 'Erreur IA: impossible de contacter Gemini pour le moment.'
        }
      ]);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className="chatbot-fab"
        onClick={() => setIsOpen((value) => !value)}
        aria-label={`Ouvrir ${botName}`}
        title={botName}
      >
        <span className="chatbot-fab-icon">RG</span>
      </button>

      {isOpen && (
        <div className="chatbot-panel" role="dialog" aria-label={botName}>
          <div className="chatbot-header">
            <strong>{botName}</strong>
            <button
              type="button"
              className="chatbot-close"
              onClick={() => setIsOpen(false)}
            >
              x
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`chatbot-message chatbot-message-${message.role}`}
              >
                {message.text}
              </div>
            ))}
            {loading && <div className="chatbot-typing">Gemini ecrit...</div>}
          </div>

          <form className="chatbot-input-row" onSubmit={onSend}>
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className="chatbot-input"
              placeholder="Ecrivez votre question..."
            />
            <button type="submit" className="chatbot-send" disabled={loading}>
              Envoyer
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default ChatbotWidget;
