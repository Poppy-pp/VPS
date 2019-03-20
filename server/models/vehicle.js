var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var vehicleSchema = new Schema({
    ID: Number,
    NAME:String,
    MODEL:String
});

// addressScheMa.statics.findByUserId = function(userId, callback) {
//     return this.model('System').find(userId, callback);
// }

exports.vehicleSchema = mongoose.model('vehicle', vehicleSchema,"vehicle");
