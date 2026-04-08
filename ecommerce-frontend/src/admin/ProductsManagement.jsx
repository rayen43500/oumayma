import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Modal, Form, Alert, Spinner, Badge, Image } from 'react-bootstrap';
import productService from '../services/productService';
import api from '../services/api';

const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    prix: '',
    stock: '',
    category_id: '',
    image: ''
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productService.getAllProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleShowModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        nom: product.nom,
        description: product.description,
        prix: product.prix,
        stock: product.stock,
        category_id: product.category_id || '',
        image: product.image || ''
      });
      setImagePreview(product.image);
    } else {
      setEditingProduct(null);
      setFormData({
        nom: '',
        description: '',
        prix: '',
        stock: '',
        category_id: '',
        image: ''
      });
      setImagePreview(null);
    }
    setImageFile(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Créer un aperçu de l'image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return formData.image;

    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append('image', imageFile);

    try {
      const response = await api.post('/upload/product', formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data.imageUrl;
    } catch (error) {
      throw new Error('Erreur lors de l\'upload de l\'image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      // Upload de l'image si une nouvelle image est sélectionnée
      const imageUrl = await uploadImage();
      const productData = { ...formData, image: imageUrl };

      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, productData);
        setMessage({ type: 'success', text: '✅ Produit modifié avec succès' });
      } else {
        await productService.addProduct(productData);
        setMessage({ type: 'success', text: '✅ Produit ajouté avec succès' });
      }
      
      fetchProducts();
      handleCloseModal();
    } catch (error) {
      setMessage({ 
        type: 'danger', 
        text: error.message || 'Erreur lors de l\'opération' 
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce produit ?')) {
      try {
        await productService.deleteProduct(id);
        setMessage({ type: 'success', text: '✅ Produit supprimé' });
        fetchProducts();
      } catch (error) {
        setMessage({ type: 'danger', text: 'Erreur lors de la suppression' });
      }
    }
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
          <h1 className="fw-bold">📦 Gestion des Produits</h1>
          <Button 
            variant="success" 
            onClick={() => handleShowModal()}
            style={{ backgroundColor: '#10b981', borderColor: '#10b981' }}
          >
            + Ajouter un produit
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
                <th>Image</th>
                <th>Nom</th>
                <th>Catégorie</th>
                <th>Prix</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    {product.image ? (
                      <Image 
                        src={product.image} 
                        alt={product.nom}
                        rounded
                        style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                      />
                    ) : (
                      <div
                        className="bg-light rounded d-flex align-items-center justify-content-center"
                        style={{ width: '60px', height: '60px' }}
                      >
                        <img src="/rigoula_logo.png" alt="Rigoula" style={{ width: '50px', height: '50px' }} />
                      </div>
                    )}
                  </td>
                  <td>
                    <strong>{product.nom}</strong>
                  </td>
                  <td>
                    <Badge bg="secondary">{product.categorie_nom}</Badge>
                  </td>
                  <td className="fw-bold">{product.prix} TND</td>
                  <td>
                    <Badge bg={product.stock > 0 ? 'success' : 'danger'}>
                      {product.stock}
                    </Badge>
                  </td>
                  <td>
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      className="me-2"
                      onClick={() => handleShowModal(product)}
                    >
                      ✏️
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleDelete(product.id)}
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
              {editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              {/* Aperçu de l'image */}
              {imagePreview && (
                <div className="text-center mb-3">
                  <Image 
                    src={imagePreview} 
                    alt="Aperçu"
                    rounded
                    style={{ maxWidth: '200px', maxHeight: '200px' }}
                  />
                </div>
              )}

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Image du produit</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <Form.Text className="text-muted">
                  Formats acceptés: JPG, PNG, GIF, WEBP (Max 5MB)
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Nom du produit *</Form.Label>
                <Form.Control
                  type="text"
                  name="nom"
                  value={formData.nom}
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

              <Form.Group className="mb-3">
                <Form.Label>Catégorie *</Form.Label>
                <Form.Select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Sélectionnez une catégorie</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nom}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <div className="row">
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Prix (TND) *</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      name="prix"
                      value={formData.prix}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Stock *</Form.Label>
                    <Form.Control
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </div>
              </div>

              <div className="d-grid gap-2">
                <Button 
                  type="submit" 
                  variant="success"
                  disabled={uploading}
                  style={{ backgroundColor: '#10b981', borderColor: '#10b981' }}
                >
                  {uploading ? 'Upload en cours...' : editingProduct ? 'Enregistrer' : 'Ajouter'}
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

export default ProductsManagement;