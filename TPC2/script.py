import json
import os

# HTML para o índice
html = """
<!DOCTYPE html>
<html lang="pt PT">
<head>
    <title>Índice</title>
    <meta charset="utf-8">
</head>

<body>
    <h1> Índice </h1>
"""


# HTML para cada uma das ruas
cidadeHtml = """
<!DOCTYPE html>
<html lang="pt PT">
<head>
"""

# Criar pasta
os.mkdir("Cidades")

file = open("mapa.json", "r", encoding="utf-8").read()
dict = json.loads(file)

cidades_list = dict["cidades"]

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
    cityHtml += f"<p><b>Distrito: </b>{distrito}</p>"
    cityHtml += f"<p><b>População: </b>{populacao}</h3>"
    cityHtml += f"<p><b>Descrição: </b>{descricao}</h3>"

    with open(f"./Cidades/{nome}.html", "w", encoding="utf-8") as ficheiroHTML:
        ficheiroHTML.write(cityHtml)




html += "</ul>"
html += "</body>"

#with open("indice.html", "w", encoding="utf-8") as ficheiroHTML:
#    ficheiroHTML.write(html)





