var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var corprateSchema = new Schema({
    ID: Number,
    CORPCODE: String,
    PARENTCORPCODE:Number,
    NAME:String,
    CORPNAME:String,
    CORPSHORTNAME:String,
    CORPTYPE:String,
    ISDELETE:Number,
    SHOWORDER:String,
    TEL1:String,
    TEL2:String,
    TEL3:String,
    ADDRESS:String,
    AREA:String,
    CORPLEVEL:String
});

// addressScheMa.statics.findByUserId = function(userId, callback) {
//     return this.model('System').find(userId, callback);
// }

exports.corprateSchema = mongoose.model('corprate', corprateSchema,"corprate");
