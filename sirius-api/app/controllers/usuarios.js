function UsuariosController(app) {
    this._app = app;
    var Usuario = app.models.usuario;

    this.getAll = function (callback) {
        Usuario.find(callback);
    }

    this.getByNome = function (nome, callback) {
        Usuario.find({ nome: new RegExp(nome, "i") }, callback);
    }

    this.get = function (id, callback) {
        Usuario.findById(id, callback);
    }

    this.getByEmail = function (email, callback) {
        Usuario.find({ email: email }, callback);
    }

    this.getBySenha = function (senha, callback) {
        Usuario.find({ senha: senha }, callback);
    }

    this.post = function (usuario, callback) {
        if (usuario.senha) {
            usuario.senha = app.HmacSHA1(usuario.senha);
        }
        this.getBySenha(usuario.senha, function(err, result) {
            if (err) {
                callback(err, null);
                return;
            }
            if (result && result.length) {
                callback('Já existe um usuário cadastrado com essa senha!', null);
                return;
            }
            new Usuario(usuario).save(callback);
        });
    }

    this.put = function (id, usuario, callback) {
        if (usuario.senha) {
            usuario.senha = app.HmacSHA1(usuario.senha);
        }
        this.getBySenha(usuario.senha, function(err, result) {
            if (err) {
                callback(err, null);
                return;
            }
            if (result && result.length) {
                callback('Já existe um usuário cadastrado com essa senha!', null);
                return;
            }
            Usuario.findByIdAndUpdate(id, usuario, callback);
        });
    }

    this.delete = function (id, callback) {
        Usuario.findByIdAndDelete(id, callback);
    }

    this.resetSenha = function (id, callback) {
        Usuario.findByIdAndUpdate(id, { $unset: { senha: 1 }}, callback);
    }
}

module.exports = function (app) {
    return new UsuariosController(app);
}