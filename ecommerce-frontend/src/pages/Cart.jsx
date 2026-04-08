import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Table, Alert, Spinner, Form } from 'react-bootstrap';
import api from '../services/api';
import { useAuth } from '../context/AuthContext.jsx';

const Cart = () => {
  const { isAdmin } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await api.get('/panier');
      setCartItems(response.data.data);
      setTotal(parseFloat(response.data.total) + 8);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await api.put(`/panier/${itemId}`, { quantite: newQuantity });
      fetchCart();
      setMessage({ type: 'success', text: 'Quantité mise à jour' });
      setTimeout(() => setMessage({ type: '', text: '' }), 2000);
    } catch (error) {
      setMessage({ type: 'danger', text: 'Erreur lors de la mise à jour' });
    }
  };

  const removeItem = async (itemId) => {
    if (window.confirm('Voulez-vous vraiment retirer ce produit du panier ?')) {
      try {
        await api.delete(`/panier/${itemId}`);
        fetchCart();
        setMessage({ type: 'success', text: 'Produit retiré du panier' });
        setTimeout(() => setMessage({ type: '', text: '' }), 2000);
      } catch (error) {
        setMessage({ type: 'danger', text: 'Erreur lors de la suppression' });
      }
    }
  };

  const clearCart = async () => {
    if (window.confirm('Voulez-vous vraiment vider le panier ?')) {
      try {
        await api.delete('/panier');
        fetchCart();
        setMessage({ type: 'success', text: 'Panier vidé' });
      } catch (error) {
        setMessage({ type: 'danger', text: 'Erreur' });
      }
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="success" />
        <p className="mt-3 text-muted">Chargement du panier...</p>
      </Container>
    );
  }

  return (
    <div className="py-5 bg-light">
      <Container>
        <h1 className="fw-bold mb-4">🛒 Mon Panier</h1>

        {message.text && (
          <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', text: '' })}>
            {message.text}
          </Alert>
        )}

        {cartItems.length === 0 ? (
          <Card className="text-center p-5 border-0 shadow-sm">
            <Card.Body>
              <h3 className="text-muted mb-4">Votre panier est vide</h3>
              <Button 
                variant="success" 
                onClick={() => navigate('/produits')}
                style={{ backgroundColor: '#10b981', borderColor: '#10b981' }}
              >
                Découvrir nos produits
              </Button>
            </Card.Body>
          </Card>
        ) : (
          <Row>
            <Col lg={8}>
              <Card className="border-0 shadow-sm mb-4">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">Produits ({cartItems.length})</h5>
                    <Button variant="outline-danger" size="sm" onClick={clearCart}>
                      Vider le panier
                    </Button>
                  </div>

                  <div className="table-responsive">
                    <Table hover>
                      <thead className="bg-light">
                        <tr>
                          <th>Produit</th>
                          <th>Prix unitaire</th>
                          <th>Quantité</th>
                          <th>Total</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {cartItems.map((item) => (
                          <tr key={item.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <div 
                                  className="bg-light rounded me-3" 
                                  style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                  {item.image ? (
                                    <img 
                                      src={item.image} 
                                      alt={item.nom}
                                      style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                      className="rounded"
                                    />
                                  ) : (
                                    <img src="/rigoula_logo.png" alt="Rigoula" style={{ height: '32px' }} />
                                  )}
                                </div>
                                <div>
                                  <strong>{item.nom}</strong>
                                  <br />
                                  <small className="text-muted">
                                    {isAdmin ? `Stock: ${item.stock}` : (item.stock > 0 ? 'En stock' : 'Rupture de stock')}
                                  </small>
                                </div>
                              </div>
                            </td>
                            <td className="align-middle">{item.prix} TND</td>
                            <td className="align-middle">
                              <div className="d-flex align-items-center gap-2" style={{ width: '130px' }}>
                                <Button 
                                  variant="outline-secondary" 
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, item.quantite - 1)}
                                >
                                  -
                                </Button>
                                <Form.Control
                                  type="number"
                                  value={item.quantite}
                                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                                  min="1"
                                  max={item.stock}
                                  style={{ width: '60px', textAlign: 'center' }}
                                  size="sm"
                                />
                                <Button 
                                  variant="outline-secondary" 
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, item.quantite + 1)}
                                  disabled={item.quantite >= item.stock}
                                >
                                  +
                                </Button>
                              </div>
                            </td>
                            <td className="align-middle fw-bold">{item.total_ligne} TND</td>
                            <td className="align-middle">
                              <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={() => removeItem(item.id)}
                              >
                                ✕
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4}>
              <Card className="border-0 shadow-sm sticky-top" style={{ top: '20px' }}>
                <Card.Body>
                  <h5 className="fw-bold mb-4">Résumé de la commande</h5>
                  
                  <div className="d-flex justify-content-between mb-2">
                    <span>Sous-total</span>
                    <span>{(total - 8).toFixed(2)} TND</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Livraison</span>
                    <span>8.00 TND</span>
                  </div>
                  
                  <hr />
                  
                  <div className="d-flex justify-content-between mb-4">
                    <strong className="fs-5">Total</strong>
                    <strong className="fs-5" style={{ color: '#10b981' }}>
                      {total.toFixed(2)} TND
                    </strong>
                  </div>

                  <div className="d-grid gap-2">
                    <Button 
                      variant="success" 
                      size="lg"
                      onClick={() => navigate('/checkout')}
                      style={{ backgroundColor: '#10b981', borderColor: '#10b981' }}
                    >
                      Passer la commande
                    </Button>
                    <Button 
                      variant="outline-secondary"
                      onClick={() => navigate('/produits')}
                    >
                      Continuer mes achats
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Cart;