const knex = require('./connection');

function getAllProducts() {
  return knex('products')
    .select('*');
}

function getSingleProduct(id) {
  return knex('products')
    .select('*')
    .where({ id: parseInt(id) });
}

function addProduct(obj) {
  return knex('products')
    .insert(obj)
    .returning('*');
}

function updateProduct(obj, id) {
  return knex('products')
    .update(obj)
    .where({ id: parseInt(id) })
    .returning('*');
}

function removeProduct(id) {
  return knex('products')
    .del()
    .where({ id: parseInt(id) })
    .returning('*');
}

module.exports = {
  getAllProducts,
  getSingleProduct,
  addProduct,
  updateProduct,
  removeProduct
};
