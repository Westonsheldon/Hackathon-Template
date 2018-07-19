var express = require('express');

var router = express.Router();
var path = require('path');

router.route('/').get(require(path.resolve(__dirname,'controllers/index.js')));

router.route('/devices/generateID').get();
router.route('/devices/types').get();
router.route('/devices').get((req,res) => {});
router.route('/allMeteringDevices').get((req,res) => {});
router.route('/sem3/login').post((req,res) => {});
//router.route('/logs/:deviceID/:value/:limit').get(apiRoutes.logs);
router.route('/devices/add').post((req,res) => {});
router.route('/devices/remove/:deviceID').post((req,res) => {});
router.route('/devices/modify/:deviceID').post((req,res) => {});
router.route('/logs/createLog').post((req,res) => {});
router.route('/logs/remove/:log_id').post((req,res) => {});
router.route('/logs/:logID').get((req,res) => {});
router.route('/mindsphere/addAccount').post((req,res) => {});
router.route('/mindsphere/removeAccount/:tenant').post((req,res) => {});
router.route('/mindsphere/modifyAccount/:tenant').post((req,res) => {});
router.route('/dcu/addDCU').post((req,res) => {});
router.route('/dcu/removeDCU/:name').post((req,res) => {});
router.route('/dcu/modifyDCU/:type').post((req,res) => {});

module.exports = router;