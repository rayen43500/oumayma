import React, { useEffect, useState, useRef } from 'react';
import { Container, Table, Button, Modal, Form, Alert, Spinner, Row, Col } from 'react-bootstrap';
import api from '../services/api';

const CertificationsManagement = () => {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCert, setEditingCert] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    organisme: '',
    date_obtention: '',
    images: []
  });

  useEffect(() => {
    fetchCertifications();
  }, []);

  // Helper pour construire l'URL complète de l'image
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // Si c'est déjà une URL complète
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Si c'est juste un nom de fichier, ajouter le chemin
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    return `${baseUrl}/uploads/products/${imagePath}`;
  };

  // Helper pour parser les images (peut être JSON array, comma-separated, ou simple string)
  const parseImages = (imagesField) => {
    if (!imagesField) return [];
    
    try {
      // Si c'est un string, tenter de parser comme JSON
      if (typeof imagesField === 'string') {
        // Tester si c'est du JSON
        if (imagesField.startsWith('[')) {
          const parsed = JSON.parse(imagesField);
          return Array.isArray(parsed) ? parsed : [imagesField];
        }
        // Tester si c'est une liste séparée par des virgules (product-123.png,product-456.png)
        if (imagesField.includes(',')) {
          return imagesField.split(',').map(s => s.trim()).filter(s => s);
        }
        // Sinon c'est un nom de fichier simple
        return [imagesField];
      }
      // Si c'est déjà un array
      if (Array.isArray(imagesField)) {
        return imagesField;
      }
    } catch (e) {
      console.error('Erreur parsing images:', e.message);
      // En cas d'erreur, traiter comme simple string
      if (typeof imagesField === 'string') {
        // Essayer de splitter par virgule comme dernier recours
        if (imagesField.includes(',')) {
          return imagesField.split(',').map(s => s.trim()).filter(s => s);
        }
        return [imagesField];
      }
      return [];
    }
    
    return [];
  };

  const fetchCertifications = async () => {
    try {
      const response = await api.get('/certifications');
      console.log('API Response complète:', response.data);
      const data = response.data.data || response.data || [];
      const sortedData = Array.isArray(data) ? data : [];
      
      // DEBUG: Montrer chaque certification et ses images
      sortedData.forEach((cert, idx) => {
        console.log(`\n📋 Certification ${idx + 1}:`);
        console.log(`   ID: ${cert.id}`);
        console.log(`   Titre: ${cert.titre}`);
        console.log(`   Images field type:`, typeof cert.images);
        console.log(`   Images field value:`, cert.images);
        if (cert.images) {
          try {
            const parsed = typeof cert.images === 'string' ? JSON.parse(cert.images) : cert.images;
            console.log(`   Images parsed:`, parsed);
            console.log(`   Images count:`, Array.isArray(parsed) ? parsed.length : 'N/A');
          } catch (e) {
            console.log(`   ❌ Impossible de parser images: ${e.message}`);
          }
        }
      });
      
      console.log('Certifications chargées:', sortedData);
      console.log('IDs disponibles:', sortedData.map(c => c.id));
      setCertifications(sortedData);
    } catch (error) {
      console.error('Erreur:', error);
      setMessage({ type: 'danger', text: 'Erreur lors du chargement des certifications' });
      setCertifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (cert = null) => {
    console.log('🔵 handleShowModal appelé avec cert:', cert);
    console.log('🔵 cert.id:', cert?.id);
    
    // Reset TOUJOURS editingCert en premier
    setEditingCert(null);
    
    if (cert) {
      console.log('🟢 MODE ÉDITION - Cert ID:', cert.id);
      console.log('   📸 Raw images field:', cert.images);
      console.log('   📸 Type:', typeof cert.images);
      
      // Parser les images avec la fonction helper
      const parsedImages = parseImages(cert.images);
      console.log('   ✅ Images parsed:', parsedImages);
      console.log('   📊 Count:', parsedImages.length);
      
      // Construire les URLs complètes
      const imageUrls = parsedImages.map(img => getImageUrl(img));
      console.log('   🖼️ Image URLs:', imageUrls);
      
      // 🔧 IMPORTANT: Créer une copie de cert avec les images parsées et URLs
      const certWithParsedImages = { ...cert, images: imageUrls };
      
      setEditingCert(certWithParsedImages);
      setFormData({
        titre: cert.titre,
        description: cert.description || '',
        organisme: cert.organisme || '',
        date_obtention: cert.date_obtention?.split('T')[0] || '',
        images: parsedImages // Garder les noms pour upload
      });
    } else {
      console.log('🟡 MODE CRÉATION - Nouveau formulaire');
      setFormData({
        titre: '',
        description: '',
        organisme: '',
        date_obtention: '',
        images: []
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    console.log('❌ Fermeture du modal');
    setShowModal(false);
    setEditingCert(null);
    setFormData({
      titre: '',
      description: '',
      organisme: '',
      date_obtention: '',
      images: []
    });
    // Réinitialiser le file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Validation
    if (!formData.titre.trim()) {
      setMessage({ type: 'danger', text: 'Le titre est requis' });
      return;
    }

    try {
      const data = new FormData();
      data.append('titre', formData.titre);
      data.append('description', formData.description);
      data.append('organisme', formData.organisme);
      data.append('date_obtention', formData.date_obtention);
      
      // Séparer les images existantes des nouveaux fichiers
      const existingImages = [];
      const newFiles = [];
      
      if (formData.images && formData.images.length > 0) {
        formData.images.forEach((img) => {
          if (img instanceof File) {
            newFiles.push(img);
          } else if (typeof img === 'string') {
            existingImages.push(img);
          }
        });
      }
      
      console.log(`♻️ ${existingImages.length} image(s) existante(s) - seront conservées`);
      console.log(`📤 ${newFiles.length} nouveau(x) fichier(s) à ajouter:`, newFiles.map(f => f.name));
      
      // Envoyer la liste COMPLÈTE des images existantes à conserver (après suppressions)
      if (existingImages.length > 0 || newFiles.length > 0) {
        // Envoyer les images à conserver comme JSON
        data.append('imagesToKeep', JSON.stringify(existingImages));
        console.log('📝 imagesToKeep envoyées:', existingImages);
      }
      
      // Envoyer les nouveaux fichiers
      if (newFiles.length > 0) {
        newFiles.forEach((file) => {
          data.append('images', file);
        });
      }

      console.log('FormData à envoyer:', {
        titre: formData.titre,
        description: formData.description,
        organisme: formData.organisme,
        date_obtention: formData.date_obtention,
        imagesToKeep: existingImages,
        newFilesCount: newFiles.length
      });
      
      // DEBUG: Afficher exactement ce qui est dans FormData
      console.log('📦 Contenu complet de FormData:');
      for (let [key, value] of data.entries()) {
        if (key === 'images') {
          console.log(`  ✅ ${key}: File - ${value.name} (${value.size} bytes)`);
        } else {
          console.log(`  ${key}: ${value}`);
        }
      }

      if (editingCert) {
        console.log('🔧 MODIFIER Certification ID:', editingCert.id);
        await api.put(`/certifications/${editingCert.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setMessage({ type: 'success', text: '✅ Certification modifiée avec succès' });
      } else {
        console.log('🆕 CRÉER nouvelle certification');
        await api.post('/certifications', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setMessage({ type: 'success', text: '✅ Certification ajoutée avec succès' });
      }

      // Réinitialiser le file input après un submit réussi
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      fetchCertifications();
      setTimeout(() => handleCloseModal(), 500);
    } catch (error) {
      console.error('Erreur complète:', error.response?.data);
      const errorMsg = error.response?.data?.message || error.response?.statusText || 'Erreur lors de l\'enregistrement';
      setMessage({
        type: 'danger',
        text: `❌ ${errorMsg}`
      });
      console.log('Status:', error.response?.status);
      console.log('Data:', error.response?.data);
      // Fermer après 3 secondes en cas d'erreur aussi
      setTimeout(() => {
        setEditingCert(null);
        setShowModal(false);
      }, 3000);
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    // Mettre à jour formData
    const updatedImages = formData.images.filter((_, idx) => idx !== indexToRemove);
    setFormData({
      ...formData,
      images: updatedImages
    });
    
    // Aussi mettre à jour editingCert si en mode édition
    if (editingCert && editingCert.images) {
      const updatedEditingImages = editingCert.images.filter((_, idx) => idx !== indexToRemove);
      setEditingCert({
        ...editingCert,
        images: updatedEditingImages
      });
    }
    
    console.log(`🗑️ Image supprimée (index ${indexToRemove}). ${updatedImages.length} image(s) restante(s)`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette certification ?')) {
      try {
        await api.delete(`/certifications/${id}`);
        setMessage({ type: 'success', text: '✅ Certification supprimée' });
        fetchCertifications();
      } catch (error) {
        setMessage({ type: 'danger', text: 'Erreur lors de la suppression' });
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
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
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="fw-bold">🏆 Gestion des Certifications</h1>
          <Button 
            variant="success" 
            onClick={() => handleShowModal()}
            style={{ backgroundColor: '#10b981', borderColor: '#10b981' }}
          >
            + Ajouter une certification
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
                <th>Organisme</th>
                <th>Date d'obtention</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {certifications.map((cert) => (
                <tr key={cert.id}>
                  <td>{cert.id}</td>
                  <td><strong>{cert.titre}</strong></td>
                  <td>{cert.organisme || '-'}</td>
                  <td>{formatDate(cert.date_obtention)}</td>
                  <td>
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      className="me-2"
                      onClick={() => handleShowModal(cert)}
                    >
                      ✏️
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleDelete(cert.id)}
                    >
                      🗑️
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {/* Modal */}
        <Modal show={showModal} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              {editingCert ? 'Modifier la certification' : 'Ajouter une certification'}
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
                    <Form.Label>Organisme</Form.Label>
                    <Form.Control
                      type="text"
                      name="organisme"
                      value={formData.organisme}
                      onChange={handleChange}
                      placeholder="Bureau Veritas"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Date d'obtention</Form.Label>
                    <Form.Control
                      type="date"
                      name="date_obtention"
                      value={formData.date_obtention}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Images</Form.Label>
                <Form.Control
                  ref={fileInputRef}
                  type="file"
                  name="images"
                  multiple
                  onChange={(e) => {
                    const newFiles = Array.from(e.target.files || []);
                    console.log(`📁 ${newFiles.length} nouveau(x) fichier(s) sélectionné(s):`, newFiles.map(f => f.name));
                    
                    // Déduplication: éviter d'ajouter des fichiers en double
                    const existingFileNames = new Set(
                      formData.images
                        .filter(img => img instanceof File)
                        .map(img => img.name + img.size)
                    );
                    
                    const uniqueNewFiles = newFiles.filter(file => {
                      const key = file.name + file.size;
                      if (existingFileNames.has(key)) {
                        console.log(`⏭️ Fichier dupliqué ignoré: ${file.name}`);
                        return false;
                      }
                      return true;
                    });
                    
                    // Ajouter les nouveaux fichiers (pas remplacer!) - maximum 10 images
                    const MAX_IMAGES = 10;
                    let updatedImages = [...formData.images, ...uniqueNewFiles];
                    
                    if (updatedImages.length > MAX_IMAGES) {
                      const excessCount = updatedImages.length - MAX_IMAGES;
                      updatedImages = updatedImages.slice(0, MAX_IMAGES);
                      setMessage({ type: 'warning', text: `⚠️ Limite de ${MAX_IMAGES} images atteinte. ${excessCount} fichier(s) rejeté(s).` });
                      console.log(`⚠️ Limite de ${MAX_IMAGES} images atteinte. ${excessCount} fichier(s) au-delà ont été rejetés.`);
                    }
                    
                    console.log(`✅ ${updatedImages.length} image(s) au total`);
                    setFormData({
                      ...formData,
                      images: updatedImages
                    });
                  }}
                  accept="image/*"
                />
                <Form.Text className="text-muted">
                  Sélectionnez jusqu'à 10 images
                  {formData.images && formData.images.length > 0 && (
                    <div style={{ color: '#10b981', fontWeight: 'bold', marginTop: '5px' }}>
                      ✅ {formData.images.length}/10 image(s) sélectionnée(s)
                    </div>
                  )}
                </Form.Text>

                {/* Afficher les aperçus des images */}
                {(() => {
                  // Collecter TOUTES les images à afficher (existantes + nouvelles)
                  let previewImages = [];
                  const seenUrls = new Set(); // Pour éviter les doublons
                  
                  // 1. Images existantes (si en édition) - juste des noms de fichiers
                  if (editingCert && editingCert.images) {
                    editingCert.images.forEach(img => {
                      if (typeof img === 'string' && !img.startsWith('blob:')) {
                        // C'est un nom de fichier ou URL - pas un blob URL
                        if (!seenUrls.has(img)) {
                          previewImages.push({
                            url: getImageUrl(img),
                            name: img,
                            isNew: false
                          });
                          seenUrls.add(img);
                        }
                      }
                    });
                  }
                  
                  // 2. Nouvelles images sélectionnées (File objects uniquement)
                  if (formData.images && formData.images.length > 0) {
                    formData.images.forEach(img => {
                      if (img instanceof File) {
                        const blobUrl = URL.createObjectURL(img);
                        if (!seenUrls.has(blobUrl)) {
                          previewImages.push({
                            url: blobUrl,
                            name: img.name,
                            isNew: true
                          });
                          seenUrls.add(blobUrl);
                        }
                      }
                    });
                  }
                  
                  // Si pas d'images
                  if (previewImages.length === 0) {
                    return null; // Ne pas afficher la section
                  }
                  
                  // Afficher les images
                  return (
                    <div className="mt-3" style={{ padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                      <p><strong>📸 Aperçu des images ({previewImages.length}):</strong></p>
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {previewImages.map((img, idx) => {
                          const imageUrl = typeof img === 'string' ? img : img.url;
                          const isNew = typeof img === 'object' && img.isNew;
                          
                          return (
                            <div key={idx} style={{ position: 'relative' }}>
                              <img 
                                src={imageUrl} 
                                alt={`Preview-${idx}`}
                                style={{ 
                                  width: '120px', 
                                  height: '120px',
                                  borderRadius: '8px',
                                  border: isNew ? '2px solid #10b981' : '1px solid #ddd',
                                  objectFit: 'cover'
                                }}
                                onError={(e) => {
                                  console.error('❌ Erreur chargement image:', imageUrl);
                                  e.target.style.backgroundColor = '#ff6b6b';
                                }}
                                onLoad={() => {
                                  if (isNew) console.log('✅ Preview nouvelle image:', imageUrl);
                                }}
                              />
                              {isNew && (
                                <div style={{
                                  position: 'absolute',
                                  top: '-8px',
                                  right: '-8px',
                                  backgroundColor: '#10b981',
                                  color: 'white',
                                  borderRadius: '50%',
                                  width: '24px',
                                  height: '24px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '12px',
                                  fontWeight: 'bold'
                                }}>
                                  ✓
                                </div>
                              )}
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(idx)}
                                style={{
                                  position: 'absolute',
                                  bottom: '0px',
                                  right: '0px',
                                  backgroundColor: '#ff4757',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '50%',
                                  width: '28px',
                                  height: '28px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '14px',
                                  fontWeight: 'bold',
                                  padding: '0',
                                  transition: 'background-color 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#ff3838'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = '#ff4757'}
                                title="Supprimer cette image"
                              >
                                ✕
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </Form.Group>

              <div className="d-grid gap-2">
                <Button 
                  type="submit" 
                  variant="success"
                  style={{ backgroundColor: '#10b981', borderColor: '#10b981' }}
                >
                  {editingCert ? 'Enregistrer' : 'Ajouter'}
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

export default CertificationsManagement;