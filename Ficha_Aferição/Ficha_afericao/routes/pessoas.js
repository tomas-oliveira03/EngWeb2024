var express = require('express');
var router = express.Router();
var Pessoa = require("../controllers/pessoas")


/* GET home page. */
router.get('/', function(req, res, next) {
  Pessoa.list()
  .then(data => {
      res.jsonp(data)
  })
  .catch(function(erro){
      res.status(501).render("error", { "error": erro })
  })
});
module.exports = router;
