const Laptop = require('../models/laptop');
const fs = require('fs');
const { scrapperProducts } = require('../../utils/scrapper');

//! POST - Crear una función asíncrona para insertar los datos en la BBDD:
const insertLaptops = async (req, res, next) => {
  try {
    await scrapperProducts('https://www.pccomponentes.com/portatiles');
    console.log('Scrapper iniciado y completado');

    const laptopsFilePath = './products.json';
    if (fs.existsSync(laptopsFilePath)) {
      const laptops = JSON.parse(fs.readFileSync(laptopsFilePath, 'utf-8'));
      await Laptop.insertMany(laptops, { ordered: false });
      console.log('Todos los portátiles subidos a la BBDD');
      res
        .status(200)
        .json({ message: 'Scraping y almacenamiento completados' });
    } else {
      throw new Error(
        'El archivo products.json no existe o no se ha escrito correctamente.'
      );
    }
  } catch (error) {
    console.error(
      'Error durante el scraping o la inserción en la BBDD:',
      error
    );
    res
      .status(500)
      .json({ error: 'Error durante el scraping o la inserción en la BBDD' });
  }
};

//GET portátiles:
const getLaptops = async (req, res, next) => {
  try {
    const laptops = await Laptop.find();
    return res.status(200).json(laptops);
  } catch (error) {
    console.log(error);
    return res.status(404).json(error);
  }
};

// PUT un portátil por id:
const putLaptop = async (req, res, next) => {
  try {
    const { id } = req.params;
    const newLaptop = new Laptop(req.body);
    newLaptop._id = id;

    const laptopUpdated = await Laptop.findByIdAndUpdate(id, newLaptop, {
      new: true
    });
    return res.status(200).json(laptopUpdated);
  } catch (error) {
    console.log(error);
    return res.status(400).json('Error en la solicitud');
  }
};

//! DELETE un juego por id:
const deleteLaptop = async (req, res, next) => {
  try {
    const { id } = req.params;
    const laptopDeleted = await Laptop.findByIdAndDelete(id);
    return res.status(200).json(laptopDeleted);
  } catch (error) {
    console.log(error);
    return res.status(400).json('Error en la solicitud');
  }
};
module.exports = {
  insertLaptops,
  getLaptops,
  putLaptop,
  deleteLaptop
};
