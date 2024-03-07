// alunos_server.js
// EW2024 : 04/03/2024
// by jcr

var http = require('http')
var axios = require('axios')
const { parse } = require('querystring');

var templates = require('./templates')          // Necessario criar e colocar na mesma pasta
var static = require('./static.js')             // Colocar na mesma pasta

// Aux functions
function collectRequestBodyData(request, callback) {
    if(request.headers['content-type'] === 'application/x-www-form-urlencoded') {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            callback(parse(body));
        });
    }
    else {
        callback(null);
    }
}


// Server creation

var compositoresServer = http.createServer((req, res) => {

    var d = new Date().toISOString().substring(0, 16)
    console.log(req.method + " " + req.url + " " + d)

    if(static.staticResource(req)){
        static.serveStaticResource(req, res)
    }
    else{
        switch(req.method){
            case "GET": 
                // GET /compositores --------------------------------------------------------------------
                if(req.url == "/compositores"){
                    axios.get('http://localhost:3000/compositores')
                        .then(response => {
                            var compositores = response.data
                            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                            res.write(templates.compositoresPage(compositores, d))
                            res.end()
                        })
                        .catch(function(erro){
                            res.writeHead(501, {'Content-Type': 'text/html; charset=utf-8'})
                            res.write('<p>Não foi possivel obter a lista de compositores...')
                            res.write('<p>'+erro+'</p>')
                            res.end()
                        })
                }

                // GET /compositores/id --------------------------------------------------------------------
                else if(/\/compositores\/C[0-9]+$/.test(req.url)){
                    var id = req.url.split("/")[2]
                    axios.get('http://localhost:3000/compositores/'+id)
                    .then(response => {
                        var compositor = response.data
                        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                        res.write(templates.compositorPage(compositor, d))
                        res.end()
                    })
                    .catch(function(erro){
                        res.writeHead(502, {'Content-Type': 'text/html; charset=utf-8'})
                        res.write('<p>Não foi possivel obter o compositor...')
                        res.write('<p>'+erro+'</p>')
                        res.end()
                    })
                }

                // GET /compositores/edit/id --------------------------------------------------------------------
                else if(/\/compositores\/edit\/C[0-9]+$/.test(req.url)){
                    var id = req.url.split("/")[3]
                    axios.get('http://localhost:3000/compositores/'+id)
                    .then(response => {
                        var compositor = response.data
                        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                        res.write(templates.compositorFormEdit(compositor, d))
                        res.end()
                    })
                    .catch(function(erro){
                        res.writeHead(503, {'Content-Type': 'text/html; charset=utf-8'})
                        res.write('<p>Não foi possivel editar o compositor...')
                        res.write('<p>'+erro+'</p>')
                        res.end()
                    })
                }

                // GET /compositores/registo --------------------------------------------------------------------
                else if(req.url == "/compositores/registo"){
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                    res.write(templates.compositorForm(d))
                    res.end()
                }

                // DELETE /compositores/id --------------------------------------------------------------------
                else if(/\/compositores\/delete\/C[0-9]+$/.test(req.url)){
                    var id = req.url.split("/")[3]

                    axios.delete('http://localhost:3000/compositores/'+id)
                    .then(() => {
                        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                        res.write('<p>Compositor eliminado com sucesso...</p>')
                        res.write("<p><a href='/compositores'> [Voltar] </a></p>")
                        res.end();
                    })
                    .catch(function (erro) {
                        res.writeHead(505, {'Content-Type': 'text/html; charset=utf-8'})
                        res.write('<p>Não foi possivel eliminar o compositor...')
                        res.write('<p>'+erro+'</p>')
                        res.end()
                    });
                }

                // GET ? -> Lancar um erro
                else{
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                    res.write('<p>Pedido não suportado: '+ req.url + '</p>')
                    res.write("<p><a href='/'>Voltar</a></p>")
                    res.end()
                }
                break
            case "POST":
                // POST /alunos/registo --------------------------------------------------------------------
                if(req.url == "/compositores/registo"){
                    collectRequestBodyData(req, result => {
                        if (result){
                            axios.post("http://localhost:3000/compositores/", result)
                                .then(resp => {
                                    res.writeHead(200, {'Location': '/compositores/' + result.id})
                                    res.write("<p>Compositor adicionado com sucesso...</p>")
                                    res.write("<p><a href='/compositores'> [Voltar] </a></p>")
                                    res.end()
                                })
                                .catch( erro => {
                                    res.writeHead(506, {'Content-Type': 'text/html; charset=utf-8'})
                                    res.write('<p>Não foi possivel inserir o compositor...')
                                    res.write('<p>'+erro+'</p>')
                                    res.end()
                                })
                            
                        } else {
                            res.writeHead(507, {'Content-Type': 'text/html; charset=utf-8'})
                            res.write('<p>Não foi possivel inserir o compositor...')
                            res.write('<p>'+erro+'</p>')
                            res.end()
                        }
                    });
                }
    
                // POST /alunos/edit/id --------------------------------------------------------------------
                else if(/\/compositores\/edit\/C[0-9]+$/.test(req.url)){
                    var id = req.url.split("/")[3]
                    collectRequestBodyData(req, result => {
                        if (result){
                            axios.put("http://localhost:3000/compositores/" +id, result)
                                .then(resp => {
                                    res.writeHead(200, {'Location': '/compositores/' + result.id})
                                    res.write("<p>Compositor alterado com sucesso...</p>")
                                    res.write("<p><a href='/compositores'> [Voltar] </a></p>")
                                    res.end()
                                })
                                .catch( erro => {
                                    res.writeHead(506, {'Content-Type': 'text/html; charset=utf-8'})
                                    res.write('<p>Não foi possivel inserir o compositor...')
                                    res.write('<p>'+erro+'</p>')
                                    res.end()
                                })
                            
                        } else {
                            res.writeHead(507, {'Content-Type': 'text/html; charset=utf-8'})
                            res.write('<p>Não foi possivel inserir o compositor...')
                            res.write('<p>'+erro+'</p>')
                            res.end()
                        }
                    });
                }
    
                // POST ? -> Lancar um erro
                else{
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                    res.write('<p>Metodo POST não suportado:'+ req.url + '</p>')
                    res.write("<p><a href='/'>Voltar</a></p>")
                    res.end()
                }
            break

            default: 
                // Outros metodos nao sao suportados
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                res.write('<p>Metodo nao suportado: ' + req.method + '</p>')
                res.end()
        }
    }
})

compositoresServer.listen(3040, ()=>{
    console.log("Servidor à escuta na porta 3040...")
    console.log("http://localhost:3040/compositores")
})


