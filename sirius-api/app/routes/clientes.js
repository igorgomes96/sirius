module.exports = function (app) {

  var ctrl = app.controllers.clientes;
  app.get('/api/clientes', function (req, res) {
    if (req.query.hasOwnProperty('nome')) {
      ctrl.getByNome(req.query['nome'], function (err, result) {
        if (err)
          res.status(500).json(err);
        else
          res.json(result);
      });
      return;
    }

    if (req.query.hasOwnProperty('telefone')) {
      ctrl.getByTelefone(req.query['telefone'], function (err, result) {
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

  app.get('/api/clientes/:id', function (req, res) {
    ctrl.get(req.params.id, function (err, result) {
      if (err)
        res.status(500).json(err);
      else {
        if (!result)
          res.status(404).send('Cliente não encontrado!');
        else
          res.json(result);
      }
    });
  });

  app.post('/api/clientes', function (req, res) {
    var cliente = req.body;
    ctrl.post(cliente, function (err, result) {
      if (err) {
        res.status(500).json(err);
      } else {
        res.json(result);
      }
    });
  });

  app.put('/api/clientes/:id', function (req, res) {
    var cliente = req.body;
    ctrl.put(req.params.id, cliente, function (err, result) {
      if (err) {
        res.status(500).json(err);
      } else {
        if (!result)
          res.status(404).send('Cliente não encontrado!');
        else
          res.status(204).send();
      }
    });
  });

  app.delete('/api/clientes/:id', function (req, res) {
    ctrl.delete(req.params.id, function (err, result) {
      if (err) {
        res.status(500).json(err);
      } else {
        if (!result)
          res.status(404).send('Cliente não encontrado!');
        else
          res.status(200).send(result);
      }
    });
  });
}