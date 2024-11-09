// Importa le dipendenze
const express = require('express');
require('dotenv').config();  // Carica le variabili d'ambiente dal file .env

// Crea l'app Express
const app = express();

// Imposta una route di esempio
app.get('/', (req, res) => {
  res.send('Ciao, mondo!');
});

// Configura la porta dal file .env o usa 3000 di default
const PORT = process.env.PORT || 3000;

// Avvia il server
app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});
