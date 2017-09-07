/**
* RIS controller module
* @module controller/ris
*/

'use strict';

var db = require('./../config/mysql');

/**
* Description: Callback function for router for GET /api/ris
* Returns an array of json object containing the list of RIS
* End: Sends an array of json object containing the query
* @param {express.Request} req - The request object of express
* @param {express.Response} res - The response object of express
*/
function find(req, res, next) {
	db.query("SELECT * FROM ris",function (err,rows) {
		if(err) return next(err);
		res.send(rows);
	});
}
exports.find = find;

/**
* Description: Callback function for router for GET /api/ris/:risid
* Returns a json object containing the RIS specified by risid
* End: Sends a json object containing the query
* @param {express.Request} req - The request object of express
* @param {express.Response} res - The response object of express
*/
function findOne(req, res, next) {
	db.query(
		"SELECT * FROM ris WHERE id = ?",
		[req.params.risid],
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
function findItemsOfRIS(req, res, next) {
	db.query(
		"SELECT * \
		FROM ris_has_item \
		INNER JOIN item \
		ON item.id = ris_has_item.item_id \
		WHERE ris_has_item.ris_id = ? \
		ORDER BY item.id",
		req.params.risid,
		function (err,rows) {
			if(err)
				return next(err);
			res.send(rows);
		}
	);
}
exports.findItemsOfRIS = findItemsOfRIS;

/**
* Description: Callback function for router for POST /api/ris/
* Inserts a row to the RIS table of the database
* End:  Sends a json object containing the status of the insertion
* @param {express.Request} req - The request object of express
* @param {express.Response} res - The response object of express
*/
function insert(req, res, next) {
	var RISJSON = req.body;
	db.query(
		"INSERT INTO ris SET ?",
		RISJSON,
		function(err,rows){
			if(err) {
				if(err.code === "ER_DUP_ENTRY")
					res.send({success: false, errorMessage: "Duplicate RIS Number"});
				else
					res.status(552).send({success: false,errorMessage: err});
			}
			else
				res.send({success: true, affectedRows: rows.affectedRows});
		});
}
exports.insert = insert;


/**
* Description: Callback function for router for POST /api/ris/:ris/items
* Inserts an item to the items table and to ris_has_item table
* End: Sends a json object containing the status of the insertion
* @param {express.Request} req - The request object of express
* @param {express.Response} res - The response object of express
*/
function addItemToRIS(req, res) {
	var itemJSON = req.body;
	db.query(
		"INSERT INTO ris_has_item (ris_id, item_id, current_quantity, quantity_subtracted, price, amount) VALUES (?,?,?,?,?,?)",
		[itemJSON.ris_id, itemJSON.item_id,  itemJSON.quantity, itemJSON.quantity_subtracted, itemJSON.price, itemJSON.amount],
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
exports.addItemToRIS = addItemToRIS;
