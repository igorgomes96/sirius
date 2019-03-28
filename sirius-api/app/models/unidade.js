module.exports = function (app) {
    var db = app.config.dbConnection;

    var unidadesSchema = new db.Schema({
        nome: String,
        sigla: String
    });

    return db.model('unidades', unidadesSchema);
}