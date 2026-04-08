const bcrypt = require('bcryptjs');

async function hashPassword(password) {
  const hashed = await bcrypt.hash(password, 10);
  console.log('Mot de passe:', password);
  console.log('Hash:', hashed);
  console.log('---');
}

// Hasher les mots de passe
hashPassword('password123');  // Pour l'admin
hashPassword('123456');       // Pour le client