// Carica le variabili d'ambiente dal file .env
require('dotenv').config();  

// Verifica che la variabile MONGO_URI sia correttamente caricata
console.log('MONGO_URI:', process.env.MONGO_URI);

// Importa le dipendenze
const express = require('express');
const connectDB = require('./config/db');  // Importa la funzione di connessione al DB
const swaggerUi = require('swagger-ui-express'); // Interfaccia Swagger
const swaggerSpecs = require('./config/swaggerDef.js'); // Configurazione Swagger

// Crea l'app Express
const app = express();

// Connessione al database MongoDB
connectDB();  // Funzione di connessione al DB

// Imposta Swagger per la documentazione delle API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Imposta una route di esempio
app.get('/', (req, res) => {
  res.send('Benvenuto nel chatbot dell\'università!');
});

// Configura la porta dal file .env o usa 3000 di default
const PORT = process.env.PORT || 3000;

// Avvia il server
app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});
