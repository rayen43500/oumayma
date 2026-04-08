const Settings = require('../models/Settings');

class SettingsController {
  static async getAllSettings(req, res) {
    try {
      const results = await Settings.findAll();
      const settings = {};
      results.forEach(row => {
        settings[row.setting_key] = row.setting_value;
      });
      res.json({ success: true, data: settings });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateSettings(req, res) {
    try {
      const settings = req.body;
      await Settings.update(settings);
      res.json({ success: true, message: 'Paramètres mis à jour' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async uploadLogo(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Aucun fichier uploadé' });
      }

      const logoUrl = `${req.protocol}://${req.get('host')}/uploads/products/${req.file.filename}`;

      // Sauvegarder l'URL du logo dans les paramètres
      await Settings.update({ site_logo: logoUrl });

      res.json({
        success: true,
        message: 'Logo uploadé et sauvegardé avec succès',
        logoUrl: logoUrl,
        filename: req.file.filename
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = SettingsController;