var express = require('express');
var consign = require('consign');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var expressSession = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(expressSession);
var cors = require('cors');
var moment = require('moment');
var HmacSHA1 = require("crypto-js/hmac-sha1");

var async = require('async');

require('dotenv').config();

/* iniciar o objeto do express */
var app = express();
app.moment = moment;
app.HmacSHA1 = function (value) {
	return HmacSHA1(value, "asd88**oifds-fa=asdf938jelo").toString();
};
app.async = async;

/* configurar o middleware body-parser */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

/* Configuração de CORS */
app.use(cors({
	origin: [
		"http://localhost:4200"
	], credentials: true
}));

/* configura o middleware express-session */
var config = require('./app/config/config.js');
var store = new MongoDBStore({
	uri: process.env['NODE_ENV'] === 'prod' ? config.connectionStringProd : config.connectionStringDev,
	collection: 'sessions'
});

app.use(expressSession({
	secret: 'sdfoi21398s32=*sdfo**',
	resave: false,
	saveUninitialized: true,
	store: store,
	cookie: {
		maxAge: 24 * 60 * 60 * 1000
	}
}));

/* configurar o middleware express-validator */
app.use(expressValidator());

var protectedRoutes = ['/usuarios', '/clientes', '/pedidos', '/reservas', '/cardapio', '/usuario'];
protectedRoutes.forEach(function (route) {
	app.use(route, function (req, res, next) {
		if (req.session.usuario && req.session.usuario.autorizado) {
			next();
		} else
			res.status(401).send("Usuário não autenticado!");
	});
});

var adminRoutes = [{
	url: '/usuarios',
	methods: ['post', 'put', 'delete']
}, {
	url: '/cardapio',
	methods: ['post', 'put', 'delete']
}];

adminRoutes.forEach(function (route) {
	app.use(route.url, function (req, res, next) {
		if (route.methods.indexOf(req.method.toLowerCase()) >= 0) {
			if (req.session.usuario && req.session.usuario.autorizado && req.session.usuario.perfil == "Administrador")
				next();
			else
				res.status(403).send("Usuário sem permissão!");
		} else {
			next();
		}
	});
});

/* efetua o autoload das rotas, dos models e dos controllers para o objeto app */
consign({ cwd: 'app' })
	.include('config')
	.then('models')
	.then('controllers')
	.then('routes')
	.into(app);

// Configura o redirecionamento para páginas estáticas
var allowedExt = [
	'.js',
	'.ico',
	'.css',
	'.png',
	'.jpg',
	'.woff2',
	'.woff',
	'.ttf',
	'.svg',
];
var path = require('path');

app.get('*', (req, res, next) => {
    if (req.headers['x-forwarded-proto'] != 'https' && process.env['NODE_ENV'] === 'prod') {
		// check if the header returns HTTP or HTTPS
        res.redirect("https://" + req.headers.host + req.url);
		// redirects to HTTPS
    } else {
        next();
		// continues executing the file
    }
});

app.get('*', function (req, res) {
	if (allowedExt.filter(ext => req.url.indexOf(ext) > 0).length > 0) {
		res.sendFile(path.resolve(`public/${req.url}`));
	} else {
		res.sendFile(path.resolve('public/index.html'));
	}
});

/* parametrizar a porta de escuta */
app.listen(process.env.PORT || 3000, function () {
	console.log('Servidor online');
});
