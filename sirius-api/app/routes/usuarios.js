module.exports = function (app) {

    var ctrl = app.controllers.usuarios;
    app.get('/api/usuarios', function (req, res) {
        if (req.query.hasOwnProperty('nome')) {
            ctrl.getByNome(req.query['nome'], function (err, result) {
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

    app.get('/api/usuarios/:id', function (req, res) {
        ctrl.get(req.params.id, function (err, result) {
            if (err)
                res.status(500).json(err);
            else {
                if (!result)
                    res.status(404).send('Usuário não encontrado!');
                else
                    res.json(result);
            }
        });
    });

    app.post('/api/usuarios', function (req, res) {
        var cliente = req.body;
        ctrl.post(cliente, function (err, result) {
            if (err) {
                res.status(500).json(err);
            } else {
                res.json(result);
            }
        });
    });

    app.put('/api/usuarios/:id', function (req, res) {
        var cliente = req.body;
        ctrl.put(req.params.id, cliente, function (err, result) {
            if (err) {
                res.status(500).json(err);
            } else {
                if (!result)
                    res.status(404).send('Usuário não encontrado!');
                else
                    res.status(204).send();
            }
        });
    });

    app.delete('/api/usuarios/:id', function (req, res) {
        ctrl.delete(req.params.id, function (err, result) {
            if (err) {
                res.status(500).json(err);
            } else {
                if (!result)
                    res.status(404).send('Usuário não encontrado!');
                else
                    res.status(200).send(result);
            }
        });
    });
}