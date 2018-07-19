var express = require('express');

var router = express.Router();
var path = require('path');

router.route('/').get(require(path.resolve(__dirname,'controllers/index.js')));
router.route('/api/devices').get(require(path.resolve(__dirname,'controllers/api/devices.js')));

module.exports = router;