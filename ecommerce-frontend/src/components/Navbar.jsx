import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext.jsx';
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

const NavigationBar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const logoValue = settings.site_logo || '';
  const isLogoImage = logoValue.startsWith('http') || logoValue.includes('/uploads');
  const logoSrc = resolveMediaUrl(logoValue);

  const handleLogout = () => {
    logout();
    navigate('/');
    setExpanded(false);
  };

  return (
    <Navbar
      expand="lg"
      className="navbar-custom"
      expanded={expanded}
      sticky="top"
    >
      <Container>
        <Navbar.Brand as={Link} to="/" onClick={() => setExpanded(false)} className="fw-bold d-flex align-items-center gap-2">
          {/* Logo dynamique */}
          {logoValue && (
            isLogoImage ? (
              <img 
                src={logoSrc} 
                alt="Logo" 
                style={{ height: '50px', objectFit: 'contain' }}
              />
            ) : (
              <span style={{ fontSize: '1.8rem' }}>{logoValue}</span>
            )
          )}
          {settings.site_name || 'RIGOULA'}
        </Navbar.Brand>
        
        <Navbar.Toggle 
          aria-controls="basic-navbar-nav" 
          onClick={() => setExpanded(!expanded)}
        />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-lg-center">
            <Nav.Link href="/#home" onClick={() => setExpanded(false)} className="nav-link-modern">
              Accueil
            </Nav.Link>
            <Nav.Link href="/#presentation" onClick={() => setExpanded(false)} className="nav-link-modern">
              À propos
            </Nav.Link>
            <Nav.Link href="/#evenements" onClick={() => setExpanded(false)} className="nav-link-modern">
              Événements
            </Nav.Link>
            <Nav.Link as={Link} to="/produits" onClick={() => setExpanded(false)} className="nav-link-modern">
              Produits
            </Nav.Link>
            <Nav.Link as={Link} to="/contact" onClick={() => setExpanded(false)} className="nav-link-modern">
              Contact
            </Nav.Link>

            {isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/panier" onClick={() => setExpanded(false)} className="ms-2">
                  🛒 Panier
                </Nav.Link>
                
                <NavDropdown 
                  title={`👤 ${user.prenom}`} 
                  id="user-dropdown" 
                  className="ms-2"
                  drop="down"
                  align="end"
                >
                  {!isAdmin && (
                    <NavDropdown.Item as={Link} to="/mes-commandes" onClick={() => setExpanded(false)}>
                      Mes Commandes
                    </NavDropdown.Item>
                  )}
                  <NavDropdown.Item as={Link} to="/profil" onClick={() => setExpanded(false)}>
                    Mon Profil
                  </NavDropdown.Item>
                  {isAdmin && (
                    <>
                      <NavDropdown.Divider />
                      <NavDropdown.Item as={Link} to="/admin" onClick={() => setExpanded(false)}>
                        📊 Administration
                      </NavDropdown.Item>
                    </>
                  )}
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    Déconnexion
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <div className="d-flex gap-3 mt-3 mt-lg-0 ms-lg-2">
                <Link to="/login" onClick={() => setExpanded(false)}>
                  <Button variant="light" size="sm" className="fw-bold">
                    Connexion
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setExpanded(false)}>
                  <Button variant="warning" size="sm" className="fw-bold">
                    Inscription
                  </Button>
                </Link>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;