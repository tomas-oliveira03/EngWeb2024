var express = require('express');
var router = express.Router();
var axios = require('axios');
var auth = require('../auth/auth');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/login', function(req, res, next) {
  error = "";
  if (req.query.error) error = "Username e/ou Password errado!";
  
  res.render('login', {title: "Login", error: error});
});


router.post('/login', function(req, res, next) {
  var user = req.body;
  axios.post('http://autenticacao:3002/users/login', user)
    .then(dados => {
      res.cookie('token', dados.data.token, {
        expires: new Date(Date.now() + '1d'),
        secure: true,
        httpOnly: true
      });
      res.cookie('username', dados.data.user, {
        expires: new Date(Date.now() + '1d'),
        secure: true,
        httpOnly: false
      });
      res.cookie('level', dados.data.level, {
        expires: new Date(Date.now() + '1d'),
        secure: true,
        httpOnly: false
      });
      
      res.redirect('/ruas');
    })
    .catch(erro => {
      console.log("Username e/ou Password errado!");
      res.redirect('/login?error=true');
    })
});


router.get('/logout', function(req, res, next) {
  res.clearCookie('token');
  res.clearCookie('username');
  res.clearCookie('level');
  res.redirect('/'); 
});


router.get('/register', function(req, res, next) {
  error = "";
  if (req.query.error) error = "Username já se encontra registado!";

  res.render('register', {title: "Register", error: error});
});


router.post('/register', function(req, res, next) {
  var user = req.body;
  user.level = "Consumidor"
  axios.post('http://autenticacao:3002/users/register', user)
    .then(dados => {
      res.redirect('/login');
    })
    .catch(erro => {
      res.redirect('/register?error=true');
    })
  
});

router.get('/userPage', auth.verificaAcesso, function(req, res, next) {
  axios.get('http://autenticacao:3002/users/' + req.cookies.username + '?token='+req.cookies.token)
    .then(data => {
      axios.get('http://api:3000/posts/user/' + req.cookies.username)
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
          res.status(200).render('userPage', {title: "UserPage", user: data.data.dados, posts: postsWithNames, level: req.cookies.level, username: req.cookies.username});
      })
      .catch(erro => res.status(500).jsonp(erro));
    })
  .catch(erro => res.status(500).jsonp(erro))
});

//  res.status(200).render('userPage', {user: data.data.dados, posts: posts.data, level: req.cookies.level, username: req.cookies.username});


router.get('/users', auth.verificaAdmin, function(req, res, next) {
  axios.get('http://autenticacao:3002/users?token='+req.cookies.token)
    .then(data => res.status(200).render('allUsers', {title: "Users", users: data.data, level: req.cookies.level, username: req.cookies.username}))
    .catch(erro => res.status(500).jsonp(erro))
});

router.get('/users/edit/:id', auth.verificaAdmin, function(req, res, next) {
  axios.put('http://autenticacao:3002/users/' + req.params.id + '/' + req.query.level + '?token='+req.cookies.token)
    .then(data => res.status(200).redirect('/users'))
    .catch(erro => res.status(500).jsonp(erro))
});

router.get('/users/delete/:id', auth.verificaAdmin, function(req, res, next) {
  axios.delete('http://autenticacao:3002/users/' + req.params.id +'?token='+req.cookies.token)
    .then(data => res.status(200).redirect('/users'))
    .catch(erro => res.status(500).jsonp(erro))
});

module.exports = router;
