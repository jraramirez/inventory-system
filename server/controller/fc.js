/**
* Fund Cluster controller module
* @module controller/dr
*/


'use strict';

var db = require('./../config/mysql');

/**
* Description: Callback function for router for GET /api/fc
* Returns the contents of table fund_cluster
* End: Sends an array of JSON object containing the query
* @param {express.Request} req - The request object of express
* @param {express.Response} res - The response object of express
*/
function find(req, res, next) {
	db.query("SELECT * FROM fund_cluster",function (err,rows) {
		if(err) return next(err);
		res.send(rows);
	});
}
exports.find = find;

/**
* Description: Callback function for router for GET /api/fc/:fund_cluster
* Returns the data of fund_cluster with name fund fund_cluster_name
* End: Sends a JSON object containing the query
* @param {express.Request} req - The request object of express
* @param {express.Response} res - The response object of express
*/
function findOne(req, res, next) {
	db.query(
		"SELECT * FROM fund_cluster WHERE fund_cluster_name = ?",
		[req.params.fund_cluster_name],
		function (err,rows) {
			if(err) return next(err);
			res.send(rows);
		});
}
exports.findOne = findOne;

/**
* Description: Callback function for router for GET /api/fc/:fund_cluster/:item_id
* Returns the data of an item with id item_id under fund cluster with name fund_cluster_name
* End: Sends a JSON object containing the query
* @param {express.Request} req - The request object of express
* @param {express.Response} res - The response object of express
*/
function findOneFCItem(req, res, next) {
	db.query(
		"SELECT * FROM fund_cluster_has_item WHERE fund_cluster_name = ? AND item_id = ?",
		[req.params.fund_cluster_name, req.params.item_id],
		function (err,rows) {
			if(err) return next(err);
			res.send(rows);
		});
}
exports.findOneFCItem = findOneFCItem;

/**
* Description: Callback function for router for GET /api/fc/:fund_cluster/items
* Returns the data of all the items under fund cluster with name fund_cluster_name
* End: Sends a JSON object containing the query
* @param {express.Request} req - The request object of express
* @param {express.Response} res - The response object of express
*/
function findFCItems(req, res, next) {
	db.query(
		"SELECT * \
		FROM fund_cluster_has_item \
		INNER JOIN item \
		ON item.id = fund_cluster_has_item.item_id \
		WHERE fund_cluster_has_item.fund_cluster_name = ? \
		ORDER BY item.id",
		[decodeURIComponent(req.params.fund_cluster_name)],
		function (err,rows) {
			if(err) return next(err);
			res.send(rows);
		});
}
exports.findFCItems = findFCItems;

/**
* Description: Callback function for router for GET /api/fc/:fund_cluster/delivery_receipts
* Returns the data of all delivery receipts under fund cluster with name fund_cluster_name
* End: Sends a JSON object containing the query
* @param {express.Request} req - The request object of express
* @param {express.Response} res - The response object of express
*/
function findFCDRs(req, res, next) {
	db.query(
		"SELECT * \
		FROM delivery_receipt \
		WHERE fund_cluster_name = ?",
		[decodeURIComponent(req.params.fund_cluster_name)],
		function (err,rows) {
			if(err) return next(err);
			res.send(rows);
		});
}
exports.findFCDRs = findFCDRs;

/**
* Description: Callback function for router for GET /api/fc/:fund_cluster_name/:date/riss
* Returns the data of all RISs under fund cluster with name fund_cluster_name and within the year and month selected
* End: Sends a JSON object containing the query
* @param {express.Request} req - The request object of express
* @param {express.Response} res - The response object of express
*/
function findFCMonthRISs(req, res, next) {
	db.query(
		"SELECT * FROM ris WHERE delivery_receipt_fund_cluster_name = ? AND MONTH(date_added) = MONTH(?) AND YEAR(date_added) = YEAR(?)",
		[decodeURIComponent(req.params.fund_cluster_name), decodeURIComponent(req.params.date), decodeURIComponent(req.params.date)],
		function (err,rows) {
			if(err) return next(err);
			res.send(rows);
		});
}
exports.findFCMonthRISs = findFCMonthRISs;

