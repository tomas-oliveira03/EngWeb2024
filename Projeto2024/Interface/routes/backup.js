var express = require('express');
var router = express.Router();
var auth = require('../auth/auth');
var axios = require('axios');

router.get('/export', auth.verificaAdmin, function(req, res, next) {
    axios.get('http://api:3000/backup/export')
        .then(data => res.status(200).redirect('/ruas'))
        .catch(erro => res.status(501).jsonp(erro))
});

router.get('/import', auth.verificaAdmin, function(req, res, next) {
    axios.get('http://api:3000/backup/import')
        .then(data => res.status(200).redirect('/ruas'))
        .catch(erro => res.status(200).redirect('/ruas?flag=3'))
});

module.exports = router;
