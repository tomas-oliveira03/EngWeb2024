/* Operações CRUD sobre Entrega 
   2024-04-21 @jcr
   ----------------------- */
   var express = require('express');
   var router = express.Router();
   var multer = require('multer');
   var path = require('path');
   const { exec } = require('child_process');
   var axios = require('axios');
   var auth = require('../auth/auth');
   const fs = require('fs');


  // Configurar multer
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      if(path.extname(file.originalname) == ".zip"){
        cb(null, 'scriptAdd/');
      }
      else{
        cb(null, 'public/');  
      }
    },
    filename: function (req, file, cb) {
      cb(null, "file" + path.extname(file.originalname));
    }
  });

  var upload = multer({ storage: storage });

   router.get('/', auth.verificaAcesso, function(req, res, next) {
    var content = ""
    if(req.query.flag){
      if (req.query.flag == 0){
        content = "Rua adicionada com sucesso!";
      }
      else if (req.query.flag == 1){
        content = "Número de rua já existe!";
      }
      else if (req.query.flag == 2){
        content = "Erro no conteúdo do .zip!";
      }
      else if (req.query.flag == 3){
        content = "Faça backup antes de importar!";
      }
    }
     axios.get('http://api:3000/rua')
     .then(data => res.status(200).render('allRuas', {title: "Ruas", ruas: data.data, content: content, level: req.cookies.level, username: req.cookies.username}))
     .catch(erro => res.status(500).jsonp(erro))
   });




    router.get("/freguesias/:nome", auth.verificaAcesso, function(req, res, next){
      axios.get('http://api:3000/rua/freguesia/'+req.params.nome)
      .then(data => res.status(200).render('freguesiaPage', {title: "Ruas da Freguesia", ruas: data.data, level: req.cookies.level, username: req.cookies.username}))
      .catch(erro => res.status(500).jsonp(erro))
    })

    router.get("/toponimias/:nome", auth.verificaAcesso, function(req, res, next){
      axios.get('http://api:3000/rua/toponimia/'+req.params.nome)
      .then(data => res.status(200).render('toponimiaPage', {title: "Ruas com a Toponímia", ruas: data.data, level: req.cookies.level, username: req.cookies.username}))
      .catch(erro => res.status(500).jsonp(erro))
    })



    
    router.get('/file', auth.verificaAdmin, function(req, res, next) {
      res.status(200).render('insertFolder', {title: "Ruas", level: req.cookies.level, username: req.cookies.username})
    });

    router.post('/file', auth.verificaAdmin, upload.single('myFile'), function (req, res, next) {
      let pythonScriptPath = 'scriptAdd/convertXML.py';
      let zip = 'scriptAdd/file.zip';
      let flag = 0;

      exec(`python3 ${pythonScriptPath} ${zip}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          flag = 2;
        }
        else if(stdout.startsWith("Ficheiros convertidos com sucesso")){
          flag = 0;
        }
        else if(stdout.startsWith("Erro ao adicionar a rua com o")){
          flag = 1;
        }
        else {
          flag = 2;
          console.log(stdout);
        }
        res.status(200).redirect('/ruas?flag=' + flag);
      });
    
    });
    

    router.get('/:id', auth.verificaAcesso, function(req, res) {
      axios.get('http://api:3000/rua/'+req.params.id)
       .then(data => {
          if (data.data) {
            res.status(200).render('ruaPage', {title: "Rua", "rua": data.data, level: req.cookies.level, username: req.cookies.username});
          } else {
            res.status(200).render('notFound');
          }
       })
       .catch(erro => res.status(200).render('notFound'));
     });


    router.get('/edit/:id', auth.verificaAdmin, function(req, res) {
      axios.get('http://api:3000/rua/'+req.params.id)
       .then(data => res.status(200).render('editRua', {title: "Editar Rua", "rua": data.data, level: req.cookies.level, username: req.cookies.username, idRua: req.params.id}))
       .catch(erro => res.status(501).jsonp(erro))
    });

    router.post('/edit/:id', auth.verificaAdmin, function(req, res) {
      var idString = req.params.id;
      if(idString.length == 1){
        idString = '0' + idString;
      }
      var formData = req.body;
      const rebuiltJson = {
        _id: parseInt(formData._id, 10),
        nome: formData.nome,
        freguesia: formData.freguesia,
        toponimia: formData.toponimia,
        texto: formData.texto,
        figuras: [],
        imagens_atuais: [],
        casas: []
      }; 
    
      let iteration = 0;
      let aux = 0;
      var temp = {};
      var temp2 = {};
      for (const key in formData) {
        //console.log(key, formData[key]);

        let value = formData[key];
        const figuraMatch = key.match(/^figuras\[(\d+)\]\[(.+)\]$/);
        const imagemMatch = key.match(/^imagens_atuais.*/);
        const casaMatch = key.match(/^casas\[(\d+)\]\[(.+)\]$/);

        if (iteration >= 5) {
          aux ++;
  
          if (figuraMatch) {
            const subKey = figuraMatch[2];
            if(subKey == "path" && !value.startsWith("/images")){
              value = "/images/imagens/"+ idString + "/antigas/"+ value
            }

            temp[subKey] = value;

            if(aux == 3){
              rebuiltJson.figuras.push(temp);
              temp = {};
              aux = 0;
            }
          }

          else if (imagemMatch) {
            if (!value.startsWith("/images")) {
              value = "/images/imagens/"+ idString + "/atuais/"+ value
             }
            aux = 0;
            rebuiltJson.imagens_atuais.push(value);
          }

          else if(casaMatch){
            const subKey = casaMatch[2];
            temp2[subKey] = value;

            if(aux == 4){
              rebuiltJson.casas.push(temp2);
              temp2 = {};
              aux = 0;
            }
          }


        }
          
        iteration++;
      }

      axios.put('http://api:3000/rua/'+req.params.id, rebuiltJson)
       .then(res.redirect("/ruas"))
       .catch(erro => res.status(501).render("error", {error:erro}))
        
    });

    router.post('/upload/:id/:file/:typeFoto', auth.verificaAdmin, upload.single('myFile'), function (req, res, next) {
      var id = parseInt(req.params.id);
      var idString = String(id);
      if(idString.length == 1){
        idString = '0'+ idString;
      }

      var file = req.params.file;
      var extention = path.extname(file);
      var typeFoto = req.params.typeFoto;

      const sourcePath = `public/file${extention}`;
      const destinationPath = 'public/images/imagens/'+ idString + '/'+ typeFoto +'/' + file ;
      try {
        fs.rename(sourcePath, destinationPath, (err) => { });
      } catch (error) {
        // Handle the error here
        console.error(error);
      }
        
      res.status(200).send("Ficheiro recebido com sucesso!");
    });


    router.get('/delete/:id', auth.verificaAdmin, function(req, res) {
        axios.delete('http://api:3000/rua/'+req.params.id)
        .then(data => {
          axios.delete('http://api:3000/sugestoes/all/delete/'+req.params.id)
          .then(data => {
              axios.delete('http://api:3000/posts/all/delete/'+req.params.id)
              .then(data => {res.status(200).redirect("/ruas")})
              .catch(erro => res.status(501).jsonp(erro));
          })
          .catch(erro => res.status(501).jsonp(erro));
        })
        .catch(erro => res.status(501).jsonp(erro))
    });

   module.exports = router;
   