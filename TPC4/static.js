var fs = require('fs')

function staticResource(request){
    return /\/w3.css$/.test(request.url)
}

exports.staticResource = staticResource

function serveStaticResource(req, res){
    var partes = req.url.split('/')
    var file = partes[partes.length -1 ]
    fs.readFile('extras/' + file, (erro, dados)=>{
        if(erro){
            console.log('Erro: ficheiro não encontrado ' + erro)
            res.statusCode = 404
            res.end('Erro: ficheiro não encontrado ' + erro)
        }
        else{
            if(file == 'w3.css'){
                res.setHeader('Content-Type', 'text/css')
                res.end(dados)
            }
        }
    })
}

exports.serveStaticResource = serveStaticResource