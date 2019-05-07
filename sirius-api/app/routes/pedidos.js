module.exports = function (app) {

  var ctrl = app.controllers.pedidos;
  app.get('/api/pedidos', function (req, res) {
    if (req.query.hasOwnProperty('data')) {
      ctrl.getByData(new Date(req.query['data']), function (err, result) {
        if (err)
          res.status(500).json(err);
        else
          res.json(result);
      });
      return;
    }
    ctrl.getAll(function (err, result) {
      if (err)
        res.status(500).json(err);
      else
        res.json(result);
    });
  });

  app.get('/api/pedidos/impressoes', function (req, res) {
    ctrl.getImpressoes(function (err, result) {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).send(result);
      }
    });
  });

  app.get('/api/pedidos/agrupados', function (req, res) {
    ctrl.getAggregatedByData(new Date(req.query['data']), function (err, result) {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).send(result);
      }
    });
  });

  app.get('/api/pedidos/:id', function (req, res) {
    ctrl.get(req.params.id, function (err, result) {
      if (err)
        res.status(500).json(err);
      else {
        if (!result)
          res.status(404).send('Pedido não encontrado!');
        else
          res.json(result);
      }
    });
  });

  app.post('/api/pedidos', function (req, res) {
    var pedido = req.body;
    pedido.usuario = req.session.usuario;
    if (pedido.hasOwnProperty('_id')) delete pedido._id;
    ctrl.post(pedido, function (err, result) {
      if (err) {
        res.status(500).json(err);
      } else {
        res.json(result);
      }
    });
  });

  app.put('/api/pedidos/:id', function (req, res) {
    var pedido = req.body;
    ctrl.put(req.params.id, pedido, function (err, result) {
      if (err) {
        res.status(500).json(err);
      } else {
        if (!result)
          res.status(404).send('Pedido não encontrado!');
        else
          res.status(204).send();
      }
    });
  });

  app.put('/api/pedidos/:id/confirmacao', function (req, res) {
    var pedido = req.body;
    ctrl.confirmacaoPedido(req.params.id, pedido, function (err, result) {
      if (err) {
        res.status(500).json(err);
      } else {
        if (!result)
          res.status(404).send('Pedido não encontrado!');
        else
          res.status(204).send();
      }
    });
  });

  // Somente administrador
  app.delete('/api/pedidos/:id', function (req, res) {
    ctrl.deleteAdmin(req.params.id, function (err, result) {
      if (err) {
        res.status(500).json(err);
      } else {
        if (!result)
          res.status(404).send('Pedido não encontrado!');
        else
          res.status(200).send(result);
      }
    });
  });

  app.post('/api/pedidos/:id/restaura', function (req, res) {
    ctrl.restauraPedido(req.params.id, function (err, result) {
      if (err) {
        res.status(500).json(err);
      } else {
        res.json(result);
      }
    });
  });


  app.post('/api/pedidos/:id/delete', function (req, res) {
    const usuario = req.session.usuario;
    usuario.senha = req.body.senha;
    ctrl.delete(req.params.id, usuario, function (err, result) {
      if (err) {
        if (err === 'Senha incorreta!') {
          res.status(400).json(err);
          return;
        }
        res.status(500).json(err);
      } else {
        if (!result)
          res.status(404).send('Pedido não encontrado!');
        else
          res.status(200).send(result);
      }
    });
  });

  app.delete('/api/pedidos/:id/item/:idItem', function (req, res) {
    ctrl.deleteItem(req.params.id, req.params.idItem, function (err, result) {
      if (err) {
        res.status(500).json(err);
      } else {
        if (!result)
          res.status(404).send('Pedido não encontrado!');
        else
          res.status(200).send();
      }
    });
  });

  app.post('/api/pedidos/impressoes', function (req, res) {
    ctrl.postImpressao(req.session.usuario, function (err, result) {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).send(result);
      }
    });
  });

  app.post('/api/pedidos/:id/item', function (req, res) {
    ctrl.addItem(req.params.id, req.body, function (err, result) {
      if (err) {
        res.status(500).json(err);
      } else {
        if (!result)
          res.status(404).send('Pedido não encontrado!');
        else
          res.status(200).send(result);
      }
    });
  });

  app.post('/api/pedidos/:id/itens', function (req, res) {
    ctrl.addItens(req.params.id, req.body, function (err, result) {
      if (err) {
        res.status(500).json(err);
      } else {
        if (!result)
          res.status(404).send('Pedido não encontrado!');
        else
          res.status(200).send();
      }
    });
  });

}