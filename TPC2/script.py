import json
import os

# HTML para cada uma das ruas
cidadeHtml = """
<!DOCTYPE html>
<html lang="pt PT">
<head>
"""

# Criar pasta
os.mkdir("Cidades")

file = open("mapa-virtual.json", "r", encoding="utf-8").read()
dict = json.loads(file)

cidades_list = dict["cidades"]
ligacoes_list = dict["ligações"]

for cidade in cidades_list:
    id = cidade["id"]
    nome = cidade["nome"]
    populacao = cidade["população"]
    descricao = cidade["descrição"]
    distrito = cidade["distrito"]


    cityHtml = cidadeHtml
    cityHtml += f"""
    <title>Cidade n{id[1:]}</title>
    <meta charset="utf-8">
    </head>

    <body>
    """

    cityHtml += f"<h1>{nome}</h1>"
    cityHtml += f"<h3>Número: {id}</h3>"
    cityHtml += "<hr>"
    cityHtml += f"<p><b>Distrito: </b>{distrito}</p>"
    cityHtml += f"<p><b>População: </b>{populacao}</h3>"
    cityHtml += f"<p><b>Descrição: </b>{descricao}</h3>"
    cityHtml += "<hr>"
    cityHtml += "<h3>Ligações:</h3>\n<ul>\n"

    for ligacao in ligacoes_list:
        if ligacao["origem"] == id:
            idViagem = ligacao["id"]
            destino = ligacao["destino"]
            distancia = ligacao["distância"]
            
            for city in cidades_list:
                if city["id"] == destino:
                    cityHtml += f"<li><a href = 'http://localhost:1902/{destino}'>{city['nome']}</a></li>"
                    break
                
            
            
            cityHtml += f"<ul>\n<li><b>Distância: </b>{distancia}</li>"
            cityHtml += f"<li><b>Id: </b>{idViagem}</li>\n</ul>"
    cityHtml += "</ul>\n\n\n"
    cityHtml += "<a href = 'http://localhost:1902/'>Voltar ao Menu</a>"
    cityHtml += "</body>"

    with open(f"./Cidades/{id}.html", "w", encoding="utf-8") as ficheiroHTML:
        ficheiroHTML.write(cityHtml)

