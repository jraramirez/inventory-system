'use strict';

var account = require('./../controller/account');
var dr = require('./../controller/dr');
var fc = require('./../controller/fc');
var item = require('./../controller/item');
var ris = require('./../controller/ris');
var ics = require('./../controller/ics');
var par = require('./../controller/par');

/**
* Sets the routes of parameter of the function.
* @param {express.Router()} router - The router object to set routes to
* @return {express.Router()} The fully configured router object
*/
function setRoutes(router) {

	router.use(function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		next();
	});

	router.route('/api/accounts/register')
		.post(account.register);

	router.route('/api/accounts/login')
		.post(account.login);

	router.route('/api/accounts/check')
		.get(account.checkLogIn);

	router.route('/api/accounts/logout')
		.get(account.logout);

	router.route('/api/dr/:drid')
		.get(dr.findOne);

	router.route('/api/dr/:drid/items')
		.get(dr.findItemsOfDR)
		.post(dr.addItemToDR);

	router.route('/api/dr')
		.get(dr.find)
		.post(dr.insert);

	router.route('/api/fc/:fund_cluster_name/items')
		.get(fc.findFCItems);

	router.route('/api/fc/:fund_cluster_name/delivery_receipts')
		.get(fc.findFCDRs);

	router.route('/api/fc/:fund_cluster_name/:date/riss')
		.get(fc.findFCMonthRISs);

	router.route('/api/fc/:fund_cluster_name/:start_month/:end_month/icss')
		.get(fc.findFCMonthICSs);

	router.route('/api/fc/:fund_cluster_name/:year/pars')
		.get(fc.findFCYearPARs);

	router.route('/api/fc/update/:fund_cluster_name/:item_id')
		.post(fc.updateFCItem);

	router.route('/api/fc/update/:fund_cluster_name')
		.post(fc.updateFC);

	router.route('/api/fc/:fund_cluster_name/:item_id')
		.get(fc.findOneFCItem)
		.post(fc.addItemToFC);

	router.route('/api/fc')
		.get(fc.find);

	router.route('/api/items/:item_id/:fund_cluster_name/drriss')
		.get(item.findDRsAndRISsOfFCItem);

	router.route('/api/items/:item_id/:fund_cluster_name/drpars')
		.get(item.findDRsAndPARsOfFCItem);

	router.route('/api/items/category/count/:itemcategory')
		.get(item.countByColumn);

	router.route('/api/items/category/:itemcategory')
		.get(item.findByCategory);

	router.route('/api/items/update/:itemid')
		.post(item.updateItem);

	router.route('/api/items/archive/:itemid')
		.post(item.archiveItem);

	router.route('/api/items/not-archived')
		.get(item.findNotArchived);

	router.route('/api/items/:itemid')
		.get(item.findOne);

	router.route('/api/items')
		.get(item.find)
		.post(item.addItem);

	router.route('/api/ris/:risid/items')
		.get(ris.findItemsOfRIS)
		.post(ris.addItemToRIS);

	router.route('/api/ris/:risid')
		.get(ris.findOne);

	router.route('/api/ris')
		.get(ris.find)
		.post(ris.insert);

	router.route('/api/ics/:icsid/items')
		.get(ics.findItemsOfICS)
		.post(ics.addItemToICS);

	router.route('/api/ics/:icsid')
		.get(ics.findOne);

	router.route('/api/ics')
		.get(ics.find)
		.post(ics.insert);

	router.route('/api/par/update/:parid/:itemid')
		.post(par.updatePARItem);

	router.route('/api/par/update/:parid')
		.post(par.updatePARPIC);

	router.route('/api/par/:parid/items')
		.get(par.findItemsOfPAR)
		.post(par.addItemToPAR);

	router.route('/api/par/:parid')
		.get(par.findOne);

	router.route('/api/par')
		.get(par.find)
		.post(par.insert);

	return router;
}
module.exports = setRoutes;
