# -*- coding: utf-8 -*-
import os
import json
import time
import xml.etree.ElementTree as ET
import re
import sys
import zipfile
import shutil
import requests
from lxml import etree

def validateSchema(xmlFile):
    base_dir = os.path.dirname(__file__)  # Diretório base do script
    schema_path = os.path.join(base_dir, "schema.xsd")

    with open(schema_path, 'rb') as xsd_file:
        schema_root = etree.XML(xsd_file.read())
        schema = etree.XMLSchema(schema_root)

    with open(xmlFile, 'rb') as xml_file:
        xml_doc = etree.parse(xml_file)

    is_valid = schema.validate(xml_doc)
    return is_valid

def verify_images(xmlFile, extracted_files):
    nomes = [os.path.basename(conteudo) for conteudo in extracted_files]

    tree = ET.parse(xmlFile)
    root = tree.getroot()
    corpo = root.find("corpo")
    figuras = corpo.findall("figura")

    for figura in figuras:
        imagem = figura.find("imagem")
        path_imagem = imagem.attrib.get("path", None) if imagem is not None else None
        if path_imagem is not None:
            if os.path.basename(path_imagem) not in nomes:
                return 1

    return 0

def verificarContent(extracted_path):
    ret = None
    extracted_files = [os.path.join(root, file) for root, _, files in os.walk(extracted_path) for file in files]

    xml_count = 0
    for file in extracted_files:
        if file.endswith('.xml'):
            xml_count += 1
    
    if xml_count != 1:
        print("Erro, deve existir um e apenas um ficheiro XML")
        shutil.rmtree(extracted_path)
        sys.exit(0)
    
    for file in extracted_files:
        if file.endswith('.xml'):
            is_valid = validateSchema(file)
            if not is_valid:
                print(f"Erro, ficheiro {file} não é válido")
                shutil.rmtree(extracted_path)
                sys.exit(0)
            else:
                val = verify_images(file, extracted_files)
                if val == 1:
                    print(f"Erro, ficheiro {file} não contém as imagens necessárias")
                    shutil.rmtree(extracted_path)
                    sys.exit(0)
                else:
                    ret = xmlToJSON(file)
    return ret

