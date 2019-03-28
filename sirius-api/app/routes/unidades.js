module.exports = function (app) {

    var ctrl = app.controllers.unidades;
    app.get('/api/unidades', function (req, res) {
      ctrl.getAll(function(err, result) {
        if (err)
          res.status(500).json(err);
        else
          res.json(result);
      });
    });
  
    app.post('/api/unidades', function(req, res) {
      var unidade = req.body;
      ctrl.post(unidade, function(err, result) {
        if (err) {
          res.status(500).json(err);
        } else {
          res.json(result);
        }
      });
    });
  
    app.delete('/api/unidades/:id', function(req, res) {
      ctrl.delete(req.params.id, function(err, result) {
        if (err) {
          res.status(500).json(err);
        } else {
          if (!result) 
            res.status(404).send('Unidade não encontrada!');
          else
            res.status(200).send(result);
        }
      });
    });
  }