var mongoose = require('mongoose'); 
module.exports = function(app) {
    mongoose.connect(app.config.config.productionMode ? 
        app.config.config.connectionStringProd : 
        app.config.config.connectionStringDev,
        { useNewUrlParser: true, autoIndex: !app.config.config.productionMode });
    mongoose.pluralize(null);
    mongoose.connection.once('open', function() {
        console.log('Conectado');
    });
    return mongoose;
}
