# Construir páginas em html através do node JS e com dados de um JSON

## Objetivo:
1. Construir uma página que mostre todos os filmes por nome e que hiperligue para cada um deles.
2. Construir páginas individuais para cada um dos filmes.
3. Construir uma página que mostre o nome de todos os atores por nome e que hiperligue para cada um deles.
4. Construir páginas individuais para cada um dos atores.
5. Construir uma página que mostre o nome de todos os géneros de filmes e que hiperligue para cada um deles.
6. Construir páginas individuais para cada um dos géneros de filmes.


## Resolução:

Em primeiro lugar, foi necessário corrigir o dataset, visto que não estava com a estrutura correta para correr. Para isso foi desenvolvido um pequeno programa em Python de modo a resolver esse problema. Para isso foi utilizado a biblioteca `re` e algumas funcções de manipulação de texto.

Em seguida, foi necessário a utilização do JavaScript.


1. Para apresentar todos os nomes dos filmes e hiperligar para cada um deles, foi necessário a utilização do **node.js**. Fazemos o seguinte:
   - Acedemos ao json através do comando `axios.get("http://localhost:3000/filmes")`.
   - Iteramos sobre todos os filmes de modo a escrever em html o seu nome e criar uma hiperligação para o seu id.

2. Para apresentar cada filme em específico:
   - Acedemos ao input do utilizador através de uma expressão regular que apanha o id do filme.
   - Através de `axios.get("http://localhost:3000/filmes?_id.$oid=" + id)` conseguimos rapidamente aceder a informações específicas de cada filme.
   - Indicar o seu nome, género, atores e datas.

3. Para apresentar o nome de todos os atores:
   - Acedemos ao json através do comando `axios.get("http://localhost:3000/filmes")`.
   - Iteramos sobre todos os filmes e criamos um set de modo a colocar, sem repetição o nome de todos os atores.
   - Criamos uma hiperligação para cada um deles, através do seu nome.

4. Para apresentar a página de cada ator:
   - Acedemos ao json através do comando `axios.get("http://localhost:3000/filmes")`.
   - Acedemos ao input do utilizador através de uma expressão regular que apanha o nome do ator.
   - Iteramos sobre todos os filmes e verificamos se o nome do ator está presente no filme.

5. Para apresentar o nome de todos os géneros de filmes:
   - Acedemos ao json através do comando `axios.get("http://localhost:3000/filmes")`.
   - Iteramos sobre todos os filmes e criamos um set de modo a colocar, sem repetição o nome de todos os géneros de filmes.
   - Criamos uma hiperligação para cada um deles, através do seu nome.

6. Para apresentar a página de cada género de filme:
   - Acedemos ao json através do comando `axios.get("http://localhost:3000/filmes")`.
   - Acedemos ao input do utilizador através de uma expressão regular que apanha o nome do género.
   - Iteramos sobre todos os filmes e verificamos se o nome do género está presente no filme.

7. Para apresentar a página "Menu":
   - Criei uma hiperligação para cada uma das páginas anteriores.

8. Para apresentar a página "Erro":
   - Criei uma página que mostra o tipo de erro encontrado.


### Rodar o programa
Para rodar o programa faça em terminais diferentes:

1. `json-server --watch filmes-fixed.json`
2. `node server.js`

Fazendo isso, irá aparecer no output do terminal **2.**, a seguinte mensagem:

`Servidor à escuta na porta 2602...`

Onde poderá abrir o link e iniciar a navegação pelos vários filmes.


