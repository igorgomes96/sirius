module.exports = function (app) {
    var db = app.config.dbConnection;
    var ObjectId = db.Schema.ObjectId;

    var itemCardapioSchema = new db.Schema({
        nome: { type: String, index: true },
        valor: Number,
        unidade: {
            _id: ObjectId, 
            nome: String,
            sigla: String
        },
        popular: Boolean,
        tipo: String,
        detalhes: String,
        order: Number
    });

    return db.model('cardapio', itemCardapioSchema);
}