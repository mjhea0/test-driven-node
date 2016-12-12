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
