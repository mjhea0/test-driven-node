const express = require('express');
const router = express.Router();

const knex = require('../db/connection');

router.get('/', (req, res, next) => {
  knex('products').select('*')
  .then((products) => {
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
  knex('products').select('*').where({ id: productID })
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

router.post('/', (req, res, next) => {
  knex('products')
  .insert({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price
  })
  .returning('*')
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
  const productID = parseInt(req.params.id);
  const updatedName = req.body.name;
  const updatedDescription = req.body.description;
  const updatedPrice = req.body.price;
  knex('products')
  .update({
    name: updatedName,
    description: updatedDescription,
    price: updatedPrice
  })
  .where({
    id: productID
  })
  .returning('*')
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
  knex('products').del().where({ id: productID }).returning('*')
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
