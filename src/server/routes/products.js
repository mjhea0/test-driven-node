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

module.exports = router;
