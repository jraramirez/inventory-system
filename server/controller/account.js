/**
* Account controller module
* @module controller/account
*/

'use strict';

var db = require('./../config/mysql');
var password = require('password-hash-and-salt');

/**
* Description: Callback function for router for GET /api/accounts/login
* Checks if the account is valid for login
* End: Sends a json object containing the status of the login
* @param {express.Request} req - The request object of express
* @param {express.Response} res - The response object of express
*/
function login(req, res) {
	var accountJSON = req.body;
	db.query(
		"SELECT * FROM accounts WHERE username = ?",
		[accountJSON.username],
		function (err,rows) {
			if(err)
				res.status(552).send({success: false, error: err});
			else {
				if(rows.length == 0)
					res.send({success: false, error: "Invalid username or password 0"})
				else {
					password(accountJSON.password).verifyAgainst(rows[0].password, function(error, verified) {                        
                        if(error)
                            res.send({success: false, error: "Invalid username or password 1"});
                        if(!verified) {
                            res.send({success: false, error: "Invalid username or password 2"});
                        } else {
							req.session.isLoggedIn = true;
							res.send({success: true, account: rows[0]});
                        }
                    });
				}
			}
		}
	);
}
exports.login = login;

/**
* Description: Callback function for router for POST /api/accounts/register
* Used for adding an account to the database
* End: Sends a json object containing the status of the registration
* @param {express.Request} req - The request object of express
* @param {express.Response} res - The response object of express
*/
function register(req, res) {
	var accountJSON = req.body;

    password(accountJSON.password).hash(function(error, hash) {
        accountJSON.password = hash;
        db.query(
            "INSERT INTO accounts SET ?",
            accountJSON,
            function(err,rows){
                if(err)
                    res.status(552).send({success: false,errorMessage: err});
                else
                    res.send({success: true, affectedRows: rows.affectedRows, insertId: rows.insertId});
            }
        );
    });
}
exports.register = register;

/**
* Description: Callback function for router for POST /api/accounts/check
* Used for psersistent login in the application
* End:  Sends a json object containing the status of the login
* @param {express.Request} req - The request object of express
* @param {express.Response} res - The response object of express
*/
function checkLogIn(req, res) {
	var isLoggedIn = req.session.isLoggedIn;
	if(!isLoggedIn)
		res.send({success: false});
	else
		res.send({success: true});
}
exports.checkLogIn = checkLogIn;

/**
* Description: Callback function for router for POST /api/accounts/logout
* Used the logout the session and destroy the session
* End:  Sends a json object containing the status of the logout
* @param {express.Request} req - The request object of express
* @param {express.Response} res - The response object of express
*/
function logout(req, res) {
	req.session.destroy();
	res.send({success: true});
}
exports.logout = logout;
