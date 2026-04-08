import React, { useEffect, useState } from 'react';
import { Container, Table, Badge, Spinner, Alert, Button, Form } from 'react-bootstrap';
import api from '../services/api';

const MessagesManagement = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', text: '' });
  const [filter, setFilter] = useState('all'); // all, non_lu, lu, traite

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await api.get('/contact');
      setMessages(response.data.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'non_lu': { bg: 'danger', text: 'Non lu' },
      'lu': { bg: 'warning', text: 'Lu' },
      'traite': { bg: 'success', text: 'Traité' }
    };
    
    const badge = badges[status] || { bg: 'secondary', text: status };
    return <Badge bg={badge.bg}>{badge.text}</Badge>;
  };

  const handleStatusChange = async (messageId, newStatus) => {
    try {
      await api.put(`/contact/${messageId}/status`, { statut: newStatus });
      setAlert({ type: 'success', text: '✅ Statut mis à jour' });
      fetchMessages();
      setTimeout(() => setAlert({ type: '', text: '' }), 2000);
    } catch (error) {
      setAlert({ type: 'danger', text: 'Erreur lors de la mise à jour' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce message ?')) {
      try {
        await api.delete(`/contact/${id}`);
        setAlert({ type: 'success', text: '✅ Message supprimé' });
        fetchMessages();
      } catch (error) {
        setAlert({ type: 'danger', text: 'Erreur lors de la suppression' });
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const filteredMessages = messages.filter(msg => {
    if (filter === 'all') return true;
    return msg.statut === filter;
  });

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
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="fw-bold">✉️ Messages de Contact</h1>
          
          <Form.Select 
            style={{ width: '200px' }}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Tous les messages</option>
            <option value="non_lu">Non lus</option>
            <option value="lu">Lus</option>
            <option value="traite">Traités</option>
          </Form.Select>
        </div>

        {alert.text && (
          <Alert variant={alert.type} dismissible onClose={() => setAlert({ type: '', text: '' })}>
            {alert.text}
          </Alert>
        )}

        {filteredMessages.length === 0 ? (
          <div className="text-center py-5">
            <h3 className="text-muted">Aucun message</h3>
          </div>
        ) : (
          <div className="bg-white rounded shadow-sm">
            <Table responsive hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th>ID</th>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Sujet</th>
                  <th>Message</th>
                  <th>Date</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMessages.map((message) => (
                  <tr key={message.id} className={message.statut === 'non_lu' ? 'table-warning' : ''}>
                    <td className="fw-bold">#{message.id}</td>
                    <td>
                      <strong>{message.nom}</strong>
                      <br />
                      <small className="text-muted">{message.telephone || '-'}</small>
                    </td>
                    <td>
                      <small>{message.email}</small>
                    </td>
                    <td>
                      <strong>{message.sujet || '-'}</strong>
                    </td>
                    <td>
                      <small className="d-inline-block text-truncate" style={{ maxWidth: '200px' }}>
                        {message.message}
                      </small>
                    </td>
                    <td>
                      <small>{formatDate(message.created_at)}</small>
                    </td>
                    <td>{getStatusBadge(message.statut)}</td>
                    <td>
                      <Form.Select
                        size="sm"
                        value={message.statut}
                        onChange={(e) => handleStatusChange(message.id, e.target.value)}
                        style={{ width: '120px' }}
                        className="mb-2"
                      >
                        <option value="non_lu">Non lu</option>
                        <option value="lu">Lu</option>
                        <option value="traite">Traité</option>
                      </Form.Select>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDelete(message.id)}
                      >
                        🗑️
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Container>
    </div>
  );
};

export default MessagesManagement;