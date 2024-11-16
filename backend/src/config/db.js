const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connesso a MongoDB');
  } catch (error) {
    console.error('Errore nella connessione a MongoDB:', error);
    process.exit(1); // Esce in caso di errore
  }
};

module.exports = connectDB;
