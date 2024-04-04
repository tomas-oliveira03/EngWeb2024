var express = require('express');
var router = express.Router();
var Compositor = require("../controllers/compositor")
var Periodo = require("../controllers/periodo")

var d = new Date().toISOString().substring(0, 16)


// GET /compositores --------------------------------------------------------------------
router.get('/', function(req, res, next) {
    Compositor.list()
    .then(data => {
        res.status(200).render("compositoresListPage", {title: "Compositores", "compositores": data, "date": d })
    })
    .catch(function(erro){
        res.status(501).render("error", { "error": erro })
    })
});


// GET /compositores/registo --------------------------------------------------------------------
router.get('/registo', function(req, res, next) {
      Periodo.list()
      .then(data => {
          res.status(200).render("compositorFormPage", {title: "Registo de Compositor", "periodos": data, "date": d })
      })
      .catch(function(erro){
            res.status(502).render("error", { "error": erro })
      })
  });
  
  

// POST /compositores/registo --------------------------------------------------------------------
router.post('/registo', function(req, res, next) {
    var compositor = req.body
    Compositor.insert(compositor)
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
  Compositor.findById(id)
  .then(data => {
      res.status(200).render("compositorPage", {title: "Compositor", "compositor": data, "date": d })
  })
  .catch(function(erro){
    res.status(504).render("error", { "error": erro })
  })
});


// GET /compositores/edit/id --------------------------------------------------------------------
router.get("/edit/:id", function(req, res, next) {
  var id = req.params.id
  Compositor.findById(id)
  .then(data => {
      Periodo.list()
      .then(data2 => {
          res.status(200).render("compositorFormEditPage", {title: "Edição de Compositor", "compositor": data, "periodos": data2, "date": d })
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
  Compositor.update(id, compositor)
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
  Compositor.remove(id)
  .then(() => {
      res.redirect("/compositores")
  })
  .catch(function (erro) {
      res.status(508).render("error", { "error": erro })
  });
});


module.exports = router;
