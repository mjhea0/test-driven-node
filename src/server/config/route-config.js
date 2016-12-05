(function(routeConfig) {

  routeConfig.init = (app) => {

    // *** routes *** //
    const routes = require('../routes/index');
    const productRoutes = require('../routes/products');

    // *** register routes *** //
    app.use('/', routes);
    app.use('/api/v1/products', productRoutes);

  };

})(module.exports);
