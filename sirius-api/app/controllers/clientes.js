function ClientesController(app) {
    this._app = app;
    var Cliente = app.models.cliente;
    
    this.getAll = function(callback) {
        Cliente.find({}).sort('nome').exec(callback);
    }

    this.get = function(id, callback) {
        Cliente.findById(id, callback);
    }

    this.getByNome = function(nome, callback) {
        Cliente.find({nome: new RegExp(nome, "i")}).sort('nome').exec(callback);
    }

    this.getByTelefone = function(telefone, callback) {
        Cliente.find({ $or: [
            { fone1: new RegExp(telefone) },
            { fone2: new RegExp(telefone) }
        ]}).sort('nome').exec(callback);
    }

    this.post = function(cliente, callback) {
        new Cliente(cliente).save(callback);
    }

    this.put = function(id, cliente, callback) {
        Cliente.findByIdAndUpdate(id, cliente, callback);
    }

    this.delete = function(id, callback) {
        Cliente.findByIdAndDelete(id, callback);
    }
}

module.exports = function(app) {
    return new ClientesController(app);
}