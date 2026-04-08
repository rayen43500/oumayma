import React, { useEffect, useMemo, useState } from 'react';
import productService from '../services/productService';

function ChatbotWidget() {
  const botName = 'Rigoula AI';
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [discussProduct, setDiscussProduct] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: 'Bonjour, je suis Rigoula AI. Posez-moi une question sur la boutique.'
    }
  ]);

  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
  const modelName = process.env.REACT_APP_GEMINI_MODEL || 'gemini-3-flash-preview';

  useEffect(() => {
    let mounted = true;

    const loadProducts = async () => {
      try {
        setProductsLoading(true);
        const result = await productService.getAllProducts({});
        const list = Array.isArray(result?.data) ? result.data : [];

        if (mounted) {
          setProducts(list);
          if (list.length > 0) {
            setSelectedProductId(String(list[0].id));
          }
        }
      } catch (error) {
        console.error('Erreur chargement produits pour chatbot:', error);
      } finally {
        if (mounted) setProductsLoading(false);
      }
    };

    loadProducts();
    return () => {
      mounted = false;
    };
  }, []);

  const selectedProduct = useMemo(
    () => products.find((product) => String(product.id) === String(selectedProductId)) || null,
    [products, selectedProductId]
  );

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

    const displayQuestion = discussProduct && selectedProduct
      ? `${question}\n\n[Produit sélectionné: ${selectedProduct.nom}]`
      : question;

    setMessages((prev) => [...prev, { role: 'user', text: displayQuestion }]);
    setInput('');
    setLoading(true);

    try {
      const enrichedPrompt = discussProduct && selectedProduct
        ? `Contexte produit depuis la base de donnees:\nNom produit: ${selectedProduct.nom || ''}\nDescription produit: ${selectedProduct.description || ''}\n\nMessage utilisateur: ${question}\n\nReponds en francais, de facon claire et utile, en tenant compte du produit.`
        : question;

      const answer = await askGemini(enrichedPrompt);
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
        <span className="chatbot-fab-icon">AI</span>
      </button>

      {isOpen && (
        <div className="chatbot-panel" role="dialog" aria-label={botName}>
          <div className="chatbot-header">
            <div className="chatbot-header-main">
              <strong>{botName}</strong>
              <span className="chatbot-header-subtitle">
                <span className="chatbot-online-dot" />
                En ligne
              </span>
            </div>
            <button
              type="button"
              className="chatbot-close"
              onClick={() => setIsOpen(false)}
              aria-label="Fermer le chat"
            >
              ×
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`chatbot-message-row chatbot-message-row-${message.role}`}
              >
                <div className={`chatbot-message chatbot-message-${message.role}`}>
                  {message.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="chatbot-typing" aria-live="polite">
                <span className="chatbot-typing-dot" />
                <span className="chatbot-typing-dot" />
                <span className="chatbot-typing-dot" />
                <span className="chatbot-typing-text">Rigoula AI ecrit...</span>
              </div>
            )}
          </div>

          <div className="chatbot-product-option">
            <label className="chatbot-product-toggle">
              <input
                type="checkbox"
                checked={discussProduct}
                onChange={(event) => setDiscussProduct(event.target.checked)}
              />
              <span>Discuter un produit</span>
            </label>

            {discussProduct && (
              <div className="chatbot-product-select-wrap">
                <select
                  className="chatbot-product-select"
                  value={selectedProductId}
                  onChange={(event) => setSelectedProductId(event.target.value)}
                  disabled={productsLoading || products.length === 0}
                >
                  {products.length === 0 && <option value="">Aucun produit disponible</option>}
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.nom}
                    </option>
                  ))}
                </select>
                {selectedProduct && (
                  <p className="chatbot-product-hint">
                    Produit: {selectedProduct.nom}
                  </p>
                )}
              </div>
            )}
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
