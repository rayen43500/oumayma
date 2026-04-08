import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { useSettings } from '../context/SettingsContext.jsx';

const Footer = () => {
  const { settings } = useSettings();

  return (
    <footer className="footer-animated py-5 mt-auto">
      <Container>
        <Row className="mb-4">
          <Col md={4} className="mb-4 mb-md-0">
            <h5 className="mb-4 footer-title d-flex align-items-center gap-2">
              {/* Logo dynamique */}
              {settings.site_logo && (
                settings.site_logo.startsWith('http') ? (
                  <img 
                    src={settings.site_logo} 
                    alt="Logo" 
                    style={{ height: '40px', objectFit: 'contain' }}
                  />
                ) : (
                  <span style={{ fontSize: '1.5rem' }}>{settings.site_logo}</span>
                )
              )}
              {settings.site_name || 'Rigoula'}
            </h5>
            <p className="text-white-50" style={{ fontSize: '0.95rem', lineHeight: '1.8', fontWeight: '400' }}>
              {settings.site_description || 'Votre partenaire de confiance pour des produits agricoles biologiques de qualité supérieure en Tunisie.'}
            </p>
          </Col>

          <Col md={4} className="mb-4 mb-md-0">
            <h6 className="mb-4 footer-subtitle">Informations</h6>
            <ul className="list-unstyled">
              <li className="mb-3">
                <Link to="/" className="footer-link" onClick={() => window.scrollTo(0, 0)}>
                  Accueil
                </Link>
              </li>
             
              <li className="mb-3">
                <Link to="/produits" className="footer-link">
                  Produits
                </Link>
              </li>
               <li className="mb-3">
                <Link to="/contact" className="footer-link">
                  Contactez-nous
                </Link>
              </li>
            </ul>
          </Col>

          <Col md={4}>
            <h6 className="mb-4 footer-subtitle">Contact Details</h6>
            <ul className="list-unstyled text-white-50" style={{ fontSize: '0.95rem', fontWeight: '400' }}>
              <li className="mb-3">
                <i className="fas fa-phone" style={{ marginRight: '10px', color: '#a7f3d0' }}></i>
                {settings.contact_phone || '+216 71 234 567'}
              </li>
              <li className="mb-3">
                <i className="fas fa-envelope" style={{ marginRight: '10px', color: '#a7f3d0' }}></i>
                {settings.contact_email || 'contact@rigoula.com'}
              </li>
              <li className="mb-3">
                <i className="fas fa-map-marker-alt" style={{ marginRight: '10px', color: '#a7f3d0' }}></i>
                {settings.contact_address || 'Tunis, Tunisie'}
              </li>
            </ul>
            
            {/* Réseaux sociaux */}
            <div className="mt-4 d-flex gap-3 justify-content-end">
              {settings.facebook_url && settings.facebook_url !== '#' && (
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="footer-social-icon" title="Facebook">
                  <i className="fab fa-facebook-f"></i>
                </a>
              )}
              {settings.instagram_url && settings.instagram_url !== '#' && (
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="footer-social-icon" title="Instagram">
                  <i className="fab fa-instagram"></i>
                </a>
              )}
            </div>
          </Col>
        </Row>

        <hr className="my-4 bg-secondary" />

        <Row>
          <Col className="text-center text-white-50">
            <p className="mb-0" style={{ fontSize: '0.9rem', fontWeight: '400' }}>
              © 2026 {settings.site_name || 'Rigoula'}
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;