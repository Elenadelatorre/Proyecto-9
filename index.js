require('dotenv').config();
const express = require('express');
const laptopsRouter = require('./src/api/routes/laptop');
const { connectDB } = require('./src/config/db');

const app = express();
connectDB();

app.use(express.json());
app.use('/api/v1/laptops', laptopsRouter);

app.use('*', (req, res, next) => {
  return res.status(404).json('Route not found');
});
app.listen(3000, async (req, res, next) => {
  console.log('Servidor levantando en: http://localhost:3000 😍');
});
