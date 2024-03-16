var express = require('express');
var router = express.Router();
var axios = require('axios')

var d = new Date().toISOString().substring(0, 16)


// GET /periodos --------------------------------------------------------------------
router.get('/', function(req, res, next) {
    axios.get('http://localhost:3000/periodos')
    .then(response => {
        var periodos = response.data
        res.status(200).render("periodosListPage", {title: "Períodos", "periodos": periodos, "date": d })
    })
    .catch(function(erro){
        res.status(501).render("error", { "error": erro })
    })
});


// GET /periodos/registo --------------------------------------------------------------------
router.get('/registo', function(req, res, next) {
    axios.get('http://localhost:3000/periodos')
        .then(response => {
            var periodos = response.data
            res.status(200).render("periodoFormPage", {title: "Registo de Períodos", "periodos": periodos, "date": d })
        })
        .catch(function(erro){
              res.status(502).render("error", { "error": erro })
        })
  });
  
  

// POST /periodos/registo --------------------------------------------------------------------
router.post('/registo', function(req, res, next) {
    var compositor = req.body
    axios.post("http://localhost:3000/periodos", compositor)
    .then(resp => {
        res.status(200).redirect("/periodos")
    })
    .catch(erro => {
        res.status(503).render("error", { "error": erro })
        })
});



// GET /periodos/id --------------------------------------------------------------------
router.get("/:id", function(req, res, next) {
  var id = req.params.id
  axios.get('http://localhost:3000/compositores')
  .then(response => {
    var compositores = response.data
      axios.get('http://localhost:3000/periodos/'+id)
      .then(response => {
        var periodo = response.data
        res.status(200).render("periodoPage", {title: "Período", "periodo": periodo, "compositores": compositores, "date": d })
      })
      .catch(function(erro){
        res.status(504).render("error", { "error": erro })
      })
  })
  .catch(function(erro){
    res.status(505).render("error", { "error": erro })
  })
});


// GET /periodos/edit/id --------------------------------------------------------------------
router.get("/edit/:id", function(req, res, next) {
  var id = req.params.id
  axios.get('http://localhost:3000/periodos/'+id)
  .then(response => {
      var periodo = response.data
      res.status(200).render("periodoFormEditPage", {title: "Edição de Período", "periodo": periodo, "date": d })
  })
  .catch(function(erro){
    res.status(506).render("error", { "error": erro })
  })
});


// POST /periodos/edit/id --------------------------------------------------------------------
router.post("/edit/:id", function(req, res, next) {
  var periodo = req.body
  var id = req.params.id
  axios.put("http://localhost:3000/periodos/" +id, periodo)
    .then(resp => {
        res.status(200).redirect("/periodos")
    })
    .catch(erro => {
        res.status(507).render("error", { "error": erro })
      })
});


// DELETE /periodos/id --------------------------------------------------------------------
router.get("/delete/:id", function(req, res, next) {
  var id = req.params.id
  axios.delete('http://localhost:3000/periodos/'+id)
  .then(() => {
      res.redirect("/periodos")
  })
  .catch(function (erro) {
      res.status(508).render("error", { "error": erro })
  });
});


module.exports = router;
