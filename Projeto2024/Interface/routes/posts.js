var express = require('express');
var router = express.Router();
var axios = require('axios');
var auth = require('../auth/auth');

router.get('/', auth.verificaAcesso, function(req, res, next) {
    var startValue = "";
    if(req.query.rua) {
        startValue = req.query.rua;    
    } 

    axios.get('http://api:3000/posts')
    .then(postsResponse => {
        const posts = postsResponse.data;

        const ruaPromises = posts.map(post => {
            return axios.get('http://api:3000/rua/' + post.ruaID)
                .then(val => {
                    post.name = val.data.nome;
                });
        });

        return Promise.all(ruaPromises).then(() => posts);
    })
    .then(postsWithNames => {
        res.status(200).render('allPosts', {title: "Posts", value: startValue, posts: postsWithNames, level: req.cookies.level, username: req.cookies.username});
    })
    .catch(erro => res.status(500).jsonp(erro));
});

router.get('/:id', auth.verificaAcesso, function(req, res) {
    axios.get('http://api:3000/posts/'+req.params.id)
        .then(data => {
            axios.get('http://api:3000/rua/'+data.data.ruaID)
                .then(rua => res.status(200).render('postPage', {title: "Post", post: data.data, rua: rua.data.nome,  level: req.cookies.level, username: req.cookies.username}))
                .catch(erro => res.status(501).jsonp(erro))
        })
        .catch(erro => res.status(501).jsonp(erro))
});

router.get('/:id/commentForm', auth.verificaAcesso, function(req, res) {
    res.status(200).render('commentPost', {postID: req.params.id, level: req.cookies.level, username: req.cookies.username})
});

router.post('/:id/commentForm', auth.verificaAcesso, function(req, res) {
    var c = {
        user: req.cookies.username,
        content: req.body.content,
        date: new Date()
    }
    axios.post('http://api:3000/posts/'+req.params.id+'/comentario', c)
        .then(data => res.status(200).redirect('/posts/'+req.params.id))
        .catch(erro => res.status(501).jsonp(erro))
});

router.post('/:id/like', auth.verificaAcesso, function(req, res) {
    axios.post('http://api:3000/posts/' + req.params.id + '/like', {
        username: req.cookies.username
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => res.status(200).redirect('/posts/' + req.params.id))
    .catch(error => res.status(501).jsonp(error));
});

router.post('/:id/unlike', auth.verificaAcesso, function(req, res) {
    axios.post('http://api:3000/posts/' + req.params.id + '/unlike', {
        username: req.cookies.username
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => res.status(200).redirect('/posts/' + req.params.id))
    .catch(error => res.status(501).jsonp(error));
});

router.get('/:id/makePost', auth.verificaAcesso, function(req, res) {
    res.status(200).render('newPost', {ruaID: req.params.id, level: req.cookies.level, username: req.cookies.username})
});

router.post('/:id/makePost', auth.verificaAcesso, function(req, res) {
    var post = {
        ruaID: req.params.id,
        likes: 0,
        title: req.body.title,
        comments: [],
        postText: req.body.content,
        postedBy: req.cookies.username,
        date: new Date(),
        peopleLikes: []
    }
    axios.post('http://api:3000/posts/makePost', post)
        .then(data => res.status(200).redirect('/ruas/'+req.params.id))
        .catch(erro => res.status(501).jsonp(erro))
});

router.get('/delete/:id', auth.verificaAcesso, function(req, res) {   
    axios.get('http://api:3000/posts/'+req.params.id)
        .then(data => {
            if(data.data.postedBy != req.cookies.username && req.cookies.level != "Administrador") {
                res.status(401).render('adminOnly');
            } else {
                axios.delete('http://api:3000/posts/'+req.params.id)
                .then(data => res.status(200).redirect("/posts"))
                .catch(erro => res.status(501).jsonp(erro))
            }
        })
        .catch(erro => res.status(501).jsonp(erro))
});
    
router.get('/edit/:id', auth.verificaAcesso, function(req, res) {
    axios.get('http://api:3000/posts/'+req.params.id)
        .then(data => {
            if(data.data.postedBy != req.cookies.username) {
                res.status(401).render('adminOnly');
            } else {
                res.status(200).render('editPost', {post: data.data, level: req.cookies.level, username: req.cookies.username})
            }
        })
        .catch(erro => res.status(501).jsonp(erro))
});

router.post('/edit/:id', auth.verificaAcesso, function(req, res) {
    var post = {
        title: req.body.title,
        postText: req.body.postText
    }
    axios.put('http://api:3000/posts/'+req.params.id, post)
        .then(data => {
            if(data.data.postedBy != req.cookies.username) {
                res.status(401).render('adminOnly');
            } else {
                res.status(200).redirect('/posts');
            }
        })
        .catch(erro => res.status(501).jsonp(erro))
});

module.exports = router;
   