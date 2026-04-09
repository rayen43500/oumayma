import React, { useEffect, useState } from 'react';
import { Container, Card, Form, Button, Alert, Tabs, Tab, Spinner } from 'react-bootstrap';
import api from '../services/api';
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

const SiteSettings = () => {
  const { refreshSettings } = useSettings();
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [presentationImagePreview, setPresentationImagePreview] = useState(null);
  const [presentationImageFile, setPresentationImageFile] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      console.log('🔄 Chargement des paramètres admin...');
      const response = await api.get('/settings');
      console.log('✅ Réponse reçue:', response.data);
      
      if (response.data.success) {
        setSettings(response.data.data || {});
      } else {
        setMessage({ 
          type: 'danger', 
          text: 'Erreur lors du chargement des paramètres' 
        });
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      setMessage({ 
        type: 'danger', 
        text: 'Erreur: ' + (error.response?.data?.message || error.message)
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, value) => {
    console.log('📝 Modification:', key, '=', value);
    setSettings({
      ...settings,
      [key]: value
    });
  };

  const handleLogoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      
      // Créer un aperçu du fichier
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePresentationImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPresentationImageFile(file);
      
      // Créer un aperçu du fichier
      const reader = new FileReader();
      reader.onloadend = () => {
        setPresentationImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadLogo = async () => {
    if (!logoFile) {
      setMessage({ type: 'warning', text: '⚠️ Veuillez sélectionner un fichier' });
      return;
    }

    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const formData = new FormData();
      formData.append('logo', logoFile);

      const response = await api.post('/upload/logo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setMessage({ type: 'success', text: '✅ Logo téléchargé avec succès !' });
        
        // Récupérer le chemin du logo depuis la réponse
        const logoPath = response.data.data?.logoPath || response.data.logoPath || response.data.logoUrl;
        
        if (logoPath) {
          setSettings({
            ...settings,
            site_logo: logoPath
          });
        }
        
        setLogoFile(null);
        setLogoPreview(null);
        await refreshSettings();
      } else {
        setMessage({ type: 'danger', text: response.data.message || 'Erreur lors du téléchargement' });
      }
    } catch (error) {
      console.error('❌ Erreur upload:', error);
      console.error('Response:', error.response?.data);
      setMessage({ type: 'danger', text: 'Erreur: ' + (error.response?.data?.message || error.message) });
    } finally {
      setSaving(false);
    }
  };

  const handleUploadPresentationImage = async () => {
    if (!presentationImageFile) {
      setMessage({ type: 'warning', text: '⚠️ Veuillez sélectionner un fichier' });
      return;
    }

    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const formData = new FormData();
      formData.append('image', presentationImageFile);

      const response = await api.post('/upload/presentation-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setMessage({ type: 'success', text: '✅ Image de présentation téléchargée avec succès !' });
        
        // Récupérer le chemin de l'image depuis la réponse
        const imagePath = response.data.data?.imagePath || response.data.imagePath;
        
        if (imagePath) {
          setSettings({
            ...settings,
            presentation_image: imagePath
          });
        }
        
        setPresentationImageFile(null);
        setPresentationImagePreview(null);
        await refreshSettings();
      } else {
        setMessage({ type: 'danger', text: response.data.message || 'Erreur lors du téléchargement' });
      }
    } catch (error) {
      console.error('❌ Erreur upload:', error);
      console.error('Response:', error.response?.data);
      setMessage({ type: 'danger', text: 'Erreur: ' + (error.response?.data?.message || error.message) });
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('💾 Tentative de sauvegarde...');
    console.log('📦 Données à envoyer:', settings);
    
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await api.put('/settings', settings);
      console.log('✅ Réponse serveur:', response.data);
      
      if (response.data.success) {
        setMessage({ type: 'success', text: '✅ Paramètres enregistrés avec succès !' });
        await refreshSettings();
        console.log('✅ Paramètres rafraîchis globalement');
      } else {
        setMessage({ 
          type: 'danger', 
          text: response.data.message || 'Erreur lors de la sauvegarde' 
        });
      }
    } catch (error) {
      console.error('❌ Erreur sauvegarde:', error);
      console.error('❌ Détails:', error.response?.data);
      setMessage({ 
        type: 'danger', 
        text: 'Erreur: ' + (error.response?.data?.message || error.message)
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="success" />
        <p className="mt-3">Chargement des paramètres...</p>
      </Container>
    );
  }

  return (
    <div className="py-5 bg-light">
      <Container>
        <h1 className="fw-bold mb-4">⚙️ Paramètres du Site</h1>

        {message.text && (
          <Alert 
            variant={message.type} 
            dismissible 
            onClose={() => setMessage({ type: '', text: '' })}
          >
            {message.text}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Tabs defaultActiveKey="general" className="mb-4">
            {/* Onglet Général */}
            <Tab eventKey="general" title="🏠 Général">
              <Card className="border-0 shadow-sm mb-4">
                <Card.Body className="p-4">
                  <h5 className="fw-bold mb-4">Informations générales</h5>
                  
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Nom du site</Form.Label>
                    <Form.Control
                      type="text"
                      value={settings.site_name || ''}
                      onChange={(e) => handleChange('site_name', e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Description du site</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={settings.site_description || ''}
                      onChange={(e) => handleChange('site_description', e.target.value)}
                    />
                  </Form.Group>

                  <div className="d-grid mt-3">
                    <Button
                      onClick={handleSubmit}
                      variant="success"
                      size="lg"
                      disabled={saving}
                      style={{ backgroundColor: '#10b981', borderColor: '#10b981' }}
                    >
                      {saving ? 'Enregistrement...' : '💾 Enregistrer Général'}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Tab>

            {/* Onglet Page d'accueil */}
            <Tab eventKey="home" title="🏡 Page d'accueil">
              <Card className="border-0 shadow-sm mb-4">
                <Card.Body className="p-4">
                  <h5 className="fw-bold mb-4">Section Hero</h5>
                  
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Titre principal</Form.Label>
                    <Form.Control
                      type="text"
                      value={settings.hero_title || ''}
                      onChange={(e) => handleChange('hero_title', e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Sous-titre</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={settings.hero_subtitle || ''}
                      onChange={(e) => handleChange('hero_subtitle', e.target.value)}
                    />
                  </Form.Group>

                  <div className="d-grid mt-3">
                    <Button
                      onClick={handleSubmit}
                      variant="success"
                      size="lg"
                      disabled={saving}
                      style={{ backgroundColor: '#10b981', borderColor: '#10b981' }}
                    >
                      {saving ? 'Enregistrement...' : '💾 Enregistrer Page d\'accueil'}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Tab>

            {/* Onglet Présentation */}
            <Tab eventKey="about" title="📄 Présentation">
              <Card className="border-0 shadow-sm mb-4">
                <Card.Body className="p-4">
                  <h5 className="fw-bold mb-4">Page À propos</h5>
                  
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Titre</Form.Label>
                    <Form.Control
                      type="text"
                      value={settings.about_title || ''}
                      onChange={(e) => handleChange('about_title', e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      value={settings.about_description || ''}
                      onChange={(e) => handleChange('about_description', e.target.value)}
                    />
                  </Form.Group>

                  <hr className="my-4" />

                  <h5 className="fw-bold mb-4">Photo de présentation</h5>

                  {/* Aperçu de l'image actuelle */}
                  {settings.presentation_image && !presentationImagePreview && (
                    <div className="text-center mb-4 p-4 bg-light rounded">
                      <p className="text-muted mb-2">Image actuelle :</p>
                      <img 
                        src={settings.presentation_image} 
                        alt="Présentation" 
                        style={{ maxWidth: '300px', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                    </div>
                  )}

                  {/* Aperçu du fichier sélectionné */}
                  {presentationImagePreview && (
                    <div className="text-center mb-4 p-4 bg-light rounded">
                      <p className="text-muted mb-2">Aperçu de la nouvelle image :</p>
                      <img 
                        src={presentationImagePreview} 
                        alt="Aperçu Présentation" 
                        style={{ maxWidth: '300px', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                    </div>
                  )}

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Sélectionner une image</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handlePresentationImageFileChange}
                    />
                    <Form.Text className="text-muted">
                      Format accepté : PNG, JPG, GIF (Max 5MB)
                    </Form.Text>
                  </Form.Group>

                  {presentationImageFile && (
                    <div className="d-grid mb-3">
                      <Button
                        onClick={handleUploadPresentationImage}
                        variant="success"
                        size="lg"
                        disabled={saving}
                        style={{ backgroundColor: '#10b981', borderColor: '#10b981' }}
                      >
                        {saving ? '⏳ Enregistrement...' : '💾 Enregistrer image'}
                      </Button>
                    </div>
                  )}

                  <div className="d-grid mt-3">
                    <Button
                      onClick={handleSubmit}
                      variant="success"
                      size="lg"
                      disabled={saving}
                      style={{ backgroundColor: '#10b981', borderColor: '#10b981' }}
                    >
                      {saving ? 'Enregistrement...' : '💾 Enregistrer Présentation'}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Tab>

            {/* Onglet Contact */}
            <Tab eventKey="contact" title="📞 Contact">
              <Card className="border-0 shadow-sm mb-4">
                <Card.Body className="p-4">
                  <h5 className="fw-bold mb-4">Informations de contact</h5>
                  
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Téléphone</Form.Label>
                    <Form.Control
                      type="text"
                      value={settings.contact_phone || ''}
                      onChange={(e) => handleChange('contact_phone', e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={settings.contact_email || ''}
                      onChange={(e) => handleChange('contact_email', e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Adresse</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={settings.contact_address || ''}
                      onChange={(e) => handleChange('contact_address', e.target.value)}
                    />
                  </Form.Group>

                  <div className="d-grid mt-3">
                    <Button
                      onClick={handleSubmit}
                      variant="success"
                      size="lg"
                      disabled={saving}
                      style={{ backgroundColor: '#10b981', borderColor: '#10b981' }}
                    >
                      {saving ? 'Enregistrement...' : '💾 Enregistrer Contact'}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Tab>

            {/* Onglet Réseaux sociaux */}
            <Tab eventKey="social" title="📱 Réseaux sociaux">
              <Card className="border-0 shadow-sm mb-4">
                <Card.Body className="p-4">
                  <h5 className="fw-bold mb-4">Liens des réseaux sociaux</h5>
                  
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Facebook</Form.Label>
                    <Form.Control
                      type="url"
                      value={settings.facebook_url || ''}
                      onChange={(e) => handleChange('facebook_url', e.target.value)}
                      placeholder="https://facebook.com/rigoula"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Instagram</Form.Label>
                    <Form.Control
                      type="url"
                      value={settings.instagram_url || ''}
                      onChange={(e) => handleChange('instagram_url', e.target.value)}
                      placeholder="https://instagram.com/rigoula"
                    />
                  </Form.Group>

                  <div className="d-grid mt-3">
                    <Button
                      onClick={handleSubmit}
                      variant="success"
                      size="lg"
                      disabled={saving}
                      style={{ backgroundColor: '#10b981', borderColor: '#10b981' }}
                    >
                      {saving ? 'Enregistrement...' : '💾 Enregistrer Réseaux sociaux'}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Tab>

            {/* Onglet Logo */}
            <Tab eventKey="logo" title="🎨 Logo">
              <Card className="border-0 shadow-sm mb-4">
                <Card.Body className="p-4">
                  <h5 className="fw-bold mb-4">Logo du site</h5>
                  
                  {/* Aperçu du logo actuel */}
                  {settings.site_logo && !logoPreview && (
                    <div className="text-center mb-4 p-4 bg-light rounded">
                      <p className="text-muted mb-2">Logo actuel :</p>
                      {settings.site_logo.startsWith('http') || settings.site_logo.includes('/uploads') ? (
                        <img 
                          src={resolveMediaUrl(settings.site_logo)} 
                          alt="Logo" 
                          style={{ maxWidth: '200px', maxHeight: '100px', objectFit: 'contain' }}
                        />
                      ) : (
                        <div style={{ fontSize: '4rem' }}>{settings.site_logo}</div>
                      )}
                    </div>
                  )}

                  {/* Aperçu du fichier sélectionné */}
                  {logoPreview && (
                    <div className="text-center mb-4 p-4 bg-light rounded">
                      <p className="text-muted mb-2">Aperçu du nouveau logo :</p>
                      <img 
                        src={logoPreview} 
                        alt="Aperçu Logo" 
                        style={{ maxWidth: '200px', maxHeight: '100px', objectFit: 'contain' }}
                      />
                    </div>
                  )}

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Sélectionner une image</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleLogoFileChange}
                    />
                    <Form.Text className="text-muted">
                      Format accepté : PNG, JPG, GIF, SVG (Max 5MB)
                    </Form.Text>
                  </Form.Group>

                  {logoFile && (
                    <div className="d-grid mb-3">
                      <Button
                        onClick={handleUploadLogo}
                        variant="success"
                        size="lg"
                        disabled={saving}
                        style={{ backgroundColor: '#10b981', borderColor: '#10b981' }}
                      >
                        {saving ? '⏳ Enregistrement...' : '💾 Enregistrer'}
                      </Button>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Tab>
          </Tabs>
        </Form>
      </Container>
    </div>
  );
};

export default SiteSettings;