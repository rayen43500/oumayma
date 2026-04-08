import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Table } from 'react-bootstrap';
import api from '../services/api';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/commandes/my-orders');
      console.log('📦 Commandes reçues:', response.data.data);
      setOrders(response.data.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'en_attente': { bg: 'warning', text: 'En attente' },
      'confirmee': { bg: 'info', text: 'Confirmée' },
      'expediee': { bg: 'primary', text: 'Expédiée' },
      'livree': { bg: 'success', text: 'Livrée' },
      'annulee': { bg: 'danger', text: 'Annulée' }
    };
    
    const badge = badges[status] || { bg: 'secondary', text: status };
    return <Badge bg={badge.bg}>{badge.text}</Badge>;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="success" />
        <p className="mt-3 text-muted">Chargement des commandes...</p>
      </Container>
    );
  }

  return (
    <div className="py-5 bg-light">
      <Container>
        <h1 className="fw-bold mb-4">📦 Mes Commandes</h1>

        {orders.length === 0 ? (
          <Card className="text-center p-5 border-0 shadow-sm">
            <Card.Body>
              <h3 className="text-muted">Vous n'avez pas encore de commande</h3>
            </Card.Body>
          </Card>
        ) : (
          <Row>
            {orders.map((order) => {
              console.log(`📋 Commande #${order.id}:`, order);
              return (
              <Col key={order.id} md={12} className="mb-4">
                <Card className="border-0 shadow-sm">
                  <Card.Body>
                    <Row>
                      <Col md={8}>
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div>
                            <h5 className="fw-bold mb-1">Commande #{order.id}</h5>
                            <small className="text-muted">
                              Passée le {formatDate(order.created_at)}
                            </small>
                          </div>
                          {getStatusBadge(order.statut)}
                        </div>

                        {(() => {
                          return (
                            <>
                              <div className="mb-2">
                                <strong>Nom:</strong>
                                <p className="text-muted mb-1">{order.nom || 'Non spécifié'}</p>
                              </div>
                              <div className="mb-2">
                                <strong>Prénom:</strong>
                                <p className="text-muted mb-1">{order.prenom || 'Non spécifié'}</p>
                              </div>
                              <div className="mb-2">
                                <strong>Adresse de livraison:</strong>
                                <p className="text-muted mb-1">{order.adresse || 'Non spécifiée'}</p>
                              </div>
                            </>
                          );
                        })()}

                        <div>
                          <strong>Téléphone:</strong>
                          <p className="text-muted mb-0">{order.telephone_contact}</p>
                        </div>
                      </Col>

                      <Col md={4} className="text-md-end">
                        <div className="mb-3">
                          <small className="text-muted d-block mb-2"><strong>Produits commandés:</strong></small>
                          {order.produits && order.produits.length > 0 ? (
                            <div style={{ fontSize: '0.85rem', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #e0e0e0' }}>
                              {order.produits.map((produit, idx) => {
                                const prixUnitaire = produit.prix ? parseFloat(produit.prix) : 0;
                                const prixTotal = prixUnitaire * (produit.quantite || 1);
                                return (
                                  <div key={idx} className="d-flex justify-content-between mb-1">
                                    <span>{produit.nom} x{produit.quantite}</span>
                                    <span className="fw-bold">{prixTotal > 0 ? prixTotal.toFixed(2) : '-'} TND</span>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div style={{ fontSize: '0.85rem', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #e0e0e0' }}>
                              <p className="text-muted mb-0">{order.nb_produits} produit(s)</p>
                            </div>
                          )}
                        </div>

                        <div>
                          <small className="text-muted">Montant</small>
                          <div style={{ fontSize: '0.9rem', marginBottom: '8px' }}>
                            <div className="d-flex justify-content-end mb-1">
                              <span>Sous-total:</span>
                              <span className="ms-2">{parseFloat(order.total).toFixed(2)} TND</span>
                            </div>
                            <div className="d-flex justify-content-end mb-1">
                              <span>Livraison:</span>
                              <span className="ms-2">8 TND</span>
                            </div>
                            <div className="border-top pt-1 d-flex justify-content-end fw-bold" style={{ color: '#10b981' }}>
                              <span>Total:</span>
                              <span className="ms-2">{(parseFloat(order.total) + 8).toFixed(2)} TND</span>
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            );
            })}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default MyOrders;