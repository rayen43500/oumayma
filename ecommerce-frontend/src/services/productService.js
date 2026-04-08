import api from './api';

const productService = {
  // Récupérer tous les produits
  getAllProducts: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/produits?${params}`);
    return response.data;
  },

  // Récupérer un produit par ID
  getProductById: async (id) => {
    const response = await api.get(`/produits/${id}`);
    return response.data;
  },

  // Ajouter un produit (Admin)
  addProduct: async (productData) => {
    const response = await api.post('/produits', productData);
    return response.data;
  },

  // Modifier un produit (Admin)
  updateProduct: async (id, productData) => {
    const response = await api.put(`/produits/${id}`, productData);
    return response.data;
  },

  // Supprimer un produit (Admin)
  deleteProduct: async (id) => {
    const response = await api.delete(`/produits/${id}`);
    return response.data;
  }
};

export default productService;