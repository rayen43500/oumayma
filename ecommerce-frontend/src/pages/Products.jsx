import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Form } from 'react-bootstrap';
import productService from '../services/productService';
import api from '../services/api';
import { useAuth } from '../context/AuthContext.jsx';

const Products = () => {
  const { isAdmin } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(8);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async (categoryId = '', search = '') => {
    setLoading(true);
    try {
      const filters = {};
      if (categoryId) filters.category_id = categoryId;
      if (search) filters.search = search;
      
      const response = await productService.getAllProducts(filters);
      setProducts(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    fetchProducts(categoryId, searchTerm);
  };

  const handleSearchChange = (e) => {
    const search = e.target.value;
    setSearchTerm(search);
    fetchProducts(selectedCategory, search);
  };


  return (
    <div className="products-page py-5">
      <Container>
        <div className="products-header text-center mb-5" style={{
          backgroundImage: 'url(/legumes.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          borderRadius: '15px',
          padding: '4rem 2rem'
        }}>
          <h1 className="display-4 fw-bold mb-3">Nos Produits</h1>
          <p className="lead">
            Découvrez notre gamme complète de produits agricoles biologiques frais et de qualité supérieure
          </p>
        </div>

        {/* Filtres */}
        <Row className="filters-section mb-5">
          <Col md={6} className="mb-3 mb-md-0">
            <Form.Control
              type="text"
              placeholder="🔍 Rechercher un produit..."
              value={searchTerm}
              onChange={handleSearchChange}
              size="lg"
              className="search-input"
            />
          </Col>
          <Col md={6}>
            <Form.Select
              value={selectedCategory}
              onChange={handleCategoryChange}
              size="lg"
              className="category-select"
            >
              <option value="">Toutes les catégories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.nom}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>

        {/* Liste des produits */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="success" />
            <p className="mt-3 text-muted">Chargement des produits...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-5">
            <h3 className="text-muted">Aucun produit trouvé</h3>
          </div>
        ) : (
          <div>
            <Row className="products-grid">
              {products.slice(0, visibleCount).map((product) => (
                <Col key={product.id} sm={6} lg={4} xl={3} className="mb-4">
                  <Card className="h-100 product-card">
                    <div
                      className="bg-light d-flex align-items-center justify-content-center position-relative"
                      style={{ height: '250px', overflow: 'hidden', backgroundColor: '#f8f9fa' }}
                    >
                      {product.image ? (
                        <Card.Img
                          variant="top"
                          src={product.image}
                          alt={product.nom}
                          className="card-img-top"
                          style={{
                            height: '100%',
                            width: '100%',
                            objectFit: 'contain',
                            objectPosition: 'center',
                            padding: '10px'
                          }}
                        />
                      ) : (
                        <img src="/rigoula_logo.png" alt="Rigoula" style={{ height: '100px' }} />
                      )}
                      {!isAdmin && product.stock === 0 && (
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: 'rgba(0,0,0,0.5)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <span style={{color: '#fff', fontWeight: 'bold', fontSize: '1.1rem'}}>Rupture de stock</span>
                        </div>
                      )}
                    </div>
                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="fw-bold" style={{color: '#047857'}}>{product.nom}</Card.Title>
                      <Card.Text className="text-muted small line-clamp-2 flex-grow-1">
                        {product.description}
                      </Card.Text>
                      <div className="mt-3">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <span className="fs-5 fw-bold" style={{ color: '#047857' }}>
                            {product.prix} TND
                          </span>
                          <small className="badge" style={{
                            backgroundColor: product.stock > 0 ? '#10b981' : '#dc2626',
                            color: '#fff'
                          }}>
                            {isAdmin ? `Stock: ${product.stock}` : (product.stock > 0 ? 'En stock' : 'Rupture')}
                          </small>
                        </div>
                        <Link to={`/produits/${product.id}`} className="text-decoration-none">
                          <Button
                            size="sm"
                            variant="light"
                            className="w-100 fw-bold btn-voir-details"
                          >
                            Voir détails
                          </Button>
                        </Link>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
            {products.length > visibleCount && (
              <div className="text-center mt-5">
                <Button
                  onClick={() => setVisibleCount(prev => prev + 8)}
                  variant="light"
                  className="hero-btn fw-bold px-5 py-3"
                  size="lg"
                >
                  Plus des produits
                </Button>
              </div>
            )}
          </div>
        )}
      </Container>
    </div>
  );
};

export default Products;