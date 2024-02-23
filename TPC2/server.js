var http = require('http');
var url = require('url');
var fs = require('fs');


http.createServer((req, res) => {

    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});

    var q = url.parse(req.url, true);

    var lastIndex = q.pathname.lastIndexOf("/c");
    var cityPage = ""
    if(lastIndex !== -1){
        cityPage = q.pathname.substring(lastIndex+1)
    }

    if(q.pathname == "/"){

        fs.readFile('indice.html', (err, file) => {
            res.write(file);
            res.end();
        });      

    }
    else if (cityPage !== ""){
        var fileName = "Cidades/" + cityPage + ".html"
        fs.readFile(fileName, (err, file) => {
            res.write(file);
            res.end();
        });      

    }
    else{
        res.write("Operação não suportada")
    }

}).listen(1902);

console.log('Servidor à escuta em http://localhost:1902/');