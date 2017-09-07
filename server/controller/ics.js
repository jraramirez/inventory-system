/**
* ICS controller module
* @module controller/ics
*/

'use strict';

var db = require('./../config/mysql');

/**
* Description: Callback function for router for GET /api/ics
* Returns an array of json object containing the list of ICS
* End: Sends an array of json object containing the query
* @param {express.Request} req - The request object of express
* @param {express.Response} res - The response object of express
*/
function find(req, res, next) {
	db.query("SELECT * FROM ics",function (err,rows) {
		if(err) return next(err);
		res.send(rows);
	});
}
exports.find = find;

/**
* Description: Callback function for router for GET /api/ics/:icsid
* Returns a json object containing the ICS specified by icsid
* End: Sends a json object containing the query
* @param {express.Request} req - The request object of express
* @param {express.Response} res - The response object of express
*/
function findOne(req, res, next) {
	db.query(
		"SELECT * FROM ics WHERE id = ?",
		[req.params.icsid],
		function (err,rows) {
			if(err) return next(err);
			res.send(rows);
		});
}
exports.findOne = findOne;

/**
* Description: Callback function for router for GET /api/dr/:drid/items
* Retrieves the data containing the items of a certain delivery receipt specified by drid
* End: Sends an array of JSON object containing the result
* @param {express.Request} req - The request object of express
* @param {express.Response} res - The response object of express
*/
function findItemsOfICS(req, res, next) {
	db.query(
		"SELECT * \
		FROM ics_has_item \
		INNER JOIN item \
		ON item.id = ics_has_item.item_id \
		WHERE ics_has_item.ics_id = ? \
		ORDER BY item.id",
		req.params.icsid,
		function (err,rows) {
			if(err)
				return next(err);
			res.send(rows);
		}
	);
}
exports.findItemsOfICS = findItemsOfICS;

/**
* Description: Callback function for router for POST /api/ics/
* Inserts a row to the ICS table of the database
* End:  Sends a json object containing the status of the insertion
* @param {express.Request} req - The request object of express
* @param {express.Response} res - The response object of express
*/
function insert(req, res, next) {
	var ICSJSON = req.body;
	db.query(
		"INSERT INTO ics SET ?",
		ICSJSON,
		function(err,rows){
			if(err) {
				if(err.code === "ER_DUP_ENTRY")
					res.send({success: false, errorMessage: "Duplicate ICS Number"});
				else
					res.status(552).send({success: false,errorMessage: err});
			}
			else
				res.send({success: true, affectedRows: rows.affectedRows});
		});
}
exports.insert = insert;


/**
* Description: Callback function for router for POST /api/ics/:ics/items
* Inserts an item to the items table and to ics_has_item table
* End: Sends a json object containing the status of the insertion
* @param {express.Request} req - The request object of express
* @param {express.Response} res - The response object of express
*/
function addItemToICS(req, res) {
	var itemJSON = req.body;
	db.query(
		"INSERT INTO ics_has_item (ics_id, item_id, quantity_subtracted, price, amount) VALUES (?,?,?,?,?)",
		[itemJSON.ics_id, itemJSON.item_id, itemJSON.quantity_subtracted, itemJSON.price, itemJSON.amount],
		function(err, rows) {
			
			if(err) {
				res.status(522).send({success: false, errorMessage: err});
			}
			else {
				res.send({success: true, affectedRows: rows.affectedRows});
			}
		}
	);
}
exports.addItemToICS = addItemToICS;
