module.exports = function (app) {

	var ctrl = app.controllers.usuarios;
	app.get('/api/', function (req, res) {
		res.send('Salgados Sirius');
	});

	app.post('/api/login', function (req, res) {
		var credenciais = req.body;
		ctrl.getBySenha(app.HmacSHA1(credenciais.senha), function (err, result) {
			if (err) {
				res.status(500).json(err);
			} else if (!result || result.length == 0)  {
				res.status(404).send('Usuário não cadastrado!');
			} else {
				var usuario = result[0];
				req.session.usuario = {
					email: usuario.email,
					nome: usuario.nome,
					perfil: usuario.perfil,
					autorizado: true
				};
				res.json(req.session.usuario);
			}
		});
		/*ctrl.getByEmail(credenciais.email, function (err, result) {
			if (err) {
				res.status(500).json(err);
			} else if (!result || result.length == 0)
				res.status(404).send('Usuário não cadastrado!');
			else {
				var usuario = result[0];
				if (usuario.hasOwnProperty('senha') || !usuario.senha) {
					res.status(404).send('Ainda não foi cadastrada uma senha para esse usuário!');
					return;
				}
				if (usuario.senha === app.HmacSHA1(credenciais.senha)) {
					req.session.usuario = {
						email: usuario.email,
						nome: usuario.nome,
						perfil: usuario.perfil,
						autorizado: true
					};
					res.json(req.session.usuario);
				} else
					res.status(400).send('Senha incorreta!');
			}
		});
		res.json(req.session.usuario);*/
	});

	app.post('/api/cadastrarsenha', function (req, res) {
		var credenciais = req.body;
		ctrl.getByEmail(credenciais.email, function (err, result) {
			if (err) {
				res.status(500).json(err);
			} else if (!result || result.length == 0)
				res.status(404).send('Usuário não cadastrado!');
			else {
				var usuario = result[0];
				if (usuario.senha) {
					res.status(400).send('Já existe uma senha cadastrada para essa usuário!');
					return;
				}
				usuario.senha = credenciais.senha;
				ctrl.put(usuario._id, usuario, function (err, result) {
					if (err) {
						res.status(500).json(err);
					} else {
						res.status(200).send(result);
					}
				})
			}
		});
	});

	app.get('/api/usuario', function (req, res) {
		if (req.session)
			res.json(req.session.usuario);
		else
			res.json(null);
	});

	app.post('/api/resetsenha', function (req, res) {
		var id = req.body.id;
		ctrl.resetSenha(id, function (err, result) {
			if (err) {
				res.send(err);
				return;
			}
			res.status(200).send({ msg: 'A senha do usuário foi redefinida!' });
		});
	});
}