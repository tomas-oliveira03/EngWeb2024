var express = require('express');
var router = express.Router();
var axios = require('axios')

var d = new Date().toISOString().substring(0, 16)


// GET /compositores --------------------------------------------------------------------
router.get('/', function(req, res, next) {
    axios.get('http://localhost:3000/compositores')
    .then(response => {
        var compositores = response.data
        res.status(200).render("compositoresListPage", {title: "Compositores", "compositores": compositores, "date": d })
    })
    .catch(function(erro){
        res.status(501).render("error", { "error": erro })
    })
});


// GET /compositores/registo --------------------------------------------------------------------
router.get('/registo', function(req, res, next) {
    axios.get('http://localhost:3000/periodos')
        .then(response => {
            var periodos = response.data
            res.status(200).render("compositorFormPage", {title: "Registo de Compositor", "periodos": periodos, "date": d })
        })
        .catch(function(erro){
              res.status(502).render("error", { "error": erro })
        })
  });
  
  

// POST /compositores/registo --------------------------------------------------------------------
router.post('/registo', function(req, res, next) {
    var compositor = req.body
    axios.post("http://localhost:3000/compositores/", compositor)
    .then(resp => {
        res.status(200).redirect("/compositores")
    })
    .catch(erro => {
        res.status(503).render("error", { "error": erro })
        })
});



// GET /compositores/id --------------------------------------------------------------------
router.get("/:id", function(req, res, next) {
  var id = req.params.id
  axios.get('http://localhost:3000/compositores/'+id)
  .then(response => {
      var compositor = response.data
      res.status(200).render("compositorPage", {title: "Compositor", "compositor": compositor, "date": d })
  })
  .catch(function(erro){
    res.status(504).render("error", { "error": erro })
  })
});


// GET /compositores/edit/id --------------------------------------------------------------------
router.get("/edit/:id", function(req, res, next) {
  var id = req.params.id
  axios.get('http://localhost:3000/compositores/'+id)
  .then(response => {
      var compositor = response.data
      axios.get('http://localhost:3000/periodos/')
      .then(response => {
          var periodos = response.data
          res.status(200).render("compositorFormEditPage", {title: "Edição de Compositor", "compositor": compositor, "periodos": periodos, "date": d })
      })
      .catch(function(erro){
        res.status(505).render("error", { "error": erro })
      })

  })
  .catch(function(erro){
    res.status(506).render("error", { "error": erro })
  })
});


// POST /compositores/edit/id --------------------------------------------------------------------
router.post("/edit/:id", function(req, res, next) {
  var compositor = req.body
  var id = req.params.id
  axios.put("http://localhost:3000/compositores/" +id, compositor)
    .then(resp => {
        res.status(200).redirect("/compositores")
    })
    .catch(erro => {
        res.status(507).render("error", { "error": erro })
      })
});


// DELETE /compositores/id --------------------------------------------------------------------
router.get("/delete/:id", function(req, res, next) {
  var id = req.params.id
  axios.delete('http://localhost:3000/compositores/'+id)
  .then(() => {
      res.redirect("/compositores")
  })
  .catch(function (erro) {
      res.status(508).render("error", { "error": erro })
  });
});


module.exports = router;
