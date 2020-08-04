var mongoose = require('mongoose'); 
var promise = require('bluebird');
mongoose.Promise = promise;

module.exports = function(app) {
    mongoose.connect(process.env['NODE_ENV'] === 'prod' ? 
        app.config.config.connectionStringProd : 
        app.config.config.connectionStringDev,
        { useNewUrlParser: true });  // autoIndex: process.env['NODE_ENV'] === 'dev'
    mongoose.pluralize(null);
    mongoose.connection.once('open', function() {
        console.log('Conectado');
    });
    return mongoose;
}
