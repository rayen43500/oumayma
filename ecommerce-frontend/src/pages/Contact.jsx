import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useSettings } from '../context/SettingsContext.jsx';
import api from '../services/api';

const Contact = () => {
  const { settings } = useSettings();
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    sujet: '',
    message: ''
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      await api.post('/contact', formData);
      setSuccess(true);
      setFormData({
        nom: '',
        email: '',
        telephone: '',
        sujet: '',
        message: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'envoi du message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5">
      <Container>
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold mb-3">Contactez-nous</h1>
          <p className="lead text-muted">
            Une question ? Une suggestion ? N'hésitez pas à nous écrire !
          </p>
        </div>

        <Row>
          <Col lg={6} className="mb-4 mb-lg-0">
            <Card className="shadow-sm border-0 h-100">
              <Card.Body className="p-4">
                <h3 className="fw-bold mb-4">Envoyez-nous un message</h3>

                {success && (
                  <Alert variant="success">
                    ✅ Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.
                  </Alert>
                )}

                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Nom complet</Form.Label>
                    <Form.Control
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      required
                      placeholder="Votre nom"
                    />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="votre@email.com"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Téléphone</Form.Label>
                        <Form.Control
                          type="tel"
                          name="telephone"
                          value={formData.telephone}
                          onChange={handleChange}
                          placeholder="98765432"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Sujet</Form.Label>
                    <Form.Control
                      type="text"
                      name="sujet"
                      value={formData.sujet}
                      onChange={handleChange}
                      placeholder="L'objet de votre message"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">Message</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Votre message..."
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    className="w-100 fw-semibold"
                    disabled={loading}
                    size="lg"
                    style={{ backgroundColor: '#10b981', borderColor: '#10b981' }}
                  >
                    {loading ? 'Envoi...' : 'Envoyer le message'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={6}>
            <Card className="shadow-sm border-0 h-100">
              <Card.Body className="p-5 d-flex flex-column justify-content-around min-vh-100">
                <h3 className="fw-bold mb-5 text-center" style={{ color: '#10b981', fontSize: '1.8rem' }}>Nos coordonnées</h3>

              {/* Adresse */}
              <Card className="mb-4 border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)' }}>
                <Card.Body className="p-4 text-center">
                  <div className="mb-3">
                    <span style={{ fontSize: '2.5rem' }}>📍</span>
                  </div>
                  <h6 className="fw-bold mb-2" style={{ color: '#10b981', fontSize: '1.1rem' }}>Adresse</h6>
                  <p className="mb-0 text-muted" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
                    Rue Mohammed EL JAMMOUSSI, Immeuble Elkods,<br />
                    Magasin N°3, 3049 Sfax, Tunisie
                  </p>
                </Card.Body>
              </Card>

              {/* Téléphone */}
              <Card className="mb-4 border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)' }}>
                <Card.Body className="p-4 text-center">
                  <div className="mb-3">
                    <span style={{ fontSize: '2.5rem' }}>📞</span>
                  </div>
                  <h6 className="fw-bold mb-2" style={{ color: '#10b981', fontSize: '1.1rem' }}>Téléphone</h6>
                  <p className="mb-0 text-muted fw-semibold" style={{ fontSize: '0.95rem' }}>+216 29 550 026</p>
                </Card.Body>
              </Card>

              {/* Email */}
              <Card className="border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)' }}>
                <Card.Body className="p-4 text-center">
                  <div className="mb-3">
                    <span style={{ fontSize: '2.5rem' }}>✉️</span>
                  </div>
                  <h6 className="fw-bold mb-2" style={{ color: '#10b981', fontSize: '1.1rem' }}>Email</h6>
                  <p className="mb-0 text-muted" style={{ fontSize: '0.95rem' }}>triki.mouna77@gmail.com</p>
                </Card.Body>
              </Card>


              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Contact;