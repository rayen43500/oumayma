import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Nav } from 'react-bootstrap';

const AdminNavbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="bg-white border-bottom shadow-sm">
      <div className="container">
        <Nav className="py-3 flex-nowrap overflow-auto">
          <Nav.Link
            as={Link}
            to="/admin"
            className={`me-3 ${isActive('/admin') ? 'fw-bold' : ''}`}
            style={isActive('/admin') ? { color: '#10b981' } : {}}
          >
            📊 Dashboard
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/admin/produits"
            className={`me-3 ${isActive('/admin/produits') ? 'fw-bold' : ''}`}
            style={isActive('/admin/produits') ? { color: '#10b981' } : {}}
          >
            📦 Produits
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/admin/categories"
            className={`me-3 ${isActive('/admin/categories') ? 'fw-bold' : ''}`}
            style={isActive('/admin/categories') ? { color: '#10b981' } : {}}
          >
            📂 Catégories
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/admin/commandes"
            className={`me-3 ${isActive('/admin/commandes') ? 'fw-bold' : ''}`}
            style={isActive('/admin/commandes') ? { color: '#10b981' } : {}}
          >
            🛒 Commandes
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/admin/utilisateurs"
            className={`me-3 ${isActive('/admin/utilisateurs') ? 'fw-bold' : ''}`}
            style={isActive('/admin/utilisateurs') ? { color: '#10b981' } : {}}
          >
            👥 Utilisateurs
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/admin/messages"
            className={`me-3 ${isActive('/admin/messages') ? 'fw-bold' : ''}`}
            style={isActive('/admin/messages') ? { color: '#10b981' } : {}}
          >
            ✉️ Messages
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/admin/evenements"
            className={`me-3 ${isActive('/admin/evenements') ? 'fw-bold' : ''}`}
            style={isActive('/admin/evenements') ? { color: '#10b981' } : {}}
          >
            📅 Événements
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/admin/certifications"
            className={`me-3 ${isActive('/admin/certifications') ? 'fw-bold' : ''}`}
            style={isActive('/admin/certifications') ? { color: '#10b981' } : {}}
          >
            🏆 Certifications
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/admin/parametres"
            className={`me-3 ${isActive('/admin/parametres') ? 'fw-bold' : ''}`}
            style={isActive('/admin/parametres') ? { color: '#10b981' } : {}}
          >
            ⚙️ Paramètres
          </Nav.Link>
        </Nav>
      </div>
    </div>
  );
};

export default AdminNavbar;