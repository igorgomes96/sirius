function CardapioController(app) {
    this._app = app;
    var ItemCardapio = app.models.itemCardapio;
    
    this.getAll = function(callback) {
        ItemCardapio.find({}).sort('ordem').exec(callback);
    }

    this.getByNome = function(nome, callback) {
        ItemCardapio.find({nome: new RegExp(nome, "i")}).sort('ordem').exec(callback);
    }

    this.get = function(id, callback) {
        ItemCardapio.findById(id, callback);
    }

    this.post = function(item, callback) {
        ItemCardapio.count({}, function(err, count) {
            if (err) {
                callback(err, null);
                return;
            }
            item.ordem = count + 1;
            new ItemCardapio(item).save(callback);
        });
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