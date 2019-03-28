module.exports = function (app) {
    var db = app.config.dbConnection;

    var impressaoSchema = new db.Schema({
        data: { type: [Date], index: true },
        usuario: {
            nome: String,
            email: String,
            perfil: String
        }
    });

    return db.model('impressoes', impressaoSchema);
}