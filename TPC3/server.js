var  http = require("http");
var url = require("url");
var axios = require("axios");

http.createServer((req, res) => {

    var q = url.parse(req.url, true);


    if(q.pathname == "/"){
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.write("<h1>Índice: </h1>");
        res.write("<ul>");
        res.write("<li><a href='http://localhost:2602/filmes'>Filmes</a></li>");
        res.write("<li><a href='http://localhost:2602/atores'>Atores</a></li>");
        res.write("<li><a href='http://localhost:2602/generos'>Géneros</a></li>");
        res.write("</ul>");

    }
    else if (q.pathname == "/filmes") {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        axios.get("http://localhost:3000/filmes")
            .then(resp => {
                
                let lista = resp.data

                res.write("<h1>Filmes: </h1>");
                res.write("<ul>");

                for(elem in lista){
                    var link = "http://localhost:2602/filmes/" + lista[elem]._id.$oid
                    res.write("<li><a href='" + link + "'>" + lista[elem].title + "</a></li>")
                }
                res.write("</ul>");
                res.end();
            })
            .catch(err => {
                res.write("Erro: " + err);
                res.end();
            });
    }
    else if (q.pathname.match(/\/filmes\/(.+)/)) {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        let id = q.pathname.substring(8);
        axios.get("http://localhost:3000/filmes?_id.$oid=" + id)
            .then(resp => {

                let filme = resp.data
                
                res.write("<h1>" + filme[0].title + "</h1>");
                res.write("<p><b>Year:</b> " + filme[0].year + "</p>");
                res.write("<p><b>Cast:</b> " + filme[0].cast + "</p>");
                res.write("<p><b>Gernres:</b> " + filme[0].genres + "</p>");
                res.end();


            })
            .catch(err => {
                res.write("Erro: " + err);
                res.end();
            });
    }
    else if (q.pathname == "/atores") {

        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        axios.get("http://localhost:3000/filmes")
            .then(resp => {
                
                let lista = resp.data

                let atoresSet = new Set();

                for(elem in lista){
                    var atores = lista[elem].cast

                    for (let i = 0; i < atores.length; i++) {
                        atoresSet.add(atores[i]);
                    }
                }

                res.write("<h1>Atores: </h1>");
                res.write("<ul>");

                atoresSet.forEach(ator => {
                    var link = "http://localhost:2602/atores/" + ator
                    res.write("<li><a href='" + link + "'>" + ator + "</a></li>")
                });

                res.write("</ul>");
                res.end();

            })
            .catch(err => {
                res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
                res.write("Erro: " + err);
                res.end();
            });
    
        
    }
    else if (q.pathname.match(/\/atores\/(.+)/)) {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        let ator1 = q.pathname.substring(8);
        axios.get("http://localhost:3000/filmes")
            .then(resp => {

                let ator = ator1.replace(/%20/g, ' ');

                let lista = resp.data

                let moviesSet = new Set();

                for(elem in lista){
                    var atores = lista[elem].cast

                    for (let i = 0; i < atores.length; i++) {
                        if(atores[i] == ator){
                            moviesSet.add(lista[elem].title);
                        }
                    }
                }

                res.write("<h1>" + ator +"</h1>");
                res.write("<ul>");

                moviesSet.forEach(filme => {
                    res.write("<li>" + filme + "</li>")
                });

                res.write("</ul>");
                res.end();


            })
            .catch(err => {
                res.write("Erro: " + err);
                res.end();
            });
    }
    else if (q.pathname == "/generos") {

        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        axios.get("http://localhost:3000/filmes")
            .then(resp => {
                
                let lista = resp.data

                let generosSet = new Set();

                for(elem in lista){
                    var generos = lista[elem].genres

                    if(generos != null){
                        for (let i = 0; i < generos.length; i++) {
                            generosSet.add(generos[i]);
                        }   
                    }
                    else{
                        generosSet.add("Undefined");
                    }
                    
                }

                res.write("<h1>Géneros: </h1>");
                res.write("<ul>");

                generosSet.forEach(genero => {
                    var link = "http://localhost:2602/generos/" + genero
                    res.write("<li><a href='" + link + "'>" + genero + "</a></li>")
                });

                res.write("</ul>");
                res.end();

            })
            .catch(err => {
                res.write("Erro: " + err);
                res.end();
            });
    
        
    }
    else if (q.pathname.match(/\/generos\/(.+)/)) {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        let ator1 = q.pathname.substring(9);
        axios.get("http://localhost:3000/filmes")
            .then(resp => {

                let genero = ator1.replace(/%20/g, ' ');

                let lista = resp.data

                let moviesSet = new Set();

                for(elem in lista){
                    var generos = lista[elem].genres

                    if(generos != null){
                        for (let i = 0; i < generos.length; i++) {
                            if(generos[i] == genero){
                                moviesSet.add(lista[elem].title);
                            }
                        }
                    }
                    else{
                        if(genero == "Undefined"){
                            moviesSet.add(lista[elem].title);  
                        }
                        
                    }
                }

                res.write("<h1>" + genero +"</h1>");
                res.write("<ul>");

                moviesSet.forEach(filme => {
                    res.write("<li>" + filme + "</li>")
                });

                res.write("</ul>");
                res.end();


            })
            .catch(err => {
                res.write("Erro: " + err);
                res.end();
            });
    }
     else {
        res.write("Erro")
        res.end();
    }

}).listen(2602);

console.log("Servidor à escuta na porta 2602...");
console.log("http://localhost:2602")
console.log("http://localhost:2602/filmes")
console.log("http://localhost:2602/atores")
console.log("http://localhost:2602/generos")
