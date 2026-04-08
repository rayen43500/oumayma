import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useSettings } from '../context/SettingsContext.jsx';

const Presentation = () => {
  const { settings } = useSettings();

  return (
    <div className="presentation-page py-5">
      <Container>
        {/* En-tête */}
        <div className="presentation-header text-center mb-5">
          <h1 className="display-4 fw-bold mb-3">
            {settings.about_title || 'À propos de Rigoula'}
          </h1>
          <p className="lead text-muted">
            {settings.site_description || 'Votre partenaire de confiance'}
          </p>
        </div>

        {/* Notre Histoire et Photo */}
        <section className="story-section mb-5">
          <Row className="align-items-center">
            <Col md={6} className="mb-4 mb-md-0">
              <h2 className="story-title fw-bold mb-4">Notre Histoire</h2>
              <p className="story-text text-muted">
                {settings.about_description || <>
                  2017 : Les débuts Mouna Triki Lamine, designer de formation, décide de changer de vie. Elle crée une petite ferme dans son jardin pour cultiver des légumes bio, sans produits chimiques.<br /><br />
                  2021 : On grandit Face au succès, RIGOULA s'installe sur un terrain de 2 hectares à Bir Mallouli.<br /><br />
                  2022 : La reconnaissance Certification bio ECOCERT Médaille de bronze au concours national des produits du terroir tunisiens.<br /><br />
                  Aujourd'hui RIGOULA propose des légumes bio et des produits artisanaux faits selon des recettes traditionnelles : hrous (médaille d'or), tomates séchées (médaille d'argent), hrissa, sauces et légumes marinés.<br /><br />
                  Notre engagement : Nous formons les femmes de la région et protégeons l'environnement avec une agriculture 100% naturelle.<br /><br />
                  Demain RIGOULA se prépare à conquérir les marchés internationaux pour faire découvrir le savoir-faire tunisien au monde entier.
                </>}
              </p>
            </Col>
            <Col md={6}>
              <div className="presentation-image rounded shadow">
                {settings.presentation_image ? (
                  <img 
                    src={settings.presentation_image} 
                    alt="Présentation Rigoula"
                    className="img-fluid rounded"
                    style={{ maxHeight: '400px', objectFit: 'cover', width: '100%' }}
                  />
                ) : (
                  <div 
                    style={{
                      height: '400px',
                      backgroundColor: '#f0f0f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '8px'
                    }}
                  >
                    <p className="text-muted text-center">
                      Aucune image<br />
                      <small>(À configurer par l'admin)</small>
                    </p>
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </section>

        {/* Timeline en bas */}
        <section className="timeline-section mb-5">
          <Row>
            <Col lg={10} className="mx-auto">
              <div className="timeline-container">
                <div className="timeline-item mb-4 pb-3 border-bottom">
                  <div className="row">
                    <div className="col-md-2">
                      <h5 className="fw-bold text-success">2017</h5>
                    </div>
                    <div className="col-md-10">
                      <p className="text-muted mb-0">{settings.timeline_2017 || 'La naissance de RIGOULA'}</p>
                    </div>
                  </div>
                </div>

                <div className="timeline-item mb-4 pb-3 border-bottom">
                  <div className="row">
                    <div className="col-md-2">
                      <h5 className="fw-bold text-success">2021</h5>
                    </div>
                    <div className="col-md-10">
                      <p className="text-muted mb-0">{settings.timeline_2021 || 'Expansion et croissance'}</p>
                    </div>
                  </div>
                </div>

                <div className="timeline-item mb-4 pb-3 border-bottom">
                  <div className="row">
                    <div className="col-md-2">
                      <h5 className="fw-bold text-success">2022</h5>
                    </div>
                    <div className="col-md-10">
                      <p className="text-muted mb-0">{settings.timeline_2022 || 'Certification et excellence'}</p>
                    </div>
                  </div>
                </div>

                <div className="timeline-item mb-4 pb-3 border-bottom">
                  <div className="row">
                    <div className="col-md-2">
                      <h5 className="fw-bold text-success">2024</h5>
                    </div>
                    <div className="col-md-10">
                      <p className="text-muted mb-0">{settings.timeline_2024 || 'Récompenses nationales'}</p>
                    </div>
                  </div>
                </div>

                <div className="timeline-item">
                  <div className="row">
                    <div className="col-md-2">
                      <h5 className="fw-bold text-success">✓ Aujourd'hui</h5>
                    </div>
                    <div className="col-md-10">
                      <p className="text-muted mb-0">{settings.timeline_today || 'Une gamme authentique'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </section>

        {/* Nos Valeurs */}
        <section className="values-section mb-5">
          <h2 className="values-title text-center fw-bold mb-5">Nos Valeurs</h2>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="value-card text-center h-100 shadow-sm border-0">
                <Card.Body>
                  <div className="value-icon display-3 mb-3">✨</div>
                  <Card.Title className="fw-bold">Qualité</Card.Title>
                  <Card.Text className="text-muted">
                    Nous sélectionnons rigoureusement nos produits pour garantir la meilleure
                    qualité à nos clients.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="value-card text-center h-100 shadow-sm border-0">
                <Card.Body>
                  <div className="value-icon display-3 mb-3">🌱</div>
                  <Card.Title className="fw-bold">Durabilité</Card.Title>
                  <Card.Text className="text-muted">
                    Nous pratiquons une agriculture respectueuse de l'environnement et
                    des générations futures.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="value-card text-center h-100 shadow-sm border-0">
                <Card.Body>
                  <div className="value-icon display-3 mb-3">🤝</div>
                  <Card.Title className="fw-bold">Confiance</Card.Title>
                  <Card.Text className="text-muted">
                    Nous établissons des relations durables basées sur la transparence et
                    la confiance mutuelle.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </section>
      </Container>
    </div>
  );
};

export default Presentation;