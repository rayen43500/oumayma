import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { useSettings } from '../context/SettingsContext.jsx';

const API_BASE_URL = 'http://localhost:5000';

const resolveMediaUrl = (value) => {
  if (!value) return '';
  if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:')) return value;
  const uploadsIndex = value.indexOf('/uploads/');
  if (uploadsIndex !== -1) {
    return `${API_BASE_URL}${value.slice(uploadsIndex)}`;
  }
  if (value.startsWith('uploads/')) {
    return `${API_BASE_URL}/${value}`;
  }
  return value;
};

const Footer = () => {
  const { settings } = useSettings();
  const currentYear = new Date().getFullYear();
  const displayName = (settings.site_name || 'RIGOULA').toUpperCase();

  const logoValue = settings.site_logo || '';
  const isLogoImage = logoValue.startsWith('http') || logoValue.includes('/uploads');
  const logoSrc = resolveMediaUrl(logoValue);

  const socialLinks = [
    { key: 'facebook_url', icon: 'fab fa-facebook-f', title: 'Facebook' },
    { key: 'instagram_url', icon: 'fab fa-instagram', title: 'Instagram' },
    { key: 'twitter_url', icon: 'fab fa-x-twitter', title: 'X' },
    { key: 'linkedin_url', icon: 'fab fa-linkedin-in', title: 'LinkedIn' }
  ].filter(({ key }) => settings[key] && settings[key] !== '#');

  return (
    <footer className="footer-animated py-5 mt-auto">
      <Container>
        <Row className="mb-4">
          <Col md={4} className="mb-4 mb-md-0">
            <h5 className="mb-4 footer-title d-flex align-items-center gap-2">
              {/* Logo dynamique */}
              {logoValue && (
                isLogoImage ? (
                  <img 
                    src={logoSrc} 
                    alt="Logo" 
                    style={{ height: '40px', objectFit: 'contain' }}
                  />
                ) : (
                  <span style={{ fontSize: '1.5rem' }}>{logoValue}</span>
                )
              )}
              {displayName}
            </h5>
            <p className="text-white-50" style={{ fontSize: '0.95rem', lineHeight: '1.8', fontWeight: '400' }}>
              {settings.site_description || 'RIGOULA'}
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
            <h6 className="mb-4 footer-subtitle">Contact</h6>
            <ul className="list-unstyled text-white-50" style={{ fontSize: '0.95rem', fontWeight: '400' }}>
              <li className="mb-3">
                <i className="fas fa-phone" style={{ marginRight: '10px', color: '#ffffff' }}></i>
                {settings.contact_phone || '+21612345678'}
              </li>
              <li className="mb-3">
                <i className="fas fa-envelope" style={{ marginRight: '10px', color: '#ffffff' }}></i>
                {settings.contact_email || 'test.test@test.com'}
              </li>
              <li className="mb-3">
                <i className="fas fa-map-marker-alt" style={{ marginRight: '10px', color: '#ffffff' }}></i>
                {settings.contact_address || 'form form form'}
              </li>
            </ul>
            
            {/* Réseaux sociaux */}
            <div className="mt-4 d-flex gap-3 justify-content-end">
              {socialLinks.map((social) => (
                <a
                  key={social.key}
                  href={settings[social.key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-icon"
                  title={social.title}
                >
                  <i className={social.icon}></i>
                </a>
              ))}
            </div>
          </Col>
        </Row>

        <hr className="my-4 bg-secondary" />

        <Row>
          <Col className="text-center text-white-50">
            <p className="mb-0" style={{ fontSize: '0.9rem', fontWeight: '400' }}>
              © {currentYear} {displayName}
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;