/**
* Description: Callback function for router for GET /api/fc/:fund_cluster_name/:date/icss
* Returns the data of all ICSs under fund cluster with name fund_cluster_name and within the year and month selected
* End: Sends a JSON object containing the query
* @param {express.Request} req - The request object of express
* @param {express.Response} res - The response object of express
*/
function findFCMonthICSs(req, res, next) {
	db.query(
		"SELECT * FROM ics WHERE delivery_receipt_fund_cluster_name = ? AND MONTH(date_added) BETWEEN MONTH(?) AND MONTH(?) AND YEAR(date_added) = YEAR(?)",
		[decodeURIComponent(req.params.fund_cluster_name), decodeURIComponent(req.params.start_month), decodeURIComponent(req.params.end_month), decodeURIComponent(req.params.end_month)],
		function (err,rows) {
			if(err) return next(err);
			res.send(rows);
		});
}
exports.findFCMonthICSs = findFCMonthICSs;


/**
* Description: Callback function for router for GET /api/fc/:fund_cluster_name/:date/icss
* Returns the data of all ICSs under fund cluster with name fund_cluster_name and within the year and month selected
* End: Sends a JSON object containing the query
* @param {express.Request} req - The request object of express
* @param {express.Response} res - The response object of express
*/
function findFCYearPARs(req, res, next) {
	db.query(
		"SELECT * FROM par_has_item INNER JOIN par ON par.delivery_receipt_fund_cluster_name = ? AND YEAR(par.date_added) = YEAR(?) WHERE serviceable = 1",
		// "SELECT * FROM par WHERE delivery_receipt_fund_cluster_name = ? AND YEAR(date_added) = YEAR(?)",
		[decodeURIComponent(req.params.fund_cluster_name), decodeURIComponent(req.params.year)],
		function (err,rows) {
			if(err) return next(err);
			res.send(rows);
		});
}
exports.findFCYearPARs = findFCYearPARs;


/**
* Description: Callback function for router for POST /api/fc/:fund_cluster_name/:item_id
* Inserts the item data of item_id under fund cluster with name fund_cluster_name to the fund_cluster_has_item table
* End: Sends a JSON object containing the status of the insert
* @param {express.Request} req - The request object of express
* @param {express.Response} res - The response object of express
*/
function addItemToFC(req, res, next) {
	var itemJSON = req.body;

	db.query(
		"INSERT INTO fund_cluster_has_item \
			(fund_cluster_name, \
			item_id, \
			quantity, \
			price, \
			amount) \
			VALUES (?, ?, ?, ?, ?)",
		[decodeURIComponent(req.params.fund_cluster_name),
		req.params.item_id,
		itemJSON.quantity,
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
exports.addItemToFC = addItemToFC;

/**
* Description: Callback function for router for POST /api/fc/update/:fund_cluster_name/:item_id
* Updates the item data of item_id under fund cluster with name fund_cluster_name to the fund_cluster_has_item table
* End: Sends a JSON object containing the status of update
* @param {express.Request} req - The request object of express
* @param {express.Response} res - The response object of express
*/
function updateFCItem(req, res, next) {
	var itemJSON = req.body;
	db.query(
		"UPDATE fund_cluster_has_item \
		SET quantity = quantity + ?,\
		price = ?,\
		amount = quantity * price\
		WHERE fund_cluster_name = ? AND item_id = ?",
		[itemJSON.quantity,
		itemJSON.price,
		decodeURIComponent(req.params.fund_cluster_name),
		itemJSON.id,
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
exports.updateFCItem = updateFCItem;

/**
* Description: Callback function for router for POST /api/fc/update/:fund_cluster_name
* Updates the fund cluster with name fund_cluster_name
* End: Sends a JSON object containing the status of the update
* @param {express.Request} req - The request object of express
* @param {express.Response} res - The response object of express
*/
function updateFC(req, res, next) {
	var DRJSON = req.body;
	var decoded_fund_cluster_name = decodeURIComponent(req.params.fund_cluster_name);
	db.query("UPDATE fund_cluster \
	SET total_amount = total_amount + ?,\
	total_quantity = total_quantity + ?\
	WHERE name = ?",
	[DRJSON.total_amount, DRJSON.total_quantity, decoded_fund_cluster_name],
	function(err, rows) {
		if(err) {
			res.send({success: false, errorMessage: "Cannot Update Fund Cluster Quantity"});
		}
		else {
			res.send({success: true, affectedRows: rows.affectedRows});
		}
	});
}
exports.updateFC = updateFC;
