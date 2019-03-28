function CardapioController(app) {
    this._app = app;
    var ItemCardapio = app.models.itemCardapio;
    
    this.getAll = function(callback) {
        ItemCardapio.find({}).sort('nome').exec(callback);
    }

    this.getByNome = function(nome, callback) {
        ItemCardapio.find({nome: new RegExp(nome, "i")}).sort('nome').exec(callback);
    }

    this.get = function(id, callback) {
        ItemCardapio.findById(id, callback);
    }

    this.post = function(item, callback) {
        new ItemCardapio(item).save(callback);
    }

    this.put = function(id, item, callback) {
        ItemCardapio.findByIdAndUpdate(id, item, callback);
    }

    this.delete = function(id, callback) {
        ItemCardapio.findByIdAndDelete(id, callback);
    }
}

module.exports = function(app) {
    return new CardapioController(app);
}