import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Modal, Form, Alert, Spinner, Badge, Row, Col } from 'react-bootstrap';
import api from '../services/api';

const EventsManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    date_evenement: '',
    lieu: '',
    image: ''
  });
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/evenements');
      setEvents(response.data.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (event = null) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        titre: event.titre,
        description: event.description || '',
        date_evenement: event.date_evenement?.split('T')[0] || '',
        lieu: event.lieu || '',
        image: event.image || ''
      });
      setImagePreview(event.image || '');
    } else {
      setEditingEvent(null);
      setFormData({
        titre: '',
        description: '',
        date_evenement: '',
        lieu: '',
        image: ''
      });
      setImagePreview('');
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEvent(null);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files && files[0]) {
      setFormData({
        ...formData,
        [name]: files[0]
      });
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          data.append(key, formData[key]);
        }
      });

      if (editingEvent) {
        await api.put(`/evenements/${editingEvent.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setMessage({ type: 'success', text: '✅ Événement modifié avec succès' });
      } else {
        await api.post('/evenements', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setMessage({ type: 'success', text: '✅ Événement ajouté avec succès' });
      }

      fetchEvents();
      handleCloseModal();
    } catch (error) {
      setMessage({
        type: 'danger',
        text: error.response?.data?.message || 'Erreur lors de l\'opération'
      });
    }
  };


  const handleDelete = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer cet événement ?')) {
      try {
        await api.delete(`/evenements/${id}`);
        setMessage({ type: 'success', text: '✅ Événement supprimé' });
        fetchEvents();
      } catch (error) {
        setMessage({ type: 'danger', text: 'Erreur lors de la suppression' });
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const isUpcoming = (dateString) => {
    return new Date(dateString) >= new Date();
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
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="fw-bold">📅 Gestion des Événements</h1>
          <Button 
            variant="success" 
            onClick={() => handleShowModal()}
            style={{ backgroundColor: '#10b981', borderColor: '#10b981' }}
          >
            + Ajouter un événement
          </Button>
        </div>

        {message.text && (
          <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', text: '' })}>
            {message.text}
          </Alert>
        )}

        <div className="bg-white rounded shadow-sm">
          <Table responsive hover className="mb-0">
            <thead className="bg-light">
              <tr>
                <th>ID</th>
                <th>Titre</th>
                <th>Date</th>
                <th>Lieu</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id}>
                  <td>{event.id}</td>
                  <td><strong>{event.titre}</strong></td>
                  <td>{formatDate(event.date_evenement)}</td>
                  <td>{event.lieu || '-'}</td>
                  <td>
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      className="me-2"
                      onClick={() => handleShowModal(event)}
                    >
                      ✏️
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleDelete(event.id)}
                    >
                      🗑️
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {/* Modal Ajouter/Modifier */}
        <Modal show={showModal} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              {editingEvent ? 'Modifier l\'événement' : 'Ajouter un événement'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Titre *</Form.Label>
                <Form.Control
                  type="text"
                  name="titre"
                  value={formData.titre}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Date de l'événement *</Form.Label>
                    <Form.Control
                      type="date"
                      name="date_evenement"
                      value={formData.date_evenement}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Lieu</Form.Label>
                    <Form.Control
                      type="text"
                      name="lieu"
                      value={formData.lieu}
                      onChange={handleChange}
                      placeholder="Tunis, Tunisie"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type="file"
                  name="image"
                  onChange={handleChange}
                  accept="image/*"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Aperçu"
                      style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
                      className="img-thumbnail"
                    />
                  </div>
                )}
              </Form.Group>

              <div className="d-grid gap-2">
                <Button 
                  type="submit" 
                  variant="success"
                  style={{ backgroundColor: '#10b981', borderColor: '#10b981' }}
                >
                  {editingEvent ? 'Enregistrer' : 'Ajouter'}
                </Button>
                <Button variant="secondary" onClick={handleCloseModal}>
                  Annuler
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
};

export default EventsManagement;