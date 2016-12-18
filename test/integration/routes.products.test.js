process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../../src/server/app');
const knex = require('../../src/server/db/connection');

describe('routes : products', () => {

  beforeEach(() => {
    return knex.migrate.rollback()
    .then(() => { return knex.migrate.latest(); })
    .then(() => { return knex.seed.run(); });
  });

  afterEach(() => {
    return knex.migrate.rollback();
  });

  describe('GET /api/v1/products', () => {
    it('should respond with all products', (done) => {
      chai.request(server)
      .get('/api/v1/products')
      .end((err, res) => {
        // there should be no errors
        should.not.exist(err);
        // there should be a 200 status code
        res.status.should.equal(200);
        // the response should be JSON
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('success');
        // the JSON response body should have a
        // key-value pair of {"data": [3 product objects]}
        res.body.data.length.should.eql(3);
        // the first object in the data array should
        // have the right keys
        res.body.data[0].should.include.keys(
          'id', 'name', 'description', 'price', 'created_at'
        );
        done();
      });
    });
    it('should respond with a message if there are no products', () => {
      return knex.migrate.rollback()
      .then(() => { return knex.migrate.latest(); })
      .then(() => {
        chai.request(server)
        .get('/api/v1/products')
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.status.should.eql('success');
          res.body.data.should.eql('Sorry there are no products.');
        });
      });
    });
  });

  describe('GET /api/v1/products/:id', () => {
    it('should respond with a single product', (done) => {
      chai.request(server)
      .get('/api/v1/products/1')
      .end((err, res) => {
        // there should be no errors
        should.not.exist(err);
        // there should be a 200 status code
        res.status.should.equal(200);
        // the response should be JSON
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('success');
        // the JSON response body should have a
        // key-value pair of {"data": 1 product object}
        res.body.data.length.should.eql(1);
        // the first object in the data array should
        // have the right keys
        res.body.data[0].should.include.keys(
          'id', 'name', 'description', 'price', 'created_at'
        );
        done();
      });
    });
    it('should throw an error if the product id is null', (done) => {
      chai.request(server)
      .get(`/api/v1/products/${null}`)
      .end((err, res) => {
        should.exist(err);
        res.status.should.equal(500);
        res.body.status.should.eql('error');
        should.exist(res.body.data);
        done();
      });
    });
    it('should respond with a message if the product id does not exist', (done) => {
      chai.request(server)
      .get(`/api/v1/products/9999`)
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(200);
        res.type.should.equal('application/json');
        res.body.status.should.eql('success');
        res.body.data.should.eql('Sorry that product ID does not exist.');
        done();
      });
    });
  });

  describe('POST /api/v1/products', () => {
    it('should respond with a single product that was added', (done) => {
      chai.request(server)
      .post('/api/v1/products')
      .send({
        name: 'test product',
        description: 'just a test description',
        price: 22.99
      })
      .end((err, res) => {
        // there should be no errors
        should.not.exist(err);
        // there should be a 201 status code
        // (indicating that something was "created")
        res.status.should.equal(201);
        // the response should be JSON
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('success');
        // the JSON response body should have a
        // key-value pair of {"data": 1 product object}
        res.body.data.length.should.eql(1);
        // the first object in the data array should
        // have the right keys
        res.body.data[0].should.include.keys(
          'id', 'name', 'description', 'price', 'created_at'
        );
        done();
      });
    });
    it('should throw an error when a price is not provided', () => {
      chai.request(server)
      .post('/api/v1/products')
      .send({
        name: 'test product',
        description: 'just a test description'
      })
      .end((err, res) => {
        should.exist(err);
        res.status.should.equal(500);
        res.status.should.equal(500);
        res.body.status.should.eql('error');
        should.exist(res.body.data);
        // ensure the product was not added
        knex('products')
        .select('*')
        .where({ name: 'test product' })
        .then((product) => {
          product.length.should.eql(0);
        });
      });
    });
  });

  describe('PUT /api/v1/products', () => {
    it('should respond with a single product that was updated', (done) => {
      knex('products')
      .select('*')
      .then((product) => {
        const productObject = product[0];
        chai.request(server)
        .put(`/api/v1/products/${productObject.id}`)
        .send({
          name: 'updated name',
          description: 'updated description',
          price: 33.98
        })
        .end((err, res) => {
          // there should be no errors
          should.not.exist(err);
          // there should be a 200 status code
          res.status.should.equal(200);
          // the response should be JSON
          res.type.should.equal('application/json');
          // the JSON response body should have a
          // key-value pair of {"status": "success"}
          res.body.status.should.eql('success');
          // the JSON response body should have a
          // key-value pair of {"data": 1 product object}
          res.body.data.length.should.eql(1);
          // the first object in the data array should
          // have the right keys
          res.body.data[0].should.include.keys(
            'id', 'name', 'description', 'price', 'created_at'
          );
          // ensure the product was updated
          const newProductObject = res.body.data[0];
          newProductObject.name.should.eql('updated name');
          newProductObject.description.should.eql('updated description');
          newProductObject.price.should.eql(33.98);
          done();
        });
      });
    });
  });

  describe('DELETE /api/v1/products/:id', () => {
    it('should respond with a single product that was deleted', (done) => {
      knex('products')
      .select('*')
      .then((products) => {
        const productObject = products[0];
        const lengthBeforeDelete = products.length;
        chai.request(server)
        .delete(`/api/v1/products/${productObject.id}`)
        .end((err, res) => {
          // there should be no errors
          should.not.exist(err);
          // there should be a 200 status code
          res.status.should.equal(200);
          // the response should be JSON
          res.type.should.equal('application/json');
          // the JSON response body should have a
          // key-value pair of {"status": "success"}
          res.body.status.should.eql('success');
          // the JSON response body should have a
          // key-value pair of {"data": 1 product object}
          res.body.data.length.should.eql(1);
          // the first object in the data array should
          // have the right keys
          res.body.data[0].should.include.keys(
            'id', 'name', 'description', 'price', 'created_at'
          );
          // ensure the product was updated
          knex('products').select('*')
          .then((updatedProducts) => {
            updatedProducts.length.should.eql(lengthBeforeDelete - 1);
            done();
          });
        });
      });
    });
  });

});
