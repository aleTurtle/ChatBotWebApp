require('dotenv').config({ path: '../.env' });  // Carica le variabili d'ambiente dal file .env


// Verifica se MONGO_URI è stata correttamente caricata
console.log('MONGO_URI:', process.env.MONGO_URI);  // Aggiungi questa riga per vedere se la variabile è caricata

// Importa le dipendenze
const express = require('express');
const connectDB = require('./config/db.js'); // Importa la funzione di connessione
const swaggerUi = require('swagger-ui-express'); // Interfaccia Swagger
const swaggerSpecs = require('./config/swaggerDef.js'); // Configurazione Swagger



// Crea l'app Express
const app = express();

// Connessione al database MongoDB
connectDB();

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
