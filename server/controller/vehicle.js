var vehicleSchema = require('../models/vehicle').vehicleSchema;


var getvehicle = function (req, res, next) {
	vehicleSchema.find({},function (err, doc) {
    res.json(doc);
	})
}

module.exports = {
	getvehicle
}
