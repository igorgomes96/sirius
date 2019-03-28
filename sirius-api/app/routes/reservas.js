module.exports = function (app) {

  var ctrl = app.controllers.reservas;
  app.get('/api/reservas', function (req, res) {
    if (req.query.hasOwnProperty('data')) {
      ctrl.getByData(req.query['data'], function (err, result) {
        if (err)
          res.status(500).json(err);
        else
          res.json(result);
      });
    } else {
      ctrl.getAll(function (err, result) {
        if (err)
          res.status(500).json(err);
        else
          res.json(result);
      });
    }
  });

  app.get('/api/reservas/:id', function (req, res) {
    ctrl.get(req.params.id, function (err, result) {
      if (err)
        res.status(500).json(err);
      else {
        if (!result)
          res.status(404).send('Reserva não encontrada!');
        else
          res.json(result);
      }
    });
  });

  app.post('/api/reservas', function (req, res) {
    var cliente = req.body;
    ctrl.post(cliente, function (err, result) {
      if (err) {
        res.status(500).json(err);
      } else {
        res.json(result);
      }
    });
  });

  app.put('/api/reservas/:id', function (req, res) {
    var cliente = req.body;
    ctrl.put(req.params.id, cliente, function (err, result) {
      if (err) {
        res.status(500).json(err);
      } else {
        if (!result)
          res.status(404).send('Reserva não encontrada!');
        else
          res.status(204).send();
      }
    });
  });

  app.delete('/api/reservas/:id', function (req, res) {
    ctrl.delete(req.params.id, function (err, result) {
      if (err) {
        res.status(500).json(err);
      } else {
        if (!result)
          res.status(404).send('Reserva não encontrada!');
        else
          res.status(200).send(result);
      }
    });
  });
}