import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import api from '../services/api';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    adresse_livraison: '',
    telephone_contact: '',
    payment_method: 'cash'
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await api.get('/panier');
      setCartItems(response.data.data);
      setTotal(parseFloat(response.data.total) + 8);

      if (response.data.data.length === 0) {
        navigate('/panier');
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const response = await api.post('/commandes/create', formData);
      alert(`✅ Commande passée avec succès ! Numéro de commande: ${response.data.commandeId}`);
      navigate('/mes-commandes');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création de la commande');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="success" />
      </Container>
    );
  }

  return (
    <div className="py-5 bg-light">
      <Container>
        <h1 className="fw-bold mb-4">Finaliser la commande</h1>

        {error && <Alert variant="danger">{error}</Alert>}

        <Row>
          <Col lg={8}>
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-4">Informations de livraison</h5>
                
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Nom *</Form.Label>
                        <Form.Control
                          type="text"
                          name="nom"
                          value={formData.nom}
                          onChange={handleChange}
                          required
                          placeholder="Votre nom"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Prénom *</Form.Label>
                        <Form.Control
                          type="text"
                          name="prenom"
                          value={formData.prenom}
                          onChange={handleChange}
                          required
                          placeholder="Votre prénom"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Adresse de livraison *</Form.Label>
                    <Form.Select
                      name="adresse_livraison"
                      value={formData.adresse_livraison}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Sélectionnez un gouvernorat</option>
                      <option value="Tunis">Tunis</option>
                      <option value="Ariana">Ariana</option>
                      <option value="Ben Arous">Ben Arous</option>
                      <option value="Manouba">Manouba</option>
                      <option value="Nabeul">Nabeul</option>
                      <option value="Zaghouan">Zaghouan</option>
                      <option value="Bizerte">Bizerte</option>
                      <option value="Béja">Béja</option>
                      <option value="Jendouba">Jendouba</option>
                      <option value="Le Kef">Le Kef</option>
                      <option value="Siliana">Siliana</option>
                      <option value="Sousse">Sousse</option>
                      <option value="Monastir">Monastir</option>
                      <option value="Mahdia">Mahdia</option>
                      <option value="Sfax">Sfax</option>
                      <option value="Kairouan">Kairouan</option>
                      <option value="Kasserine">Kasserine</option>
                      <option value="Sidi Bouzid">Sidi Bouzid</option>
                      <option value="Gabès">Gabès</option>
                      <option value="Médenine">Médenine</option>
                      <option value="Tataouine">Tataouine</option>
                      <option value="Gafsa">Gafsa</option>
                      <option value="Tozeur">Tozeur</option>
                      <option value="Kebili">Kebili</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">Téléphone de contact *</Form.Label>
                    <Form.Control
                      type="tel"
                      name="telephone_contact"
                      value={formData.telephone_contact}
                      onChange={handleChange}
                      required
                      placeholder="98765432"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">Mode de paiement *</Form.Label>
                    <Form.Select
                      name="payment_method"
                      value={formData.payment_method}
                      onChange={handleChange}
                      required
                    >
                      <option value="cash">Paiement à la livraison (espèces)</option>
                    </Form.Select>
                  </Form.Group>

                  <div className="d-grid gap-2">
                    <Button 
                      type="submit" 
                      variant="success" 
                      size="lg"
                      disabled={submitting}
                      style={{ backgroundColor: '#10b981', borderColor: '#10b981' }}
                    >
                      {submitting ? 'Validation...' : 'Valider la commande'}
                    </Button>
                    <Button 
                      variant="outline-secondary"
                      onClick={() => navigate('/panier')}
                    >
                      Retour au panier
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="border-0 shadow-sm sticky-top" style={{ top: '20px' }}>
              <Card.Body>
                <h5 className="fw-bold mb-4">Récapitulatif</h5>
                
                <div className="mb-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="d-flex justify-content-between mb-2">
                      <small>{item.nom} x{item.quantite}</small>
                      <small className="fw-semibold">{item.total_ligne} TND</small>
                    </div>
                  ))}
                </div>

                <hr />

                <div className="d-flex justify-content-between mb-2">
                  <span>Sous-total</span>
                  <span>{(total - 8).toFixed(2)} TND</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Livraison</span>
                  <span>8.00 TND</span>
                </div>

                <hr />

                <div className="d-flex justify-content-between">
                  <strong className="fs-5">Total</strong>
                  <strong className="fs-5" style={{ color: '#10b981' }}>
                    {total.toFixed(2)} TND
                  </strong>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Checkout;