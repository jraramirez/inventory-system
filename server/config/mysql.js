'use strict';

var mysql = require('mysql');

module.exports = mysql.createConnection({
	host     : 'localhost',
	user     : 'psrti',
	password : 'psrti',
	database : 'psrti_inventory',
});
