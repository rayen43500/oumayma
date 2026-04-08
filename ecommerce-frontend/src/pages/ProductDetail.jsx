import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Alert, Form } from 'react-bootstrap';
import productService from '../services/productService';
import api from '../services/api';
import { useAuth } from '../context/AuthContext.jsx';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await productService.getProductById(id);
      setProduct(response.data);
    } catch (error) {
      console.error('Erreur:', error);
      setMessage({ type: 'danger', text: 'Produit non trouvé' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setAddingToCart(true);
    setMessage({ type: '', text: '' });

    try {
      await api.post('/panier/add', {
        produit_id: product.id,
        quantite: quantity
      });
      setMessage({ type: 'success', text: '✅ Produit ajouté au panier !' });
    } catch (error) {
      setMessage({ 
        type: 'danger', 
        text: error.response?.data?.message || 'Erreur lors de l\'ajout au panier' 
      });
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="success" />
        <p className="mt-3 text-muted">Chargement...</p>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="danger">Produit non trouvé</Alert>
        <Button variant="success" onClick={() => navigate('/produits')}>
          Retour aux produits
        </Button>
      </Container>
    );
  }

  return (
    <div className="py-5">
      <Container>
        <Row>
          <Col md={6} className="mb-4 mb-md-0">
            <Card className="border-0 shadow-sm">
              <div 
                className="bg-light d-flex align-items-center justify-content-center" 
                style={{ height: '400px', backgroundColor: '#f8f9fa' }}
              >
                {product.image ? (
                  <Card.Img 
                    src={product.image} 
                    alt={product.nom}
                    style={{ 
                      height: '400px', 
                      objectFit: 'contain',
                      objectPosition: 'center',
                      padding: '15px'
                    }}
                  />
                ) : (
                  <img src="/rigoula_logo.png" alt="Rigoula" style={{ height: '160px' }} />
                )}
              </div>
            </Card>
          </Col>

          <Col md={6}>
            <h1 className="fw-bold mb-3">{product.nom}</h1>
            
            <div className="mb-3">
              <span className="badge bg-success me-2">{product.categorie_nom}</span>
              {product.sous_categorie_nom && (
                <span className="badge bg-secondary">{product.sous_categorie_nom}</span>
              )}
            </div>

            <h2 className="fw-bold mb-4" style={{ color: '#10b981' }}>
              {product.prix} TND
              {product.prix_promo && (
                <span className="text-muted text-decoration-line-through ms-2 fs-5">
                  {product.prix_promo} TND
                </span>
              )}
            </h2>

            <div className="mb-4">
              <p className="mb-2">
                <strong>Stock disponible :</strong>{' '}
                <span className={product.stock > 0 ? 'text-success' : 'text-danger'}>
                  {isAdmin
                    ? (product.stock > 0 ? `${product.stock} unités` : 'Rupture de stock')
                    : (product.stock > 0 ? 'En stock' : 'Rupture de stock')
                  }
                </span>
              </p>
            </div>

            {message.text && (
              <Alert variant={message.type} className="mb-4">
                {message.text}
              </Alert>
            )}

            {product.stock > 0 && (
              <div className="mb-4">
                <Form.Group>
                  <Form.Label className="fw-semibold">Quantité</Form.Label>
                  <div className="d-flex gap-3 align-items-center">
                    <Button 
                      variant="outline-secondary"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </Button>
                    <Form.Control
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      min="1"
                      max={product.stock}
                      style={{ maxWidth: '100px', textAlign: 'center' }}
                    />
                    <Button 
                      variant="outline-secondary"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    >
                      +
                    </Button>
                  </div>
                </Form.Group>
              </div>
            )}

            <div className="d-grid gap-2">
              <Button
                variant="success"
                size="lg"
                onClick={handleAddToCart}
                disabled={product.stock === 0 || addingToCart}
                style={{ backgroundColor: '#10b981', borderColor: '#10b981' }}
              >
                {addingToCart ? 'Ajout...' : '🛒 Ajouter au panier'}
              </Button>
              <Button
                variant="outline-secondary"
                size="lg"
                onClick={() => navigate('/produits')}
              >
                ← Retour aux produits
              </Button>
            </div>
          </Col>
        </Row>

        {/* Section Description */}
        <Row className="mt-5 pt-4 border-top">
          <Col lg={12}>
            <h2 className="fw-bold mb-4">Description</h2>
            <p className="text-muted" style={{ fontSize: '1.05rem', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
              {product.description}
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProductDetail;