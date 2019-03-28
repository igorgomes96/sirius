function UnidadesController(app) {
    this._app = app;
    var Unidade = app.models.unidade;
    
    this.getAll = function(callback) {
        Unidade.find(callback);
    }

    this.post = function(unidade, callback) {
        new Unidade(unidade).save(callback);
    }

    this.delete = function(id, callback) {
        Unidade.findByIdAndDelete(id, callback);
    }
}

module.exports = function(app) {
    return new UnidadesController(app);
}