const express = require('express');
const router = express.Router();

const knex = require('../db/connection');
const queries = require('../db/queries.products.js');

router.get('/', (req, res, next) => {
  queries.getAllProducts()
  .then((products) => {
    if (!products.length) {
      return res.status(200).json({
        status: 'success',
        data: 'Sorry there are no products.'
      });
    }
    res.status(200).json({
      status: 'success',
      data: products
    });
  })
  .catch((err) => {
    res.status(500).json({
      status: 'error',
      data: err
    });
  });
});

router.get('/:id', (req, res, next) => {
  const productID = parseInt(req.params.id);
  queries.getSingleProduct(productID)
  .then((product) => {
    if (!product.length) {
      return res.status(200).json({
        status: 'success',
        data: 'Sorry that product ID does not exist.'
      });
    }
    res.status(200).json({
      status: 'success',
      data: product
    });
  })
  .catch((err) => {
    res.status(500).json({
      status: 'error',
      data: err
    });
  });
});

router.post('/', (req, res, next) => {
  const productObject = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price
  };
  queries.addProduct(productObject)
  .then((product) => {
    res.status(201).json({
      status: 'success',
      data: product
    });
  })
  .catch((err) => {
    res.status(500).json({
      status: 'error',
      data: err
    });
  });
});

router.put('/:id', (req, res, next) => {
  const productObject = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price
  };
  const productID = parseInt(req.params.id);
  queries.updateProduct(productObject, productID)
  .then((user) => {
    res.status(200).json({
      status: 'success',
      data: user
    });
  })
  .catch((err) => {
    res.status(500).json({
      status: 'error',
      data: err
    });
  });
});

router.delete('/:id', (req, res, next) => {
  const productID = parseInt(req.params.id);
  queries.removeProduct(productID)
  .then((product) => {
    res.status(200).json({
      status: 'success',
      data: product
    });
  })
  .catch((err) => {
    res.status(500).json({
      status: 'error',
      data: err
    });
  });
});

module.exports = router;
