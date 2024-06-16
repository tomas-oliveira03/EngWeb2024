var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');
var axios = require('axios');
var auth = require('../auth/auth');

router.get('/', auth.verificaAdmin, function(req, res, next) {
    axios.get('http://api:3000/sugestoes')
    .then(ruasResponse => {
        const sugestoes = ruasResponse.data;

        const ruaPromises = sugestoes.map(sugestao => {
            return axios.get('http://api:3000/rua/' + sugestao.ruaID)
                .then(val => {
                    sugestao.name = val.data.nome;
                });
        });

        return Promise.all(ruaPromises).then(() => sugestoes);
    })
    .then(postsWithNames => {
        console.log(postsWithNames)
        res.status(200).render('allSugestoes', {title: "Sugestões", sugestoes: postsWithNames, level: req.cookies.level, username: req.cookies.username});
    })
    .catch(erro => res.status(500).jsonp(erro));
});


router.get('/:id', auth.verificaAcesso, function(req, res, next) {
    axios.get('http://api:3000/rua/' + req.params.id)
        .then(response => {
            res.status(200).render('sugestoesPage', {
                title: "Sugestões",
                rua: response.data,
                level: req.cookies.level,
                username: req.cookies.username
            });
        })
        .catch(error => {
            res.status(500).jsonp(error);
        });
});
  
router.post('/:id', auth.verificaAcesso, async function(req, res, next) {

    const sugestao = {
    feitaPor: req.cookies.username,
    data: new Date().toISOString().slice(0, 10),
    ruaID: req.params.id,
    alteracoes: req.body.alteracoes,
    justificacao: req.body.justificacao,
    important: false
    }
    axios.post('http://api:3000/sugestoes', sugestao)
    .then(response => {
        res.status(200).redirect('/ruas/'+req.params.id);
    })
    .catch(error => {
        res.status(500).jsonp(error);
    });

    
});

router.get('/rua/:id', auth.verificaAdmin, function(req, res, next) {

    axios.get('http://api:3000/rua/'+req.params.id)
    .then(data => {
        if (data.data) {
            axios.get('http://api:3000/sugestoes/rua/' + req.params.id)
            .then(response => {
                res.status(200).render('allSugestoesRua', {title: "Sugestões", rua:data.data, sugestoes: response.data, level: req.cookies.level, username: req.cookies.username});
            })
            .catch(error => {
                res.status(500).jsonp(error);
            });
        } else {
            res.status(200).render('notFound');
        }
    })
    .catch(erro => res.status(200).render('notFound'));


});

router.get('/delete/:id', auth.verificaAdmin, function(req, res) {
    axios.delete('http://api:3000/sugestoes/'+req.params.id)
    .then(data => {res.redirect("/sugestoes/rua/"+req.query.rua)})
    .catch(erro => res.status(501).jsonp(erro));
});

router.get('/edit/:id', auth.verificaAdmin, function(req, res) {
    axios.put('http://api:3000/sugestoes/'+req.params.id, {important: req.query.estado})
        .then(data => {res.redirect("/sugestoes/rua/"+req.query.rua)})
        .catch(erro => res.status(501).jsonp(erro));
});



module.exports = router;