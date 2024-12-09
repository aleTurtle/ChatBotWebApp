// Carica le variabili d'ambiente dal file .env
require('dotenv').config();  

// Verifica che la variabile MONGO_URI sia correttamente caricata
console.log('MONGO_URI:', process.env.MONGO_URI);


// Importa le dipendenze
const express = require('express');
const connectDB = require('./src/config/db'); // Importa la funzione di connessione al DB
const swaggerUi = require('swagger-ui-express'); // Interfaccia Swagger
const swaggerSpecs = require('./src/config/swaggerDef'); // Configurazione Swagger

//const Message = require('./src/models/Message'); // Modello per il salvataggio dei messaggi
//const User = require('./src/models/User'); //modello per il salvataggio degli utenti nel db 
//const jwt = require('jsonwebtoken');//importa i moduli per la generazione del jwt

// Importa il motore NLP
const bodyParser = require('body-parser'); // Per elaborare il corpo delle richieste
const RasaEngine = require('./src/nlp/rasaEngine'); // Classe per interagire con Rasa
console.log('NLP_ENGINE:', process.env.NLP_ENGINE);

const BASE_URL = process.env.ENGINE_BASE_URL;
console.log('ENGINE_BASE_URL:', process.env.ENGINE_BASE_URL);

// Crea un'istanza di RasaEngine
const rasaEngine = new RasaEngine(BASE_URL);

// Crea l'app Express
const app = express();

//app.use(express.json()); // Middleware per il parsing del corpo JSON
app.use(bodyParser.json());

// Connessione al database MongoDB
connectDB();  // Funzione di connessione al DB

// Imposta Swagger per la documentazione delle API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Imposta una route di esempio
app.get('/', (req, res) => {
  res.send('Benvenuto nel chatbot dell\'università!');
});




const lezioniRoutes = require('./src/routes/lezioni'); // Importa il modulo delle routes
app.use('/lezioni', lezioniRoutes); // Usa le routes

//const chatRoutes = require('./src/routes/chat'); // Importa il modulo delle routes
//app.use('/api/chat', chatRoutes); // Usa le routes


const loginRoutes = require('./src/routes/loginRoutes');
const signupRoutes = require('./src/routes/signupRoutes');

app.use('/api/auth', loginRoutes);
app.use('/api/auth', signupRoutes);


const conversationRoutes = require('./src/routes/conversationRoutes');
const messageRoutes = require('./src/routes/messageRoutes');
const chatRoutes = require('./src/routes/chatRoutes');

app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/chat', chatRoutes);

/*const conversationsRoutes = require('./src/routes/conversations'); 
app.use('/api/conversations', conversationsRoutes);

const messageRoutes = require('./src/routes/getMessagesOfConversation'); 
app.use('/api/conversations/:conversationId/messages', messageRoutes); 

const conversationUserRoutes = require('./src/routes/conversationsOfUser');
app.use('/api/conversations/user/:userId', conversationUserRoutes);
/*/

// Configura la porta dal file .env o usa 3000 di default
const PORT = process.env.PORT;

// Avvia il server
app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});