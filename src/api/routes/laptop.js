const { getLaptops, insertLaptops, putLaptop, deleteLaptop } = require('../controllers/laptop');

const laptopsRouter = require('express').Router();

laptopsRouter.get('/', getLaptops);
laptopsRouter.post('/robar_laptops', insertLaptops);
laptopsRouter.put('/:id', putLaptop);
laptopsRouter.delete('/:id', deleteLaptop);

module.exports = laptopsRouter;
