module.exports = function (app) {
    var db = app.config.dbConnection;
    var ObjectId = db.Schema.Types.ObjectId;
    
    var reserva = new db.Schema({
        item: {
            _id: ObjectId,
            nome: String,
            valor: Number,
            tipo: String,
            unidade: {
                nome: String,
                sigla: String
            },
            detalhes: String
        },
        data: Date,
        qtda: Number,
        qtdaVendida: Number
    });

    return db.model('reservas', reserva);
}