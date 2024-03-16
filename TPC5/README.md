# Compositores de Música

## Objetivo:
Criar uma aplicação para a gestão de uma base de dados de compositores musicais através do `express`:
1. Montar a API de dados com o json-server a partir do dataset de compositores em anexo;
2. Criar uma aplicação Web com as seguintes caraterísticas:
    1. CRUD sob re compositores;
    2. CRUD sobre periodos musicais.
3. Investigar e inserir pelo menos 5 compositores do período moderno ou serialista.


## Resolução:


Para construir o programa em primeiro lugar foi necessário utilizar a biblioteca `axios` para aceder ao nosso json. Para além disso, decidi adicionar um outro dicionario json chamdao periodos, visto que será necessário para o futuro. 

Como é necessário seguir o método CRUD decidi:

Para os compositores e para os períodos a ideologia é mesma logo irei explicar os dois juntos.

1. **Método GET all**
    - Para ler, utilizar `axios.get()`.
    - De seguida, decidi aceder às views, e através do que foi lido anteriormente criar uma página web que mostre o conteúdo lido.


2. **Método Retreive one**
    - Para ler, utilizar `axios.get()`.
    - De seguida, através do id apresentado, irei aceder a um template e mostrar informações acerca daquele id específico.


3. **Método Retreive**
    - Para eliminar, utilizar `axios.delete()`.
    - De seguida, apresentar uma página que indica se foi ou não possível eliminar o determinado id.


4. **Método Delete**
    - Para eliminar, utilizar `axios.delete()`.
    - De seguida, apresentar uma página que indica se foi ou não possível eliminar o determinado id.


5. **Método Update**
    - Para ler o que o user insere, utilizar `axios.get()`.
    - De seguida, apresentar uma página forms onde o utilizador pode alterar os dados que pretender.
    - Para atualizar usar `axios.put()`.


6. **Método Create**
    - Para ler o que o user insere, utilizar `axios.get()`.
    - De seguida, apresentar uma página forms onde o utilizador pode inserir os dados que pretender.
    - Para atualizar usar `axios.post()`.


Existem vários detalhes neste programa, por exemplo, ao inserir um compositor, na secção dos períodos, foi gerado um botão de dropdown onde é possível selecionar um dos períodos existentes no ficheiro json. Para além disso, existe em cada uma das páginas sempre uma anchor tag para redirecionar o utilizador para o índice, página principal, se pretender.

Em relação a esta versão, é praticamente tudo igual ao tpc anterior, a única diferença é que usamos o express para gerarmos as templates em `.pug` e redirecionamos para cada um deles, tornando este processo muito mais fácil e prático.


### Rodar o programa
Para rodar o programa faça em terminais diferentes:

1. `json-server --watch compositores.json`
2. `npm start`

Fazendo isso, irá aparecer no output do terminal **2.**, a seguinte mensagem:

`Servidor à escuta na porta 3040...`

Onde poderá abrir o link e iniciar a navegação pelos vários compositores e seus períodos.