def xmlToJSON(xmlFile):
    nome_todas_antigas = []
    dirPath = os.path.dirname(xmlFile)
    nameFile = os.path.basename(xmlFile)
    base_dir = os.path.dirname(__file__)  # Diretório base do script
    jsonFile = os.path.join(base_dir, "temporario.json")

    # Remover o arquivo JSON se ele existir
    if os.path.exists(jsonFile):
        os.remove(jsonFile)
    else:
        json.dump([], open(jsonFile, "w"), indent=4)

    # Carregar conteúdo existente do JSON se ele existir
    if os.path.exists(jsonFile):
        with open(jsonFile, "r", encoding="utf-8") as f:
            existing_data = json.load(f)
    else:
        existing_data = []

    tree = ET.parse(xmlFile)
    root = tree.getroot()

    meta = root.find("meta")
    _id = meta.find("número").text if meta.find("número") is not None else None
    nome = meta.find("nome").text if meta.find("nome") is not None else None
    freguesia = meta.find("freguesia").text if meta.find("freguesia") is not None else None
    toponimia = meta.find("toponia").text if meta.find("toponia") is not None else None

    path_base = "public/images/imagens/"

    path_guardar = os.path.join(path_base, _id)
    path_guardar_antiga = path_guardar + "/antigas/"
    path_guardar_atuais = path_guardar + "/atuais/"

    corpo = root.find("corpo")
    figuras = corpo.findall("figura")
    info_figuras = []

    for figura in figuras:
        _id_figura = figura.attrib.get("id", None)
        imagem = figura.find("imagem")
        path_imagem = imagem.attrib.get("path", None) if imagem is not None else None
        if path_imagem is None:
            continue

        nome_ficheiro = os.path.basename(path_imagem)
        if nome_ficheiro not in nome_todas_antigas:
            nome_todas_antigas.append(nome_ficheiro)
        
        dest = path_guardar_antiga+""+nome_ficheiro
        base = os.path.split(dirPath)[1]
        origem = "temp/"+base+"/"+nome_ficheiro

        legenda = figura.find("legenda").text if figura.find("legenda") is not None else None
        tipo_path = os.path.join("/images", "imagens", _id, "antigas", nome_ficheiro)
        tipo_path = re.sub(r'\\', '/', tipo_path)
        value = {
            "idImage": _id_figura,
            "path": tipo_path,
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

    novos_ficheiros = []

    # Verificar ficheiros no resto da pasta
    
                                     
    for root, _, files in os.walk("temp"):
        for file in files:
            if not file.endswith('.xml'):
                nome_ficheiro = os.path.basename(file)
                if nome_ficheiro not in nome_todas_antigas:
                    if nome_ficheiro.lower().endswith(('.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG')):
                        dest = path_guardar_atuais +""+nome_ficheiro
                        origem = os.path.join(root, file)
                        destino = os.path.join(path_guardar_atuais, nome_ficheiro)
                        destino = destino.replace("Interface/public", "")
                        destino = destino.replace("..//", "/")
                        novos_ficheiros.append(destino)                   

    cont = 0
    for _ in novos_ficheiros:
        novos_ficheiros[cont] = novos_ficheiros[cont][6:]
        cont+=1
        

    data = {
        "_id": _id,
        "nome": nome,
        "figuras": info_figuras,
        "texto": paragrafo_final,
        "casas": toSave,
        "imagens_atuais": novos_ficheiros,
        "toponimia": toponimia,
        "freguesia": freguesia
    }

    # Adiciona os dados ao JSON existente ou cria um novo JSON
    existing_data.append(data)
    with open(jsonFile, "w", encoding="utf-8") as f:
        json.dump(existing_data, f, ensure_ascii=False, indent=4)
        # Esperar fim da escrita
        f.flush()
        os.fsync(f.fileno())

    url = "http://api:3000/rua"


    base_dir = os.path.dirname(__file__)  # Diretório base do script
    jsonFile = os.path.join(base_dir, "temporario.json")
    with open(jsonFile, "r", encoding="utf-8") as file:
        temporario = json.load(file)
    
    for rua in temporario:
        response = requests.get(url + "/" + data["_id"])
        if response.json() != None:
            print(f"Erro ao adicionar a rua com o id {data['_id']}")
            shutil.rmtree(extracted_path)
            os.remove(jsonFile)
            sys.exit(0)
        else:
            response = requests.post(url, json=rua)
            if response.status_code != 200:
                print(f"Erro ao adicionar a rua com o id {data['_id']}")
                shutil.rmtree(extracted_path)
                os.remove(jsonFile)
                sys.exit(0)
            
            else:
                os.makedirs(path_guardar_antiga, exist_ok=True)
                os.makedirs(path_guardar_atuais, exist_ok=True)
                for root, _, files in os.walk("temp"):
                    for file in files:
                        if not file.endswith('.xml'):
                            nome_ficheiro = os.path.basename(file)
                            if nome_ficheiro not in nome_todas_antigas:
                                if nome_ficheiro.lower().endswith(('.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG')):
                                    dest = path_guardar_atuais +""+nome_ficheiro
                                    origem = os.path.join(root, file)
                                    shutil.copyfile(origem, dest)
                                    destino = os.path.join(path_guardar_atuais, nome_ficheiro)
                                    destino = destino.replace("Interface/public", "")
                                    novos_ficheiros.append(destino)
                
                    for figura in figuras:
                        _id_figura = figura.attrib.get("id", None)
                        imagem = figura.find("imagem")
                        path_imagem = imagem.attrib.get("path", None) if imagem is not None else None
                        if path_imagem is None:
                            continue

                        nome_ficheiro = os.path.basename(path_imagem)
                        if nome_ficheiro not in nome_todas_antigas:
                            nome_todas_antigas.append(nome_ficheiro)
                        
                        dest = path_guardar_antiga+""+nome_ficheiro
                        base = os.path.split(dirPath)[1]
                        origem = "temp/"+base+"/"+nome_ficheiro
                        shutil.copyfile(origem, dest)

                        legenda = figura.find("legenda").text if figura.find("legenda") is not None else None
                        tipo_path = os.path.join("/images", "imagens", _id, "antigas", nome_ficheiro)
                        tipo_path = re.sub(r'\\', '/', tipo_path)
                        value = {
                            "idImage": _id_figura,
                            "path": tipo_path,
                            "legenda": legenda
                        }
                        info_figuras.append(value)

    return (nome_todas_antigas, _id)

if __name__ == "__main__":
    pasta_zip = sys.argv[1]
    extracted_path = 'temp'

    # Extract the ZIP file
    with zipfile.ZipFile(pasta_zip, 'r') as zip_ref:
        zip_ref.extractall(extracted_path)

    result = verificarContent(extracted_path)
    if result is not None:
        (todas_antigas, id_pasta) = result
        print("Ficheiros convertidos com sucesso")
    else:
        print("Erro ao processar o conteúdo.")
        
        
    base_dir = os.path.dirname(__file__)  # Diretório base do script
    jsonFile = os.path.join(base_dir, "temporario.json")
    os.remove(jsonFile)
    

    # Clean up
    shutil.rmtree(extracted_path)