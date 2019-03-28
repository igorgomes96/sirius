module.exports = function (app) {
    var db = app.config.dbConnection;
    
    var usuarioSchema = new db.Schema({
        nome: String,
        email: String,
        senha:  { type: String, index: true },
        perfil: String
    });

    return db.model('usuarios', usuarioSchema);
}