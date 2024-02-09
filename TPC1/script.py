import os
import warnings

import xmltodict
from bs4 import BeautifulSoup


def constuirHTMLcasas(casa, ruaHTML, contador):
    ruaHTML += f"<hr><h4>Casa nº{casa['número']}: </h4>"
    ruaHTML += f"<p><b>- Enfiteuta: </b>{casa.get('enfiteuta', '---')}</p>"
    ruaHTML += f"<p><b>- Foro: </b>{casa.get('foro', '---')}</p>"

    desc = sp.select_one(f"casa:nth-of-type({contador}) > desc")
    if desc is None:
        ruaHTML += f"<p><b>- Descrição: </b>---</p>"
    else:
        ruaHTML += f"<p><b>- Descrição: </b>{desc.get_text()}</p>"

    return ruaHTML



# HTML para o índice
html = """
<!DOCTYPE html>
<html lang="pt PT">
<head>
    <title>Índice</title>
    <meta charset="utf-8">
</head>

<body>
"""


# HTML para cada uma das ruas
ruaHtml = """
<!DOCTYPE html>
<html lang="pt PT">
<head>
"""

# Criar pasta
os.mkdir("Ruas")

# Ler nomes de todas as ruas
all_files = []
all_ruas = []
for rua in os.listdir("./MapaRuas-materialBase/texto"):
    all_files.append(rua)
    all_ruas.append(rua.split("-")[2].split(".xml")[0])

# Escrever html índice de ruas
html += "<ul>"
for rua in sorted(all_ruas):
    html += f"<li><a href='./Ruas/{rua}.html'>{rua}</a></li>"

# Escrever html índice de ruas
cont = 0
for rua in all_ruas:
    cont += 1
    ruaHTML = ruaHtml

    ruaHTML += f"""
<title>Rua {cont}</title>
<meta charset="utf-8">
</head>

<body>
"""

    with open(f"./MapaRuas-materialBase/texto/{all_files[cont-1]}", "r+", encoding="utf-8") as ruaXML:
        ficheiroXML = ruaXML.read()
        ruaDict = xmltodict.parse(ficheiroXML)
        meta = ruaDict['rua']['meta']
        corpo = ruaDict['rua']['corpo']
        figuras = corpo['figura']
        informacoes = corpo['para']
        casas = corpo.get('lista-casas', None)


        all_images = []
        if isinstance(figuras, list):
            for fig in figuras:
                all_images.append(("../MapaRuas-materialBase"+fig['imagem']['@path'][2:], fig['legenda']))
        else:
            all_images.append(("../MapaRuas-materialBase"+figuras['imagem']['@path'][2:], fig['legenda']))

        ruaHTML += f"<h1><b>{meta['nome']}</b></h1>"
        ruaHTML += f"<h2>Número: {meta['número']}</h2><hr>"


        # Informações da rua
        with warnings.catch_warnings():
            # Warning que não consegui retirar do Beautiful Soup mas que em nada afeta o resultado final
            warnings.simplefilter("ignore")
            sp = BeautifulSoup(ficheiroXML, "lxml")
        ruaHTML += "<br><h3>Informações: </h3>"


        for para in sp.select("corpo > para"):
            text = para.get_text()
            ruaHTML += f"<p>{text}</p>"


        # Lista de casas da rua
        ruaHTML += "<br><h3>Lista de casas: </h3>"
        contador = 1
        if casas is None:
            ruaHTML += "<p>Não existem casas associadas a esta rua.</p>"
        else:
            if isinstance(casas, dict):

                multiplasCasas = casas['casa']
                if isinstance(multiplasCasas, dict):
                    ruaHTML = constuirHTMLcasas(casa, ruaHTML, contador)
                else:

                    for casa in multiplasCasas:
                        ruaHTML = constuirHTMLcasas(casa, ruaHTML, contador)
                        contador += 1

            else:
                for lista_casa in casas:
                    multiplasCasas = lista_casa['casa']
                    for casa in multiplasCasas:
                        ruaHTML = constuirHTMLcasas(casa, ruaHTML, contador)
                        contador += 1
            ruaHTML += "<hr>"

        #for para in sp.findAll("casa"):
        #    text = para.get_text()
        #    ruaHTML += f"<p>{text}</p>"





        # Imagens da rua
        ruaHTML += "<br><h3>Imagens antes: </h3><table>"
        for entry in all_images:
            ruaHTML += f"""
            <tr>
                <td><b>{" ".join(entry[1].split("-")[1:])}</b></th>
                <td><img src="{entry[0]}" alt="{entry[1]}" height="100px"></th>
            </tr>
            """
        ruaHTML += "</table>"


        ruaHTML += "<br><h3>Imagens depois: </h3><table>"
        ruaHTML += f"""
                    <tr>
                        <td><b>Vista1</b></th>
                        <td><img src="{"../MapaRuas-materialBase/atual/"+str(cont)+'-'+rua+'-Vista1.JPG'}" alt="Vista1" height="100px"></th>
                    </tr>
                    <tr>
                        <td><b>Vista2</b></th>
                        <td><img src="{"../MapaRuas-materialBase/atual/"+str(cont)+'-'+rua+'-Vista2.JPG'}" alt="Vista2" height="100px"></th>
                    </tr>
                    """
        ruaHTML += "</table>"



    ruaHTML += f"<br><a href='../indice.html'>Voltar para o índice</a>"
    ruaHTML += "\n</body>"

    with open(f"./Ruas/{rua}.html", "w", encoding="utf-8") as ficheiroHTML:
        ficheiroHTML.write(ruaHTML)


html += "</ul>"
html += "</body>"

with open("indice.html", "w", encoding="utf-8") as ficheiroHTML:
    ficheiroHTML.write(html)





