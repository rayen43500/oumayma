import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Badge, Tabs, Tab, Button, Modal } from 'react-bootstrap';
import api from '../services/api';

const API_BASE_URL = 'http://localhost:5000';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [eventsRes, certsRes] = await Promise.all([
        api.get('/evenements'),
        api.get('/certifications')
      ]);
      
      console.log('📋 Certifications reçues:', certsRes.data);
      certsRes.data.data.forEach((cert, idx) => {
        console.log(`\n🏆 Certification ${idx + 1}:`);
        console.log('   ID:', cert.id);
        console.log('   Titre:', cert.titre);
        console.log('   Images field:', cert.images);
        console.log('   Type:', typeof cert.images);
      });
      
      setEvents(eventsRes.data.data);
      setCertifications(certsRes.data.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const isUpcoming = (dateString) => {
    return new Date(dateString) >= new Date();
  };

  const handleViewImage = (item) => {
    setSelectedCert(item);
    setCurrentImageIndex(0);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCert(null);
    setCurrentImageIndex(0);
  };

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleNextImage = (totalImages) => {
    if (currentImageIndex < totalImages - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="success" />
        <p className="mt-3 text-muted">Chargement...</p>
      </Container>
    );
  }

  return (
    <div className="py-5" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #e8f5e9 100%)' }}>
      <Container>
        {/* En-tête */}
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold mb-3" style={{ color: '#10b981' }}>
             Événements & Certifications
          </h1>
          <p className="lead text-muted">
            Découvrez nos événements à venir et nos certifications de qualité
          </p>
        </div>

        <Tabs defaultActiveKey="events" className="mb-4 nav-justified">
          {/* ONGLET ÉVÉNEMENTS */}
          <Tab 
            eventKey="events" 
            title={
              <span className="fw-bold">
                📅 Événements ({events.length})
              </span>
            }
          >
            <div className="py-4">
              {events.length === 0 ? (
                <Card className="text-center py-5 border-0 shadow-sm">
                  <Card.Body>
                    <div className="display-1 mb-3">📭</div>
                    <h3 className="text-muted">Aucun événement pour le moment</h3>
                    <p className="text-muted">Revenez bientôt pour découvrir nos prochains événements !</p>
                  </Card.Body>
                </Card>
              ) : (
                <Row>
                  {events.map((event) => (
                    <Col key={event.id} md={6} lg={4} className="mb-4">
                      <Card className="h-100 border-0 shadow-sm hover-lift" style={{ transition: 'transform 0.3s, box-shadow 0.3s' }}>
                        {/* Image de l'événement */}
                        <div
                          style={{
                            height: '220px',
                            background: event.image
                              ? `url(${API_BASE_URL}/uploads/products/${event.image}) center/cover`
                              : 'linear-gradient(135deg, #10b981 0%, #16a34a 100%)',
                            position: 'relative',
                            borderRadius: '0.375rem 0.375rem 0 0'
                          }}
                        >
                          {!event.image && (
                            <div className="d-flex align-items-center justify-content-center h-100">
                              <span style={{ fontSize: '5rem' }}>📅</span>
                            </div>
                          )}
                          
                          {/* Badge Statut */}
                          <div style={{ position: 'absolute', top: '15px', right: '15px' }}>
                            {isUpcoming(event.date_evenement) ? (
                              <Badge bg="success" className="px-3 py-2">
                                <span className="fw-bold">✨ À venir</span>
                              </Badge>
                            ) : (
                              <Badge bg="secondary" className="px-3 py-2">
                                <span className="fw-bold">📌 Terminé</span>
                              </Badge>
                            )}
                          </div>
                        </div>

                        <Card.Body className="d-flex flex-column">
                          {/* Date */}
                          <div className="mb-3">
                            <Badge 
                              style={{ backgroundColor: '#fbbf24', color: '#000' }} 
                              className="px-3 py-2"
                            >
                              📆 {formatDate(event.date_evenement)}
                            </Badge>
                          </div>

                          {/* Titre */}
                          <Card.Title className="fw-bold mb-3" style={{ color: '#10b981' }}>
                            {event.titre}
                          </Card.Title>

                          {/* Description */}
                          <Card.Text className="text-muted flex-grow-1 mb-3">
                            {event.description}
                          </Card.Text>

                          {/* Lieu */}
                          {event.lieu && (
                            <div className="d-flex align-items-center text-muted">
                              <span className="me-2">📍</span>
                              <small>{event.lieu}</small>
                            </div>
                          )}
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </div>
          </Tab>

          {/* ONGLET CERTIFICATIONS */}
          <Tab 
            eventKey="certifications" 
            title={
              <span className="fw-bold">
                🏆 Certifications ({certifications.length})
              </span>
            }
          >
            <div className="py-4">
              {/* En-tête section certifications */}
              <div className="text-center mb-5">
                <h2 className="fw-bold mb-3" style={{ color: '#10b981' }}>
                  Nos Certifications de Qualité
                </h2>
                <p className="lead text-muted">
                  Rigoula est fière de ses certifications qui garantissent la qualité de nos produits
                </p>
              </div>

              {certifications.length === 0 ? (
                <Card className="text-center py-5 border-0 shadow-sm">
                  <Card.Body>
                    <div className="display-1 mb-3">🏅</div>
                    <h3 className="text-muted">Aucune certification pour le moment</h3>
                  </Card.Body>
                </Card>
              ) : (
                <Row>
                  {certifications.map((cert) => {
                    // Parser les images
                    let imagesList = [];
                    if (cert.images) {
                      if (typeof cert.images === 'string') {
                        try {
                          imagesList = cert.images.startsWith('[') ? JSON.parse(cert.images) : [cert.images];
                        } catch (e) {
                          imagesList = [cert.images];
                        }
                      } else if (Array.isArray(cert.images)) {
                        imagesList = cert.images;
                      }
                    }
                    const firstImage = imagesList.length > 0 ? imagesList[0] : null;
                    const imageUrl = firstImage && !firstImage.startsWith('http')
                      ? `${API_BASE_URL}/uploads/products/${firstImage}`
                      : firstImage;
                    
                    return (
                      <Col key={cert.id} md={6} lg={4} className="mb-4">
                        <div style={{
                          border: '1px solid #e5e5e5',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                          height: '100%',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                          transition: 'all 0.3s ease'
                        }}>
                          {/* Titre centré en haut */}
                          <div style={{
                            padding: '16px 12px',
                            backgroundColor: '#f8f9fa',
                            borderBottom: '2px solid #10b981',
                            textAlign: 'center'
                          }}>
                            <h6 style={{
                              margin: 0,
                              fontSize: '15px',
                              fontWeight: '600',
                              color: '#1f2937',
                              letterSpacing: '0.5px',
                              textTransform: 'uppercase',
                              lineHeight: '1.4'
                            }}>
                              {cert.titre}
                            </h6>
                          </div>

                          {/* Image au centre */}
                          <div style={{
                            flex: 1,
                            minHeight: '220px',
                            position: 'relative',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#f8f9fa'
                          }}>
                            {imageUrl ? (
                              <>
                                <img 
                                  src={imageUrl}
                                  alt={cert.titre}
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain',
                                    objectPosition: 'center'
                                  }}
                                />
                                <Button 
                                  onClick={() => handleViewImage(cert)}
                                  style={{
                                    position: 'absolute',
                                    bottom: '12px',
                                    right: '12px',
                                    backgroundColor: 'rgba(107, 114, 128, 0.7)',
                                    border: 'none',
                                    color: 'white',
                                    padding: '8px 16px',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  APERÇU
                                </Button>
                              </>
                            ) : (
                              <div className="d-flex align-items-center justify-content-center" style={{ width: '100%', height: '100%' }}>
                                <div style={{ textAlign: 'center' }}>
                                  <div style={{ fontSize: '3.5rem', marginBottom: '8px' }}>🏆</div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Organisme et Date en bas */}
                          <div style={{
                            padding: '12px 16px',
                            backgroundColor: '#ffffff',
                            borderTop: '1px solid #e5e5e5'
                          }}>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between', alignItems: 'center' }}>
                              {cert.organisme && (
                                <p style={{
                                  flex: 1,
                                  fontSize: '13px',
                                  fontWeight: '500',
                                  color: '#4b5563',
                                  margin: 0
                                }}>
                                  {cert.organisme}
                                </p>
                              )}
                              {cert.date_obtention && (
                                <p style={{
                                  fontSize: '12px',
                                  color: '#9ca3af',
                                  margin: 0,
                                  whiteSpace: 'nowrap'
                                }}>
                                  {formatDate(cert.date_obtention)}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </Col>
                    );
                  })}
                </Row>
              )}
            </div>
          </Tab>
        </Tabs>

        {/* Section de confiance */}
        <div className="mt-5">
          <Card className="border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #10b981 0%, #16a34a 100%)' }}>
            <Card.Body className="p-5 text-center text-white">
              <h3 className="fw-bold mb-3">Rigoula, Votre Partenaire de Confiance</h3>
              <p className="lead mb-0">
                Nos certifications et événements témoignent de notre engagement envers la qualité et la transparence
              </p>
            </Card.Body>
          </Card>
        </div>
      </Container>

      {/* Modal pour aperçu des certifications */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        size="lg"
        centered
      >
        <Modal.Header closeButton style={{ borderBottom: '2px solid #10b981' }}>
          <Modal.Title style={{ 
            width: '100%', 
            textAlign: 'center',
            fontSize: '15px',
            fontWeight: '600',
            color: '#1f2937',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            lineHeight: '1.4'
          }}>
            {selectedCert?.titre}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCert?.images && (
            <div>
              {(() => {
                // Parser les images si c'est un string
                let imagesList = [];
                if (typeof selectedCert.images === 'string') {
                  try {
                    imagesList = selectedCert.images.startsWith('[') ? JSON.parse(selectedCert.images) : [selectedCert.images];
                  } catch (e) {
                    imagesList = [selectedCert.images];
                  }
                } else if (Array.isArray(selectedCert.images)) {
                  imagesList = selectedCert.images;
                }
                
                if (imagesList.length === 0) return null;
                
                const currentImg = imagesList[currentImageIndex];
                const imgUrl = currentImg.startsWith('http') ? currentImg : `${API_BASE_URL}/uploads/products/${currentImg}`;
                
                return (
                  <div>
                    {/* Carrousel */}
                    <div style={{ 
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '15px',
                      marginBottom: '20px'
                    }}>
                      {/* Flèche gauche */}
                      <button
                        onClick={handlePrevImage}
                        disabled={currentImageIndex === 0}
                        style={{
                          background: currentImageIndex === 0 ? '#ccc' : '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '40px',
                          height: '40px',
                          cursor: currentImageIndex === 0 ? 'not-allowed' : 'pointer',
                          fontSize: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        ◀
                      </button>

                      {/* Image */}
                      <img 
                        src={imgUrl} 
                        alt={`${selectedCert.titre}-${currentImageIndex}`}
                        style={{ 
                          maxWidth: '100%',
                          maxHeight: '400px',
                          borderRadius: '8px',
                          objectFit: 'contain'
                        }}
                      />

                      {/* Flèche droite */}
                      <button
                        onClick={() => handleNextImage(imagesList.length)}
                        disabled={currentImageIndex === imagesList.length - 1}
                        style={{
                          background: currentImageIndex === imagesList.length - 1 ? '#ccc' : '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '40px',
                          height: '40px',
                          cursor: currentImageIndex === imagesList.length - 1 ? 'not-allowed' : 'pointer',
                          fontSize: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        ▶
                      </button>
                    </div>

                    {/* Indicateur */}
                    <div style={{ 
                      textAlign: 'center',
                      color: '#666',
                      fontSize: '14px',
                      marginBottom: '20px'
                    }}>
                      Image {currentImageIndex + 1} sur {imagesList.length}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Informations détaillées - Design professionnel */}
          <div style={{ marginTop: '25px', borderTop: '1px solid #e5e5e5', paddingTop: '20px' }}>
            {/* Organisme et Date sur la même ligne */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between', marginBottom: '12px' }}>
              {selectedCert?.organisme && (
                <p style={{ color: '#666', fontSize: '15px', marginBottom: 0 }}>
                  <strong>{selectedCert.organisme}</strong>
                </p>
              )}

              {selectedCert?.date_obtention && (
                <p style={{ color: '#999', fontSize: '14px', marginBottom: 0, textAlign: 'right' }}>
                  {new Date(selectedCert.date_obtention).toLocaleDateString('fr-FR', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* CSS pour l'effet hover */}
      <style>{`
        .hover-lift:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.15) !important;
        }
      `}</style>
    </div>
  );
};

export default Events;