import os
import json
import xml.etree.ElementTree as ET
import re
import shutil

path = "./MapaRuas-materialBase"
i = 1


def xmlToJSON(xmlFile, i):
    identificador_ficheiro = os.path.basename(xmlFile).split("-")[1]
    
    # Cria uma pasta, se nao existir, para cada ficheiro XML, criando, se nao existir, la dentro uma pasta atuais e antigas
    pathImages = "./Interface/public/images/imagens/" + identificador_ficheiro
    if not os.path.exists(pathImages):
        os.makedirs(pathImages)
        pathImagensAntigas = pathImages + "/antigas"
        pathImagensAtuais = pathImages + "/atuais"
        if not os.path.exists(pathImagensAntigas):
            os.makedirs(pathImagensAntigas)
        if not os.path.exists(pathImagensAtuais):
            os.makedirs(pathImagensAtuais)
    
    for imagem_antiga in os.listdir(path + "/imagem"):
        nome_imagem = imagem_antiga.split("-")[1]
        valor_questao = int(identificador_ficheiro)
        valor_imagem = int(nome_imagem)

        if valor_questao == valor_imagem:
            shutil.copy2(path + "/imagem/" + imagem_antiga, pathImages + "/antigas")
        
    for imagem_atual in os.listdir(path + "/atual"):
        nome_imagem = imagem_atual.split("-")[0]
        valor_questao = int(identificador_ficheiro)
        valor_imagem = int(nome_imagem)
        if valor_questao == valor_imagem:
            shutil.copy2(path + "/atual/" + imagem_atual, pathImages + "/atuais")
    

    pathImages = pathImages.replace("./Interface/public", "")

    tree = ET.parse(xmlFile)
    root = tree.getroot()

    meta = root.find("meta")
    _id = meta.find("número").text if meta.find("número") is not None else None
    nome = meta.find("nome").text if meta.find("nome") is not None else None
    freguesia = meta.find("freguesia").text if meta.find("freguesia") is not None else None
    toponimia = meta.find("toponia").text if meta.find("toponia") is not None else None
    
    corpo = root.find("corpo")
    figuras = corpo.findall("figura")
    info_figuras = []

    for figura in figuras:
        _id_figura = figura.attrib.get("id", None)
        imagem = figura.find("imagem")
        path_imagem_antiga = imagem.attrib.get("path", None) if imagem is not None else None
        nome_imagem = path_imagem_antiga.split("/")[2]
        path_imagem = pathImages + "/antigas/" + nome_imagem
        legenda = figura.find("legenda").text if figura.find("legenda") is not None else None
        value = {
            "idImage": _id_figura,
            "path": path_imagem,
            "legenda": legenda
        }
        info_figuras.append(value)
    
    paragrafos = corpo.findall("para")
    info_paragrafos = []
    referencias = []
    datas_numericas = []
    entidades = []

    for paragrafo in paragrafos:
        info = "".join(paragrafo.itertext()).replace('\n', ' ').strip()
        info = re.sub(r'\s+', ' ', info)
        info_paragrafos.append(info)

        lugares = paragrafo.findall("lugar")
        for lugar in lugares:
            lugar_endireitado = lugar.text.replace("\n", "").strip() if lugar.text is not None else None
            lugar_endireitado = re.sub(r'\s+', ' ', lugar_endireitado)
            if lugar_endireitado not in referencias:
                referencias.append(lugar_endireitado)

        datas = paragrafo.findall("data")
        for data in datas:
            data_endireitada = data.text.replace("\n", "").strip() if data.text is not None else None
            data_endireitada = re.sub(r'\s+', ' ', data_endireitada)
            if data_endireitada not in datas_numericas:
                datas_numericas.append(data_endireitada)

        entidades_nomeadas = paragrafo.findall("entidade")
        for entidade_nomeada in entidades_nomeadas:
            entidade_nomeada_endireitada = entidade_nomeada.text.replace("\n", "").strip() if entidade_nomeada.text is not None else None
            entidade_nomeada_endireitada = re.sub(r'\s+', ' ', entidade_nomeada_endireitada)
            if entidade_nomeada_endireitada not in entidades:
                entidades.append(entidade_nomeada_endireitada)
    
    paragrafo_final = ""

    for paragrafo in info_paragrafos:
        paragrafo_final += paragrafo + "\n"

    lista_das_casas = corpo.findall("lista-casas/casa")
    toSave = []

    for casa in lista_das_casas:
        _id_casa = casa.find("número").text if casa.find("número") is not None else None
        enfiteuta = casa.find("enfiteuta").text if casa.find("enfiteuta") is not None else None
        foro = casa.find("foro").text if casa.find("foro") is not None else None
        descricao = casa.find("desc")
        desc = ""
        if descricao is not None:
            desc = "".join(descricao.itertext()).replace('\n', ' ').strip()
            desc = re.sub(r'\s+', ' ', desc)
        else:
            desc = None
        info_casa = {
            "numero_porta": _id_casa,
            "enfiteuta": enfiteuta,
            "foro": foro,
            "descricao": desc
        }
        toSave.append(info_casa)
    
    pathio = "Interface/public/images/imagens/" + identificador_ficheiro + "/atuais"

    imgs_atuais = []
    for imagem_atual in os.listdir(pathio):
        pathImage = pathio + "/" + imagem_atual
        aux = pathImage.replace("Interface/public", "")
        imgs_atuais.append(aux)
    

    data = {
        "_id": int(_id),
        "nome": nome,
        "figuras": info_figuras,
        "texto": paragrafo_final,
        "casas": toSave,
        "imagens_atuais": imgs_atuais,
        "toponimia": toponimia,
        "freguesia": freguesia
    }
    
    return data

pathXML = path + "/texto"
all_data = []

# Criar pasta images se nao existir
pathImages = "./Interface/public/images/imagens/"
if not os.path.exists(pathImages):
    os.makedirs(pathImages)

for filename in os.listdir(pathXML):
    file = os.path.join(pathXML, filename)
    
    if file.endswith(".xml"):
        json_data = xmlToJSON(file, i)
        i+=1
        all_data.append(json_data)

# Save all data to a single JSON file
output_file = os.path.join("", "ruas.json")
with open(output_file, "w", encoding="utf-8") as f:
    json.dump(all_data, f, ensure_ascii=False, indent=4)
