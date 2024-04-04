var express = require('express');
var router = express.Router();
var Compositor = require("../controllers/compositor")
var Periodo = require("../controllers/periodo")

var d = new Date().toISOString().substring(0, 16)


// GET /periodos --------------------------------------------------------------------
router.get('/', function(req, res, next) {
    Periodo.list()
    .then(data => {
        res.status(200).render("periodosListPage", {title: "Períodos", "periodos": data, "date": d })
    })
    .catch(function(erro){
        res.status(501).render("error", { "error": erro })
    })
});


// GET /periodos/registo --------------------------------------------------------------------
router.get('/registo', function(req, res, next) {
        Periodo.list()
        .then(data => {
            res.status(200).render("periodoFormPage", {title: "Registo de Períodos", "periodos": data, "date": d })
        })
        .catch(function(erro){
              res.status(502).render("error", { "error": erro })
        })
  });
  
  

// POST /periodos/registo --------------------------------------------------------------------
router.post('/registo', function(req, res, next) {
    var periodo = req.body
    Periodo.insert(periodo)
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
  Compositor.list()
  .then(data => {
      Periodo.findById(id)
      .then(data2 => {
        res.status(200).render("periodoPage", {title: "Período", "periodo": data2, "compositores": data, "date": d })
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
  Periodo.findById(id)
  .then(data => {
      res.status(200).render("periodoFormEditPage", {title: "Edição de Período", "periodo": data, "date": d })
  })
  .catch(function(erro){
    res.status(506).render("error", { "error": erro })
  })
});


// POST /periodos/edit/id --------------------------------------------------------------------
router.post("/edit/:id", function(req, res, next) {
  var periodo = req.body
  var id = req.params.id
  Periodo.update(id, periodo)
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
  Periodo.remove(id)
  .then(() => {
      res.redirect("/periodos")
  })
  .catch(function (erro) {
      res.status(508).render("error", { "error": erro })
  });
});


module.exports = router;
