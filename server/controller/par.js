/**
* PAR controller module
* @module controller/par
*/

'use strict';

var db = require('./../config/mysql');

/**
* Description: Callback function for router for GET /api/par
* Returns an array of json object containing the list of PAR
* End: Sends an array of json object containing the query
* @param {express.Request} req - The request object of express
* @param {express.Response} res - The response object of express
*/
function find(req, res, next) {
	db.query("SELECT * FROM par",function (err,rows) {
		if(err) return next(err);
		res.send(rows);
	});
}
exports.find = find;

/**
* Description: Callback function for router for GET /api/par/:parid
* Returns a json object containing the PAR specified by parid
* End: Sends a json object containing the query
* @param {express.Request} req - The request object of express
* @param {express.Response} res - The response object of express
*/
function findOne(req, res, next) {
	db.query(
		"SELECT * FROM par WHERE id = ?",
		[req.params.parid],
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
function findItemsOfPAR(req, res, next) {
	db.query(
		"SELECT * \
		FROM par_has_item \
		INNER JOIN item \
		ON item.id = par_has_item.item_id \
		WHERE par_has_item.par_id = ? \
		ORDER BY item.id",
		req.params.parid,
		function (err,rows) {
			if(err)
				return next(err);
			res.send(rows);
		}
	);
}
exports.findItemsOfPAR = findItemsOfPAR;

/**
* Description: Callback function for router for POST /api/par/
* Inserts a row to the PAR table of the database
* End:  Sends a json object containing the status of the insertion
* @param {express.Request} req - The request object of express
* @param {express.Response} res - The response object of express
*/
function insert(req, res, next) {
	var PARJSON = req.body;
	db.query(
		"INSERT INTO par SET ?",
		PARJSON,
		function(err,rows){
			if(err) {
				if(err.code === "ER_DUP_ENTRY")
					res.send({success: false, errorMessage: "Duplicate PAR Number"});
				else
					res.status(552).send({success: false,errorMessage: err});
			}
			else
				res.send({success: true, affectedRows: rows.affectedRows});
		});
}
exports.insert = insert;


/**
* Description: Callback function for router for POST /api/par/:par/items
* Inserts an item to the items table and to par_has_item table
* End: Sends a json object containing the status of the insertion
* @param {express.Request} req - The request object of express
* @param {express.Response} res - The response object of express
*/
function addItemToPAR(req, res) {
	var itemJSON = req.body;
	db.query(
		"INSERT INTO par_has_item (par_id, item_id, property_number, current_quantity, quantity_subtracted, price, amount, serviceable) VALUES (?,?,?,?,?,?,?,?)",
		[itemJSON.par_id, itemJSON.item_id, itemJSON.property_number, itemJSON.quantity, itemJSON.quantity_subtracted, itemJSON.price, itemJSON.amount, itemJSON.serviceable],
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
exports.addItemToPAR = addItemToPAR;

/**
* Description: Callback function for router for POST /api/par/:par/items
* Inserts an item to the items table and to par_has_item table
* End: Sends a json object containing the status of the insertion
* @param {express.Request} req - The request object of express
* @param {express.Response} res - The response object of express
*/
function updatePARPIC(req, res) {
	var newPAR = req.body;
	db.query(
		"UPDATE par SET person_in_charge = ?, remarks = ? WHERE id = ?",
		[newPAR.person_in_charge, newPAR.remarks, req.params.parid],
		function(err, rows) {
			if(err) {
				res.status(552).send({success: false, errorMessage: err});
			}
			else {
				res.send({success: true, affectedRows: rows.affectedRows});
			}
		}
	);
}
exports.updatePARPIC = updatePARPIC;

/**
* Description: Callback function for router for POST /api/par/:par/items
* Inserts an item to the items table and to par_has_item table
* End: Sends a json object containing the status of the insertion
* @param {express.Request} req - The request object of express
* @param {express.Response} res - The response object of express
*/
function updatePARItem(req, res) {
	var PARItem = req.body;
	var newValue;
	if(PARItem.value == '1')
		newValue = '0';
	else{
		newValue = '1';
	}

	db.query(
		"UPDATE par_has_item SET serviceable = ? WHERE par_id = ? AND item_id = ?",
		[newValue, req.params.parid, req.params.itemid],
		function(err, rows) {
			if(err) {
				res.status(552).send({success: false, errorMessage: err});
			}
			else {
				res.send({success: true, affectedRows: rows.affectedRows});
			}
		}
	);
}
exports.updatePARItem = updatePARItem;
