function PedidosController(app) {

    this._app = app;
    var Pedido = app.models.pedido;
    var Reserva = app.models.reserva;
    var Impressao = app.models.impressao;
    var Usuario = app.models.usuario;
    var ObjectId = app.config.dbConnection.Types.ObjectId;

    var atualizaReservas = function (pedido, callback, del = false) {
        const data = app.moment(pedido.horario).startOf('day').toDate();
        const itens = pedido.itens.map(item => {
            return { item: item, data: data, del: del }
        });
        app.async.eachSeries(itens, atualizaReservaItem, callback);
    }

    var atualizaReservaItem = function ({ item, data, del = false }, callback) {
        Reserva.find({ 'item._id': item._id, data: data }, function (err, result) {
            if (err) {
                callback(`Erro ao buscar reserva: ${JSON.stringify(err)}`);
                return;
            }

            if (!result.length) {
                callback();
                return;
            }

            var reserva = result[0];
            Reserva.findByIdAndUpdate(reserva._id,
                { $set: { qtdaVendida: del ? (reserva.qtdaVendida - item.quantidade) : (reserva.qtdaVendida + item.quantidade) } },
                { new: true },
                function (err) {
                    if (err) {
                        callback(`Erro ao atualizar reserva: ${JSON.stringify(err)}`);
                        return;
                    }
                    callback();
                });
        });
    }

    this.getAll = function (callback) {
        Pedido.find({}).sort('horario').exec(callback);
    }

    this.getByData = function (data, callback) {
        var inicioDia = app.moment(data).startOf('day').toDate();
        var fimDia = app.moment(data).endOf('day').toDate();
        Pedido.find({
            horario: {
                $gte: inicioDia,
                $lt: fimDia
            }
        }).sort('horario').exec(callback);
    }

    this.getAggregatedByData = function (data, callback) {
        var inicioDia = app.moment(data).startOf('day').toDate();
        var fimDia = app.moment(data).endOf('day').toDate();
        Pedido.aggregate([{
            $match: {
                horario: {
                    $gte: inicioDia,
                    $lt: fimDia
                }
            }
        }, {
            $unwind: {
                path: "$itens"
            }
        }, {
            $group: {
                _id: "$itens._id",
                item: {
                    $push: "$itens"
                },
                quantidade: {
                    $sum: "$itens.quantidade"
                }
            }
        }, {
            $project: {
                _id: 0,
                item: { $arrayElemAt: ["$item", 0] },
                quantidade: 1
            }
        }, {
            $project: {
                nome: '$item.nome',
                tipo: '$item.tipo',
                valor: '$item.valor',
                unidade: '$item.unidade',
                quantidade: '$quantidade',
                detalhes: '$item.detalhes'
            }
        }]).sort('_id.nome').exec(callback);
    }

    this.get = function (id, callback) {
        Pedido.findById(id, callback);
    }

    this.post = function (pedido, callback) {
        new Pedido(pedido).save(function (err, novoPedido) {
            if (err) {
                callback(err, null);
                return;
            }
            atualizaReservas(pedido, function (err) {
                if (err) {
                    console.error(`Erro ao atualizar reservas: ${JSON.stringify(err)}!`);
                }
                callback(null, novoPedido);
            });
        });
    }

    this.put = function (id, pedido, callback) {
        Pedido.findByIdAndUpdate(id, pedido, { new: true }, function (err, result) {
            atualizaReservas(pedido, function (err) {
                if (err) {
                    console.error(`Erro ao atualizar reservas ${JSON.stringify(err)}.`);
                    callback(err, null);
                }
                // atualizaReservas(pedido, function (err) {
                //     if (err) {
                //         console.error(`Erro ao atualizar reservas ${JSON.stringify(err)}.`);
                //         callback(err, null);
                //     }
                //     callback(null, result);
                // });
                callback(null, result);
            }, true);
        });
    }

    this.delete = function (id, { email, nome, senha }, callback) {
        Usuario.find({ email: email }, function (err, result) {
            if (err) {
                callback(err, null);
                console.error(err);
                return;
            }
            senha = app.HmacSHA1(senha);
            if (result[0].senha !== senha) {
                callback('Senha incorreta!');
                return;
            }

            Pedido.findByIdAndUpdate(id, {
                $set: {
                    exclusao: {
                        horario: new Date(),
                        usuario: {
                            email: email,
                            nome: nome
                        }
                    }
                }
            }, { new: true }, callback);
        });

    }

    this.deleteAdmin = function (id, callback) {
        Pedido.findByIdAndDelete(id, function (err, result) {
            if (err) {
                callback(err, null);
                console.error(`Erro ao deletar pedido: ${JSON.stringify(err)}.`);
                return;
            }

            if (result.exclusao) {
                callback(null, result);
                return;
            }
            
            atualizaReservas(result, function (err) {
                if (err) {
                    console.error(`Erro ao atualizar reservas: ${JSON.stringify(err)}.`);
                    callback(err, null);
                }
                callback(err, result);
            }, true);
        });
    }

    this.restauraPedido = function (id, callback) {
        Pedido.findOneAndUpdate({ _id: id }, { $set: { exclusao: null } }, { new: true }, callback);
    }

    this.deleteItem = function (idPedido, idItem, callback) {
        Pedido.findOneAndUpdate({ _id: idPedido }, { $pull: { itens: { _id: idItem } } }, function (err, result) {
            const item = result.itens.filter(i => i._id == idItem)[0];
            atualizaReservaItem({ item: item, data: app.moment(result.data).startOf('day').toDate(), del: true }, function (err) {
                if (err) {
                    console.error(`Erro ao atualizar reservas: ${JSON.stringify(err)}`);
                    callback(err, {});
                    return;
                }
                callback(null, {});
            });
        });
    }

    this.addItem = function (idPedido, item, callback) {
        if (!item.hasOwnProperty('_id') || !item._id) {
            item._id = new ObjectId();
        }
        Pedido.findOneAndUpdate({ _id: idPedido }, { $push: { itens: item } }, { new: true }, function (err, result) {
            atualizaReservaItem({ item: item, data: app.moment(result.data).startOf('day').toDate() }, function (err) {
                if (err) {
                    console.error(`Erro ao atualizar reservas: ${JSON.stringify(err)}`);
                    callback(err, result);
                    return;
                }
                callback(null, result);
            });
        })
    }

    this.addItens = function (idPedido, itens, callback) {
        itens = itens.map(item => {
            if (!item.hasOwnProperty('_id') || !item._id) {
                item._id = new ObjectId();
            }
            return item;
        });
        Pedido.findOneAndUpdate({ _id: idPedido }, { $push: { itens: { $each: itens } } }, { new: true }, function (err, result) {
            if (err) {
                callback(err, result);
                return;
            }
            const data = app.moment(result.data).startOf('day').toDate();
            itens = itens.map(item => {
                return { item: item, data: data }
            });
            app.async.eachSeries(itens, atualizaReservaItem, function (err) {
                callback(err, result);
            });
        });
    }

    this.getImpressoes = function (callback) {
        Impressao.find({ data: app.moment(new Date()).startOf('day').toDate() }, callback);
    }

    this.postImpressao = function (usuario, callback) {
        new Impressao({ data: app.moment(new Date()).startOf('day').toDate(), usuario: usuario })
            .save(callback);
    }
}

module.exports = function (app) {
    return new PedidosController(app);
}