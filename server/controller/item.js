/**
* Item controller module
* @module controller/item
*/

'use strict';

var db = require('./../config/mysql');

/**
* Description: Callback function for router for GET /api/items
* Returns an array of json object containing the list of items
* End: Sends an array of json object containing the query
* @param {express.Request} req - The request object of express
* @param {express.Response} res - The response object of express
*/
function find(req, res, next) {
	db.query("SELECT * FROM item",
		function (err,rows) {
		if(err) return next(err);
		res.send(rows);
	});
}
exports.find = find;

/**
* Description: Callback function for router for GET /api/items
* Returns an array of json object containing the list of items
* End: Sends an array of json object containing the query
* @param {express.Request} req - The request object of express
* @param {express.Response} res - The response object of express
*/
function findNotArchived(req, res, next) {
	db.query("SELECT * FROM item WHERE isnull(isArchived) OR isArchived = ?",
		[0],
		function (err,rows) {
		if(err) return next(err);
		res.send(rows);
	});
}
exports.findNotArchived = findNotArchived;

/**
* Description: Callback function for router for GET /api/items/:item/:fund_cluster_name/drriss
* Retrieves the data containing the delivery receipts and riss of a certain item specified by item_id of a fund cluster specified fund_cluster_name
* End: Sends an array of JSON object containing the result
* @param {express.Request} req - The request object of express
* @param {express.Response} res - The response object of express
*/
function findDRsAndRISsOfFCItem(req, res, next) {
	db.query(
		"SELECT * FROM delivery_receipt \
		INNER JOIN ris ON ris.delivery_receipt_id = delivery_receipt.id \
		INNER JOIN ris_has_item ON ris.id = ris_has_item.ris_id \
		INNER JOIN delivery_receipt_has_item ON delivery_receipt.id = delivery_receipt_has_item.delivery_receipt_id \
		WHERE ris_has_item.item_id = ? AND delivery_receipt_has_item.item_id = ? AND delivery_receipt.fund_cluster_name = ?",
		[req.params.item_id, req.params.item_id, decodeURIComponent(req.params.fund_cluster_name)],
		function (err,rows) {
			if(err)
				return next(err);
			res.send(rows);
		}
	);
}
exports.findDRsAndRISsOfFCItem = findDRsAndRISsOfFCItem;

/**
* Description: Callback function for router for GET /api/items/:item/:fund_cluster_name/drpars
* Retrieves the data containing the delivery receipts and pars of a certain item specified by item_id of a fund cluster specified fund_cluster_name
* End: Sends an array of JSON object containing the result
* @param {express.Request} req - The request object of express
* @param {express.Response} res - The response object of express
*/
function findDRsAndPARsOfFCItem(req, res, next) {
	db.query(
		"SELECT * FROM delivery_receipt \
		INNER JOIN par ON par.delivery_receipt_id = delivery_receipt.id \
		INNER JOIN par_has_item ON par.id = par_has_item.par_id \
		INNER JOIN delivery_receipt_has_item ON delivery_receipt.id = delivery_receipt_has_item.delivery_receipt_id \
		WHERE par_has_item.item_id = ? AND delivery_receipt_has_item.item_id = ? AND delivery_receipt.fund_cluster_name = ?",
		[req.params.item_id, req.params.item_id, decodeURIComponent(req.params.fund_cluster_name)],
		function (err,rows) {
			if(err)
				return next(err);
			res.send(rows);
		}
	);
}
exports.findDRsAndPARsOfFCItem = findDRsAndPARsOfFCItem;

/**
* Description: Callback function for router for GET /api/items/details/:description
* Retrieves the data containing the  of a certain item specified by idescription
* End: Sends an array of JSON object containing the result
* @param {express.Request} req - The request object of express
* @param {express.Response} res - The response object of express
*/
function findItemDetails(req, res, next) {
	var decoded = decodeURIComponent(req.params.description);

	db.query("SELECT * FROM item WHERE description = ?",
	[decoded],
	function (err,rows) {
		if(err) return next(err);
		res.send(rows[0]);
	});
}
exports.findItemDetails = findItemDetails;

/**
* Description: Callback function for router for GET /api/items/:itemid
* Returns a json object containing the item specified by itemid
* End: Sends a json object containing the query
* @param {express.Request} req - The request object of express
* @param {express.Response} res - The response object of express
*/
function findOne(req, res, next) {
	db.query(
		"SELECT * FROM item WHERE id = ?",
		[req.params.itemid],
		function (err,rows) {
			if(err) return next(err);
			res.send(rows);
		});
}
exports.findOne = findOne;

function findByCategory(req, res, next) {
	var category = req.params.itemcategory;
	var categoryName = null;

	switch(category){
		case "1":
			categoryName="Common-Use Supplies";
			break;
		case "2":
			categoryName="Consumables";
			break;
		case "3":
			categoryName="Electrical";
			break;
		case "4":
			categoryName="Office Device";
			break;
		case "5":
			categoryName="Office Furnitures";
			break;
		case "6":
			categoryName="Office Equipment";
			break;
	}
	db.query(
		"SELECT * FROM item WHERE category = ?",
		[categoryName],
		function (err,rows) {
			if(err)
				res.status(552).send({success: false,errorMessage: err});
			else
				res.send(rows);
		});
}
exports.findByCategory = findByCategory;

function countByColumn(req, res, next) {
	var category = req.params.itemcategory;
	var categoryName = null;

	switch(category){
		case "1":
			categoryName="Common-Use Supplies";
			break;
		case "2":
			categoryName="Consumables";
			break;
		case "3":
			categoryName="Electrical";
			break;
		case "4":
			categoryName="Janitorial";
			break;
		case "5":
			categoryName="Office Device";
			break;
		case "6":
			categoryName="Office Furnitures";
			break;
		case "7":
			categoryName="Office Equipment";
			break;
	}
	db.query(
		"SELECT COUNT(*) as count FROM item WHERE category = ?",
		[categoryName],
		function (err,rows) {
			if(err)
				res.send(err);
			res.send(rows[0]);
		});
}
exports.countByColumn = countByColumn;

function addItem(req, res, next) {
	var itemJSON = req.body;
	db.query(
		"INSERT INTO item SET ?",
		itemJSON,
		function (err,rows) {
			if(err)
				res.status(552).send({success: false,errorMessage: err});
			else
				res.send({success: true, affectedRows: rows.affectedRows});
		});
}
exports.addItem = addItem;

function updateItem(req, res, next) {
	var itemJSON = req.body;
	db.query(
		"UPDATE item SET description = ?, item_code = ?, category = ?, unit = ? WHERE id = ?",
		[itemJSON.description, itemJSON.item_code, itemJSON.category , itemJSON.unit, req.params.itemid],
		function (err,rows) {
			if(err)
				res.status(552).send({success: false,errorMessage: err});
			else
				res.send({success: true, affectedRows: rows.affectedRows});
		});
}
exports.updateItem = updateItem;

function archiveItem(req, res, next) {
	var itemJSON = req.body;
	db.query(
		"UPDATE item SET isArchived = ? WHERE id = ?",
		[1, req.params.itemid],
		function (err,rows) {
			if(err)
				res.status(552).send({success: false,errorMessage: err});
			else
				res.send({success: true, affectedRows: rows.affectedRows});
		});
}
exports.archiveItem = archiveItem;
