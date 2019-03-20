var corprateSchema = require('../models/corprate').corprateSchema;


var getcorprate = function (req, res, next) {
	corprateSchema.find({},function (err, doc) {
    res.json(doc);
	})
}

module.exports = {
	getcorprate
}
