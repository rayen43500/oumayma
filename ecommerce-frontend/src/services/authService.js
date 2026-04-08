import api from './api';

const authService = {
  // Inscription
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      // Améliorer la structure de l'erreur pour la cohérence
      if (error.response?.data?.message) {
        throw error;
      } else if (error.response?.data) {
        error.response.data.message = error.response.data.message || 'Erreur lors de l\'inscription';
        throw error;
      } else if (error.message) {
        error.response = { data: { message: error.message } };
        throw error;
      }
      throw error;
    }
  },

  // Connexion
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      // Améliorer la structure de l'erreur pour la cohérence
      if (error.response?.data?.message) {
        throw error;
      } else if (error.response?.data) {
        error.response.data.message = error.response.data.message || 'Erreur de connexion';
        throw error;
      } else if (error.message) {
        error.response = { data: { message: error.message } };
        throw error;
      }
      throw error;
    }
  },

  // Déconnexion
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Obtenir l'utilisateur connecté
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Vérifier si connecté
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Vérifier si admin
  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user && user.role === 'admin';
  }
};

export default authService;