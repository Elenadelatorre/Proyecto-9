const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log('Conectado con éxito a la BBDD 🟢');
  } catch (error) {
    console.log(error);
    console.log('Error al conectar con la BBDD 🔴');
  }
};

module.exports = { connectDB };
