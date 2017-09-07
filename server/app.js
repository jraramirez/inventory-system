'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var session = require('express-session');

var setRoutes = require('./config/router');

var app = express();

app.use(morgan('dev'));

app.use(session({
	secret: "secret",
	resave: true,
	saveUninitialized: false
}));

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.use(setRoutes(express.Router()));
app.use(express.static('./client'));

var server = app.listen(3001, function() {
	console.log('App running at port 3001');

});
