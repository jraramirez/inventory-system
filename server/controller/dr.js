/**
* Delivery Receipt controller module
* @module controller/dr
*/

'use strict';

var db = require('./../config/mysql');

/**
* Description: Callback function for router for GET /api/dr
* Returns the contents of table delivery_receipt
* End: Sends an array of JSON object containing the query
* @param {express.Request} req - The request object of express
* @param {express.Response} res - The response object of express
*/
function find(req, res, next) {
	db.query("SELECT * FROM delivery_receipt",function (err,rows) {
		if(err) return next(err);
		res.send(rows);
	});
}
exports.find = find;

/**
* Description: Callback function for router for GET /api/dr/:drid
* Returns the data of delivery_receipt with delivery_receipt_id drid
* End: Sends a JSON object containing the query
* @param {express.Request} req - The request object of express
* @param {express.Response} res - The response object of express
*/
function findOne(req, res, next) {
	db.query(
		"SELECT * FROM delivery_receipt WHERE id = ?",
		[req.params.drid],
		function (err,rows) {
			if(err) return next(err);
			res.send(rows);
		});
}
exports.findOne = findOne;

/**
* Description: Callback function for router for POST /api/dr
* Inserts a row to table delivery_receipt
* End: Sends a JSON object containing the status of the insert
* @param {express.Request} req - The request object of express
* @param {express.Response} res - The response object of express
*/
function insert(req, res) {
	var drJSON = req.body;
	db.query(
		"INSERT INTO delivery_receipt (id, fund_cluster_name, total_quantity, total_amount, date_added) VALUES (?, ?, ?, ?, ?)",
		[drJSON.id, drJSON.fund_cluster_name, drJSON.total_quantity, drJSON.total_amount, drJSON.date_added],
		function (err,rows) {
			
			if(err){
				res.status(552).send({success: false,errorMessage: err});
			}
			else
				res.send({success: true, affectedRows: rows.affectedRows});
		});
}
exports.insert = insert;

/**
* Description: Callback function for router for GET /api/dr/:drid/items
* Retrieves the data containing the items of a certain delivery receipt specified by drid
* End: Sends an array of JSON object containing the result
* @param {express.Request} req - The request object of express
* @param {express.Response} res - The response object of express
*/
function findItemsOfDR(req, res, next) {
	db.query(
		"SELECT * \
		FROM delivery_receipt_has_item \
		INNER JOIN item \
		ON item.id = delivery_receipt_has_item.item_id \
		WHERE delivery_receipt_has_item.delivery_receipt_id = ? \
		ORDER BY item.id",
		req.params.drid,
		function (err,rows) {
			if(err)
				return next(err);
			res.send(rows);
		}
	);
}
exports.findItemsOfDR = findItemsOfDR;

/**
* Description: Callback function for router for GET /api/deliveryreceipts/apr/:aprid/item/:itemid
* Retrieves the data containing delivery receipts of a certain item (itemid) under some apr (aprid)
* End: Sends an array of JSON object containing the result
* @param {express.Request} req - The request object of express
* @param {express.Response} res - The response object of express
*/
function findDROfAPROfItems(req, res, next) {
	db.query(
		"SELECT * \
		FROM apr_has_item_has_delivery_report \
		INNER JOIN item \
		ON item.id = apr_has_item_has_delivery_report.apr_has_item_item_id \
		WHERE \
			apr_has_item_has_delivery_report.delivery_report_apr_id_number = ? \
				AND apr_has_item_has_delivery_report.apr_has_item_item_id = ? \
		ORDER BY apr_has_item_has_delivery_report.delivery_report_id_number",
		[req.params.aprid, req.params.itemid],
		function (err,rows) {
			if(err)
				return next(err);
			res.send(rows);
		}
	);
}
exports.findDROfAPROfItems = findDROfAPROfItems;

/**
* Description: Callback function for router for POST /api/dr/:drid/items
* Inserts a row to table delivery_receipt_has_item
* End: Sends a JSON object containing the status of the insert
* @param {express.Request} req - The request object of express
* @param {express.Response} res - The response object of express
*/
function addItemToDR(req, res, next) {
	var itemJSON = req.body;

	db.query(
		"INSERT INTO delivery_receipt_has_item \
			(delivery_receipt_id, \
			item_id, \
			quantity_added, \
			price, \
			amount) \
			VALUES (?, ?, ?, ?, ?)",
		[req.params.drid,
		itemJSON.id,
		itemJSON.quantity_added,
		itemJSON.price,
		itemJSON.amount
		],
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
exports.addItemToDR = addItemToDR;
