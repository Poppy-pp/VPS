var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '服务启动成功！',desc:"VPS-node服务" });
});

module.exports = router;
