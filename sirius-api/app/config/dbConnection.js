var mongoose = require('mongoose'); 
// var Mockgoose = require('mockgoose').Mockgoose;
// var mockgoose = new Mockgoose(mongoose);

module.exports = function(app) {
    mongoose.connect(app.config.config.productionMode ? 
        app.config.config.connectionStringProd : 
        app.config.config.connectionStringDev,
        { useNewUrlParser: true, autoIndex: !app.config.config.productionMode });
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
