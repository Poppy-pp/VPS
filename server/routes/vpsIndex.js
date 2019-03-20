var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var corprateController = require('../controller/corprate');
var vehicleController = require('../controller/vehicle');

router.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

mongoose.connect('mongodb://localhost:27017/mydb');

/* vpsweb */
router.get('/getcorprate', corprateController.getcorprate);

router.get('/getvehicle', vehicleController.getvehicle);

module.exports = router;
