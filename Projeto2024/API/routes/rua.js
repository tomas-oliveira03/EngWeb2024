/* Operações CRUD sobre Entrega 
   2024-04-21 @jcr
   ----------------------- */
   var express = require('express');
   var router = express.Router();
   var Rua = require('../controllers/rua')


   /* Listar as Entrega (R) */
   router.get('/', function(req, res, next) {
     Rua.list()
     .then(data => res.status(200).jsonp(data))
     .catch(erro => res.status(500).jsonp(erro))
   });

    
   /* Consultar uma Entrega (R) */
   router.get('/:id', function(req, res) {
       Rua.findById(req.params.id)
         .then(data => res.status(200).jsonp(data))
         .catch(erro => res.status(501).jsonp(erro))
     });
   
   /* Criar uma Entrega (C) */
   router.post('/', function(req, res) {
     Rua.insert(req.body)
       .then(data => res.status(200).jsonp(data))
       .catch(erro => res.status(502).jsonp(erro))
   });
   
   /* Alterar uma Entrega (U) */
   router.put('/:id', function(req, res) {
       Rua.update(req.params.id, req.body)
         .then(data => res.status(200).jsonp(data))
         .catch(erro => res.status(503).jsonp(erro))
     });
   
   /* Remover uma Entrega (D ) */
   router.delete('/:id', function(req, res) {
       Rua.remove(req.params.id)
         .then(data => res.status(200).jsonp(data))
         .catch(erro => res.status(504).jsonp(erro))
     });

    /* Listar as Ruas por toponimia */
    router.get('/toponimia/:top', function(req, res, next) {
        Rua.listToponimia(req.params.top)
        .then(data => res.status(200).jsonp(data))
        .catch(erro => res.status(500).jsonp(erro))
      });

    /* Listar as Ruas por freguesia */
    router.get('/freguesia/:freg', function(req, res, next) {
        Rua.listFreguesia(req.params.freg)
        .then(data => res.status(200).jsonp(data))
        .catch(erro => res.status(500).jsonp(erro))
      });

   module.exports = router;
   