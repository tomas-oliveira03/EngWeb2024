var express = require('express');
var router = express.Router();
var Post = require('../controllers/posts');
   
router.get('/', function(req, res, next) {
    Post.list()
    .then(data => res.status(200).jsonp(data))
    .catch(erro => res.status(500).jsonp(erro))
});

router.get('/:id', function(req, res, next) {
    Post.lookUp(req.params.id)
    .then(data => res.status(200).jsonp(data))
    .catch(erro => res.status(500).jsonp(erro))
});


router.post('/:id/comentario', function(req, res, next) {
    Post.comment(req.params.id, req.body)
    .then(data => res.status(200).jsonp(data))
    .catch(erro => res.status(500).jsonp(erro))
});

router.post('/:id/like', function(req, res, next) {
    Post.like(req.params.id, req.body.username)
        .then(data => res.status(200).jsonp(data))
        .catch(erro => res.status(500).jsonp(erro));
});

router.post('/:id/unlike', function(req, res, next) {
    Post.unlike(req.params.id, req.body.username)
    .then(data => res.status(200).jsonp(data))
    .catch(erro => res.status(500).jsonp(erro));
});


router.delete('/:id', function(req, res, next) {
    Post.remove(req.params.id)
    .then(data => res.status(200).jsonp(data))
    .catch(erro => res.status(500).jsonp(erro))
});

router.post('/makePost', function(req, res, next) {
    Post.insert(req.body)
    .then(data => res.status(200).jsonp(data))
    .catch(erro => res.status(500).jsonp(erro))
});

router.get('/user/:username', function(req, res, next) {
    Post.userPosts(req.params.username)
    .then(data => res.status(200).jsonp(data))
    .catch(erro => res.status(500).jsonp(erro))
});


router.put('/:id', function(req, res) {
    Post.update(req.params.id, req.body)
      .then(data => res.status(200).jsonp(data))
      .catch(erro => res.status(503).jsonp(erro))
  });


router.delete('/all/delete/:id', function(req, res, next) {
    Post.removeAll(req.params.id)
    .then(data => res.status(200).jsonp(data))
    .catch(erro => res.status(500).jsonp(erro))
});

module.exports = router;
