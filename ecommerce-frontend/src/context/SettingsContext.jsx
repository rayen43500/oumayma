import React, { createContext, useState, useContext, useEffect } from 'react';
import settingsService from '../services/settingsService';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings doit être utilisé dans SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    site_name: 'Rigoula',
    site_description: 'Votre partenaire pour des produits agricoles de qualité en Tunisie',
    contact_phone: '+216 71 234 567',
    contact_email: 'contact@rigoula.com',
    contact_address: 'Avenue Habib Bourguiba, Tunis 1000, Tunisie',
    hero_title: 'Bienvenue chez Rigoula',
    hero_subtitle: 'Des produits agricoles frais et de qualité, directement de nos fermes',
    about_title: 'À propos de Rigoula',
    about_description: 'Fondée en 2010, Rigoula est une entreprise familiale tunisienne.',
    presentation_image: '',
    timeline_2017: 'La naissance de RIGOULA',
    timeline_2021: 'Expansion et croissance',
    timeline_2022: 'Certification et excellence',
    timeline_2024: 'Récompenses nationales',
    timeline_today: 'Une gamme authentique',
    facebook_url: '#',
    twitter_url: '#',
    instagram_url: '#'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await settingsService.getSettings();
      setSettings(response.data.data || response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshSettings = async () => {
    await fetchSettings();
  };

  const value = {
    settings,
    loading,
    refreshSettings
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};