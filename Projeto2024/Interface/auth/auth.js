var jwt = require('jsonwebtoken')

module.exports.verificaAcesso = function (req, res, next){
    var myToken = req.cookies.token
    if(myToken){
      jwt.verify(myToken, "EngWeb2024", function(e, payload){
        if(e){
          res.status(401).jsonp({error: e})
        }
        else{
          next()
        }
      })
    }
    else{
      res.status(401).redirect('/login')
    }
}


module.exports.verificaAdmin = function (req, res, next){
  var myToken = req.cookies.token
  if(myToken){ 
    jwt.verify(myToken, "EngWeb2024", function(e, payload){
      if(e){
        res.status(401).jsonp({error: e})
      }
      else{
        if(req.cookies.level != "Administrador"){
          res.status(401).render('adminOnly', {title: "Admin Only"})
        }
        else{
          next() 
        }
        
      }
    })
  }
  else{
    res.status(401).redirect('/login')
  }
}
