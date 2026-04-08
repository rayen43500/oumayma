import React, { useEffect, useState } from 'react';
import { Container, Table, Badge, Spinner, Form, Button, Alert } from 'react-bootstrap';
import api from '../services/api';

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [filterStatus, setFilterStatus] = useState('');
  const [sortOrder, setSortOrder] = useState('oldest');

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    setOrders(prevOrders => [...prevOrders].sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return sortOrder === 'oldest' ? dateA - dateB : dateB - dateA;
    }));
  }, [sortOrder]);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/commandes');
      console.log("Réponse brute:", response);
      console.log("response.data:", response.data);
      
      let data = response.data;
      
      // Si les données sont imbriquées, les extraire
      if (data.data) {
        console.log("Données imbriquées trouvées:", data.data);
        data = data.data;
      }
      
      console.log("Data avant tri:", data);
      
      if (!Array.isArray(data)) {
        console.log("Data n'est pas un array, type:", typeof data);
        data = [];
      }
      
      const sortedOrders = data.sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return sortOrder === 'oldest' ? dateA - dateB : dateB - dateA;
      });
      
      console.log("Commandes finales:", sortedOrders);
      setOrders(sortedOrders);
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

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/commandes/${orderId}/status`, { statut: newStatus });
      setMessage({ type: 'success', text: '✅ Statut mis à jour' });
      fetchOrders();
      setTimeout(() => setMessage({ type: '', text: '' }), 2000);
    } catch (error) {
      setMessage({ type: 'danger', text: 'Erreur lors de la mise à jour' });
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="success" />
      </Container>
    );
  }

  return (
    <div className="py-5 bg-light">
      <Container>
        <h1 className="fw-bold mb-4">🛒 Gestion des Commandes</h1>

        {message.text && (
          <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', text: '' })}>
            {message.text}
          </Alert>
        )}

        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex gap-3">
            <div>
              <label className="form-label mb-1">Filtrer par statut:</label>
              <Form.Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{ width: '200px' }}
              >
                <option value="">Tous les statuts</option>
                <option value="en_attente">En attente</option>
                <option value="confirmee">Confirmée</option>
                <option value="expediee">Expédiée</option>
                <option value="livree">Livrée</option>
                <option value="annulee">Annulée</option>
              </Form.Select>
            </div>
            <div>
              <label className="form-label mb-1">Trier par date:</label>
              <Form.Select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                style={{ width: '200px' }}
              >
                <option value="oldest">Plus ancien d'abord</option>
                <option value="newest">Plus récent d'abord</option>
              </Form.Select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded shadow-sm">
          <Table responsive hover className="mb-0">
            <thead className="bg-light">
              <tr>
                <th style={{ width: '5%', minWidth: '50px', padding: '12px 8px' }}>ID</th>
                <th style={{ width: '13%', minWidth: '120px', padding: '12px 10px' }}>Client</th>
                <th style={{ width: '18%', minWidth: '140px', padding: '12px 10px' }}>Adresse</th>
                <th style={{ width: '11%', minWidth: '110px', padding: '12px 8px' }}>Téléphone</th>
                <th style={{ width: '13%', minWidth: '130px', padding: '12px 8px' }}>Date</th>
                <th style={{ width: '16%', minWidth: '150px', padding: '12px 10px' }}>Produits</th>
                <th style={{ width: '9%', minWidth: '85px', padding: '12px 8px' }}>Montant</th>
                <th style={{ width: '9%', minWidth: '90px', padding: '12px 8px' }}>Statut</th>
                <th style={{ width: '8%', minWidth: '110px', padding: '12px 8px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.filter(order => !filterStatus || order.statut === filterStatus).map((order) => (
                <tr key={order.id}>
                  <td className="fw-bold" style={{ padding: '12px 8px' }}>#{order.id}</td>
                  <td style={{ padding: '12px 10px' }}>
                    <strong>{order.nom && order.prenom ? `${order.nom} ${order.prenom}` : 'Client inconnu'}</strong>
                  </td>
                  <td style={{ padding: '12px 10px' }}>
                    <small>{order.adresse || 'Adresse non spécifiée'}</small>
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    <small>{order.telephone_contact || 'Non spécifié'}</small>
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    <small>{formatDate(order.created_at)}</small>
                  </td>
                  <td style={{ padding: '12px 10px' }}>
                    <div style={{ fontSize: '0.85rem' }}>
                      {order.produits && order.produits.length > 0 ? (
                        <ul style={{ margin: 0, paddingLeft: '15px', lineHeight: '1.8' }}>
                          {order.produits.map((produit, idx) => (
                            <li key={idx} style={{ marginBottom: '6px' }}>
                              {produit.nom} x{produit.quantite}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <Badge bg="secondary">{order.nb_produits} produit(s)</Badge>
                      )}
                    </div>
                  </td>
                  <td className="fw-bold" style={{ color: '#10b981', padding: '12px 8px' }}>
                    {(parseFloat(order.total) + 8).toFixed(2)} TND
                  </td>
                  <td style={{ padding: '12px 8px' }}>{getStatusBadge(order.statut)}</td>
                  <td style={{ padding: '12px 8px' }}>
                    <Form.Select
                      size="sm"
                      value={order.statut}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      style={{ width: '150px' }}
                    >
                      <option value="en_attente">En attente</option>
                      <option value="confirmee">Confirmée</option>
                      <option value="expediee">Expédiée</option>
                      <option value="livree">Livrée</option>
                      <option value="annulee">Annulée</option>
                    </Form.Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Container>
    </div>
  );
};

export default OrdersManagement;