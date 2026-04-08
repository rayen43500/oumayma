import api from './api';

const settingsService = {
  // Récupérer tous les paramètres
  getSettings: async () => {
    const response = await api.get('/settings');
    return response.data;
  },

  // Mettre à jour les paramètres
  updateSettings: async (settings) => {
    const response = await api.put('/settings', settings);
    return response.data;
  }
};

export default settingsService;