const mongoose = require('mongoose');
//require('dotenv').config({ path: '../../.env' });  // Per leggere il file .env

const connectDB = async () => {
  try {
    // Verifica se l'URI è definito
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      console.error('Errore: MONGO_URI non è definito nel file .env');
      process.exit(1); // Termina l'applicazione se l'URI non è definito
    }

    // Usa la stringa di connessione dal file .env
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB connesso: ${conn.connection.host}`);
  } catch (err) {
    console.error('Errore di connessione al DB:', err.message);
    process.exit(1); // Termina l'applicazione se la connessione fallisce
  }
};

module.exports = connectDB;
