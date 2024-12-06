// Carica le variabili d'ambiente dal file .env
require('dotenv').config();  

// Verifica che la variabile MONGO_URI sia correttamente caricata
console.log('MONGO_URI:', process.env.MONGO_URI);


// Importa le dipendenze
const express = require('express');
const connectDB = require('./src/config/db'); // Importa la funzione di connessione al DB
const swaggerUi = require('swagger-ui-express'); // Interfaccia Swagger
const swaggerSpecs = require('./src/config/swaggerDef'); // Configurazione Swagger
const Message = require('./src/models/Message'); // Modello per il salvataggio dei messaggi
const User = require('./src/models/User'); //modello per il salvataggio degli utenti nel db 


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

// Endpoint per inviare per comunicare con il bot 
app.post('/api/chat', async (req, res) => {
  const { message } = req.body; // Estrarre il messaggio e il mittente dal corpo della richiesta

  if (!message ) {
    return res.status(400).json({ error: 'Message and sender are required' });
  }

  try {
    const rasaResponse = await rasaEngine.sendMessage(message); // Invia il messaggio a Rasa

    // Estrai il testo dalla risposta di Rasa
    const botResponseText = rasaResponse[0]?.text || 'Errore nella risposta del bot';

    // Salva il messaggio dell'utente nel database
    const userMessage = new Message({
    message: message, // Messaggio dell'utente
    sender: 'user', // Indica che è un messaggio dell'utente
    });
      await userMessage.save(); // Salva nel database

// Salva la risposta del bot nel database
const botMessage = new Message({
  message: botResponseText, // Risposta del bot
  sender: 'bot', // Indica che è un messaggio del bot
});
await botMessage.save(); // Salva nel database

    //res.json({ responses: botResponseText }); // Invia la risposta al client
    res.json({ responses: [{ text: botResponseText }] });
    console.log('Risposta inviata al frontend:', { responses: [{ text: botResponseText }] });

  } catch (error) {
    console.error("Errore durante la comunicazione con Rasa:", error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});


//Endpoint per inviare username e password per la registrazione
app.post('/api/sign-up', async (req, res) => {
  const { username,password } = req.body; // Estrarre il messaggio e il mittente dal corpo della richiesta

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    // Qui puoi gestire ulteriori operazioni per il servizio chat, se necessario
    return res.status(200).json({ message: 'Registrazione riuscita'});
  } catch (error) {
    console.error('Errore nella registrazione:', error);
    return res.status(500).json({ error: 'Errore del server durante la registrazione' });
  }


});



//Endpoint per inviare username e password per la login
app.post('/api/login', async (req, res) => {
  const { username,password } = req.body; // Estrarre il messaggio e il mittente dal corpo della richiesta

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  try {
    // Trova l'utente nel database
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: 'Utente già esistente' });
    }

    // Confronta la password (presupponendo che il modello User abbia un metodo comparePassword)
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Genera il token JWT
    const token = jwt.sign(
      { userId: user._id }, // Payload del token
      process.env.JWT_SECRET, // Chiave segreta (definita in variabili d'ambiente)
      { expiresIn: '1h' } // Scadenza del token
    );

    // Restituisci il token nella risposta
    return res.status(200).json({ token });
  } catch (error) {
    console.error('Errore durante il login:', error);
    return res.status(500).json({ error: 'Errore del server durante la login' });
  }
});



const lezioniRoutes = require('./src/routes/lezioni'); // Importa il modulo delle routes
app.use('/lezioni', lezioniRoutes); // Usa le routes

const chatRoutes = require('./src/routes/chat'); // Importa il modulo delle routes
app.use('/api/chat', chatRoutes); // Usa le routes

const loginRoutes = require('./src/routes/login');
app.use('/api/login', loginRoutes);// rotta di login

const signupRoutes = require('./src/routes/signup');
app.use('/api/sign-up', signupRoutes);// rotta per la registrazione



// Configura la porta dal file .env o usa 3000 di default
const PORT = process.env.PORT;

// Avvia il server
app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});