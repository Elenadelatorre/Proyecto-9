const mongoose = require('mongoose');

const laptopSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    img: { type: String, required: true },
    price: { type: Number, required: true }
  },
  {
    timestamps: true,
    collection: 'laptops'
  }
);

const Laptop = mongoose.model('laptops', laptopSchema, 'laptops')

module.exports = Laptop;