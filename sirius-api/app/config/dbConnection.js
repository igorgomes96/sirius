var mongoose = require('mongoose'); 
var promise = require('bluebird');
mongoose.Promise = promise;
// var Mockgoose = require('mockgoose').Mockgoose;
// var mockgoose = new Mockgoose(mongoose);

module.exports = function(app) {
    mongoose.connect(process.env['NODE_ENV'] === 'prod' ? 
        app.config.config.connectionStringProd : 
        app.config.config.connectionStringDev,
        { useNewUrlParser: true });  // autoIndex: process.env['NODE_ENV'] === 'dev'
    mongoose.pluralize(null);
    // mockgoose.prepareStorage().then(function() {
    //     console.log('mockgoose prepared.');	
    //     mongoose.connect('mongodb://teste', function(err) {
    //         console.error(err);
    //     });	
    // });
    mongoose.connection.once('open', function() {
        console.log('Conectado');
    });
    return mongoose;
}
