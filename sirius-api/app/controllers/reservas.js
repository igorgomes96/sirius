function ReservasController(app) {
    this._app = app;
    var Reserva = app.models.reserva;
    
    this.getAll = function(callback) {
        Reserva.find(callback);
    }

    this.get = function(id, callback) {
        Reserva.findById(id, callback);
    }

    this.getByData = function(data, callback) {
        data = app.moment(new Date(data)).startOf('day').toDate();
        Reserva.find({ data: data }, callback);
    }

    this.post = function(reserva, callback) {
        reserva.data = app.moment(new Date(reserva.data)).startOf('day').toDate();
        new Reserva(reserva).save(callback);
    }

    this.put = function(id, reserva, callback) {
        reserva.data = app.moment(new Date(reserva.data)).startOf('day').toDate();
        Reserva.findByIdAndUpdate(id, reserva, callback);
    }

    this.delete = function(id, callback) {
        Reserva.findByIdAndDelete(id, callback);
    }
}

module.exports = function(app) {
    return new ReservasController(app);
}