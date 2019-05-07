function PedidosController(app) {

    this._app = app;
    var Pedido = app.models.pedido;
    var Reserva = app.models.reserva;
    var Impressao = app.models.impressao;
    var Usuario = app.models.usuario;
    var Log = app.models.log;
    var ObjectId = app.config.dbConnection.Types.ObjectId;
    var tiposAtualizacao = {
        criacao: 'Criação do Pedido',
        alteracao: 'Alteração do Pedido',
        exclusao: 'Exclusão do Pedido',
        restauracao: 'Restauração do Pedido'
    };

    var atualizaReservas = function (pedido, tipo) {
        const data = app.moment(pedido.horario).startOf('day').toDate();
        const itens = pedido.itens.map(item => {
            return { item: item, data: data, tipo: tipo }
        });
        return new Promise(function (resolve, reject) {
            app.async.eachSeries(itens, atualizaReservaItem, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(pedido);
                }
            });
        });
    }

    var atualizaReservaItem = function ({ item, data, tipo }, callback) {
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
                { $set: { qtdaVendida: getQtdaVendidaReserva(reserva, item, tipo) } },
                { new: true },
                function (err) {
                    if (err) {
                        callback(`Erro ao atualizar reserva: ${JSON.stringify(err)}`);
                    } else {
                        callback();
                    }
                });
        });
    }

    var getQtdaVendidaReserva = function (reserva, item, tipo) {
        switch (tipo) {
            case tiposAtualizacao.criacao:
            case tiposAtualizacao.restauracao:
                return reserva.qtdaVendida + item.quantidade;
            case tiposAtualizacao.exclusao:
                return reserva.qtdaVendida - item.quantidade;
            default:
                throw 'Tipo Inválido';
        }
    }

    var geraIdItens = function (pedido) {
        if (pedido.itens) {
            pedido.itens.forEach(function (item) {
                if (!item.hasOwnProperty('_id') || !item._id) {
                    item._id = new ObjectId();
                }
            });
        }
        return pedido;
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
        pedido = geraIdItens(pedido);
        new Pedido(pedido).save()
            .then(function (novoPedido) {
                return new Log({
                    pedidoId: novoPedido._id,
                    logs: [
                        {
                            horario: new Date(),
                            usuario: pedido.usuario,
                            tipo: tiposAtualizacao.criacao,
                            depois: novoPedido
                        },
                    ]
                }).save();
            }).then(function (log) {
                return atualizaReservas(log.logs[0].depois, tiposAtualizacao.criacao);
            }).then(function (novoPedido) {
                callback(null, novoPedido);
            }).catch(callback);

    }

    this.put = function (id, pedido, callback) {
        pedido = geraIdItens(pedido);
        Pedido.findOneAndUpdate(id, pedido, { new: true })
            .then(function (result) {
                return atualizaReservas(result, tiposAtualizacao.exclusao); // Exclusão
            }).then(function (result) {
                return atualizaReservas(result, tiposAtualizacao.criacao); // Adição
            }).then(function (result) {
                callback(null, result);
            }).catch(function () {
                console.error(`Erro ao atualizar reservas ${JSON.stringify(err)}.`);
                callback(err, null);
                return;
            });
    }

    this.delete = function (id, { email, nome, senha }, callback) {
        Usuario.find({ email: email })
            .then(function (result) {
                senha = app.HmacSHA1(senha);
                if (result[0].senha !== senha) {
                    throw 'Senha incorreta!';
                }

                return Pedido.findByIdAndUpdate(id, {
                    $set: {
                        exclusao: {
                            horario: new Date(),
                            usuario: {
                                email: email,
                                nome: nome
                            }
                        }
                    }
                }, { new: true });
            }).then(function (result) {
                return atualizaReservas(result, tiposAtualizacao.exclusao);
            }).then(function (result) {
                callback(err, result);
            }).catch(callback);
    }

    this.deleteAdmin = function (id, callback) {
        var pedido = null;
        Pedido.findByIdAndDelete(id)
            .then(function (result) {
                pedido = result;
                if (result.exclusao) {
                    throw 'Pedido já excluído';
                }
                return atualizaReservas(result, tiposAtualizacao.exclusao);
            }).then(function (result) {
                callback(err, result);
            }).catch(function (err) {
                if (err === 'Pedido já excluído') {
                    callback(null, pedido);
                } else {
                    callback(err, null);
                    console.error(`Erro ao deletar pedido: ${JSON.stringify(err)}.`);
                    return;
                }
            });
    }

    this.restauraPedido = function (id, callback) {
        Pedido.findOneAndUpdate({ _id: id }, { $set: { exclusao: null } }, { new: true })
        .then(function(result) {
            return atualizaReservas(result, tiposAtualizacao.restauracao);
        }).then(function(result) {
            callback(result);
        }).catch(callback);
    }

    this.deleteItem = function (idPedido, idItem, callback) {
        Pedido.findOneAndUpdate({ _id: idPedido }, { $pull: { itens: { _id: idItem } } })
        .then(function (result) {
            const itens = result.itens.filter(i => i._id == idItem);
            const item = null;
            if (itens && itens.length > 0) {
                item = itens[0];
            } else {
                throw 'Item não localizado.';
            }

            const data = app.moment(result.data).startOf('day').toDate();
            atualizaReservaItem({ item: item, data: data, tipo: tiposAtualizacao.exclusao }, function (err) {
                if (err) {
                    console.error(`Erro ao atualizar reservas: ${JSON.stringify(err)}`);
                    callback(err, result);
                    return;
                }
                callback(null, result);
            });
        }).catch(callback);
    }

    this.addItem = function (idPedido, item, callback) {
        if (!item.hasOwnProperty('_id') || !item._id) {
            item._id = new ObjectId();
        }
        Pedido.findOneAndUpdate({ _id: idPedido }, { $push: { itens: item } }, { new: true }, function (err, result) {
            const data = app.moment(result.data).startOf('day').toDate();
            atualizaReservaItem({ item: item, data: data, tipo: tiposAtualizacao.criacao }, function (err) {
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