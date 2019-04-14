module.exports = function (app) {
    var db = app.config.dbConnection;
    
    var clienteSchema = new db.Schema({
        nome: { type: String, index: true },
        fone1: String,
        fone2: String,
        endereco: {
            rua: String,
            bairro: String,
            cidade: String,
            uf: String,
            numero: Number
        },
        observacoes: String
    });

    return db.model('clientes', clienteSchema);
}