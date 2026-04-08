import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useSettings } from '../context/SettingsContext.jsx';

const Home = () => {
  const { settings } = useSettings();

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section py-5">
        <Container className="py-5 text-white text-center">
          <h1 className="display-3 fw-bold mb-4">
             {settings.hero_title || 'Bienvenue chez Rigoula'}
          </h1>
          <p className="lead fs-4 mb-5">
            {settings.hero_subtitle || 'Des produits agricoles biologiques frais et de qualité supérieure'}
          </p>
          <Link to="/produits">
            <Button size="lg" className="hero-btn fw-bold px-5 py-3">
              Découvrir nos produits
            </Button>
          </Link>
        </Container>
      </section>

      {/* Présentation rapide */}
      <section className="features-section py-5">
        <Container>
          <Row>
            <Col md={4} className="text-center mb-4 mb-md-0">
              <div className="feature-icon">🍊</div>
              <h3 className="h4 mb-3 fw-bold" style={{color: '#1b7d38'}}>Produits Frais</h3>
              <p className="text-muted" style={{fontSize: '1.05rem'}}>
                Des fruits et légumes récoltés chaque jour avec le meilleur soin
              </p>
            </Col>
            <Col md={4} className="text-center mb-4 mb-md-0">
              <div className="feature-icon">🌿</div>
              <h3 className="h4 mb-3 fw-bold" style={{color: '#1b7d38'}}>100% Biologique</h3>
              <p className="text-muted" style={{fontSize: '1.05rem'}}>
                Sans pesticides ni additifs chimiques, cultivés naturellement
              </p>
            </Col>
            <Col md={4} className="text-center">
              <div className="feature-icon">🚚</div>
              <h3 className="h4 mb-3 fw-bold" style={{color: '#1b7d38'}}>Livraison Rapide</h3>
              <p className="text-muted" style={{fontSize: '1.05rem'}}>
                Livraison à domicile dans toute la Tunisie en moins de 24h
              </p>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Home;