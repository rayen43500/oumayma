import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import api from '../services/api';

const ForgotPassword = () => {
  const [method, setMethod] = useState('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    // Simuler l'envoi (remplacer par l'appel API réel quand le backend sera prêt)
    setTimeout(() => {
      if (method === 'email') {
        setMessage('Un email de réinitialisation a été envoyé à votre adresse email.');
      } else {
        setMessage('Un code de réinitialisation a été envoyé à votre numéro de téléphone.');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow">
            <Card.Body className="p-5">
              <h2 className="text-center mb-4 fw-bold text-primary-custom">
                Mot de passe oublié
              </h2>

              {error && <Alert variant="danger">{error}</Alert>}
              {message && <Alert variant="success">{message}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Méthode de réinitialisation</Form.Label>
                  <div>
                    <Form.Check
                      type="radio"
                      label="Par email"
                      name="method"
                      value="email"
                      checked={method === 'email'}
                      onChange={(e) => setMethod(e.target.value)}
                      inline
                    />
                    <Form.Check
                      type="radio"
                      label="Par SMS"
                      name="method"
                      value="phone"
                      checked={method === 'phone'}
                      onChange={(e) => setMethod(e.target.value)}
                      inline
                    />
                  </div>
                </Form.Group>

                {method === 'email' ? (
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="votre@email.com"
                    />
                  </Form.Group>
                ) : (
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">Numéro de téléphone</Form.Label>
                    <Form.Control
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      placeholder="98765432"
                    />
                  </Form.Group>
                )}

                <Button
                  variant="success"
                  type="submit"
                  className="w-100 fw-semibold"
                  disabled={loading}
                  size="lg"
                >
                  {loading ? 'Envoi...' : method === 'email' ? 'Envoyer le lien de réinitialisation' : 'Envoyer le code par SMS'}
                </Button>
              </Form>

              <p className="text-center mt-4 mb-0">
                <Link to="/login" className="text-primary-custom fw-semibold text-decoration-none">
                  Retour à la connexion
                </Link>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPassword;