module.exports = function (app) {
    var db = app.config.dbConnection;
    var ObjectId = db.Types.ObjectId;

    var pedidoSchema = new db.Schema({
        itens: [
            {
                _id: ObjectId,
                nome: String,
                valor: Number,
                unidade: {
                    nome: String,
                    sigla: String
                },
                tipo: String,
                detalhes: String,
                comPimenta: Boolean,
                quantidade: Number
            }
        ],
        cliente: {
            _id: ObjectId,
            nome: String,
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
        },
        horario: Date,
        entregar: Boolean,
        observacoes: String,
        usuario: {
            nome: String,
            email: String,
            perfil: String
        },
        enderecoEntrega: {
            rua: String,
            bairro: String,
            cidade: String,
            uf: String,
            numero: Number
        },
        exclusao: {
            horario: Date,
            usuario: {
                nome: String,
                email: String,
            }
        },
        pago: Boolean,
        impressao: {
            usuario:{
                nome: String,
                email: String,
            },
            horario: Date
        }
    });

    return db.model('pedidos', pedidoSchema);
}