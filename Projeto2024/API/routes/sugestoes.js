var express = require('express');
var router = express.Router();
var Sugestao = require('../controllers/sugestoes')

/* Listar as Sugestões (R) */
router.get('/', function(req, res, next) {
  Sugestao.list()
  .then(data => res.status(200).jsonp(data))
  .catch(erro => res.status(500).jsonp(erro))
});

/* Consultar uma Sugestão (R) */
router.get('/:id', function(req, res) {
    Sugestao.findById(req.params.id)
      .then(data => res.status(200).jsonp(data))
      .catch(erro => res.status(501).jsonp(erro))
  });

/* Criar uma Sugestão (C) */
router.post('/', function(req, res) {
  Sugestao.insert(req.body)
    .then(data => res.status(200).jsonp(data))
    .catch(erro => res.status(502).jsonp(erro))
});

/* Alterar uma Sugestão (U) */
router.put('/:id', function(req, res) {
    Sugestao.update(req.params.id, req.body)
      .then(data => res.status(200).jsonp(data))
      .catch(erro => res.status(503).jsonp(erro))
  });

/* Remover uma Sugestão (D ) */
router.delete('/:id', function(req, res) {
    Sugestao.remove(req.params.id)
      .then(data => res.status(200).jsonp(data))
      .catch(erro => res.status(504).jsonp(erro))
  });

/* Listar as Sugestões de uma Rua (R) */
router.get('/rua/:ruaID', function(req, res) {
    Sugestao.listByRua(req.params.ruaID)
      .then(data => res.status(200).jsonp(data))
      .catch(erro => res.status(506).jsonp(erro))
  });

/* Listar as Sugestões de um Utilizador (R) */
router.get('/user/:user', function(req, res) {
    Sugestao.listByUser(req.params.user)
      .then(data => res.status(200).jsonp(data))
      .catch(erro => res.status(507).jsonp(erro))
  });


router.get('/contar', async (req, res) => {
    try {
        const count = await SugestaoController.count();
        res.json({ count });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao contar as sugestões' });
    }
});

router.delete('/all/delete/:id', function(req, res) {
  Sugestao.removeAll(req.params.id)
    .then(data => res.status(200).jsonp(data))
    .catch(erro => res.status(507).jsonp(erro))
});

module.exports = router;