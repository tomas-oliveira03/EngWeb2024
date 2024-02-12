# Construir páginas estáticas em HTML 

## Objetivo:
1. Construir a primeira página contendo todos os índices dos nomes das ruas e com anchor tags que redirecionem para uma página especifica da rua.
2. Essa página terá todas as informações relativas à rua, assim como um link para voltar à página de índices.

Fazer para uma ou duas ruas!

## Resolução:

Para a página de índice inicial, através da biblioteca _os_ do Python, consegui aceder aos nomes dos ficheiros, _.xml_ de modo a saber todas as ruas existentes. Depois ordenei toda a lista de ruas.

Cada rua tem uma hiperligação para o _.hmtl_ da mesma, através de um script em Python. Para fazer o parse de cada um dos _.xml_ decidi utilizar as bibliotecas **xmltodict** e **BeautifulSoup**. Para cada uma das página temos as seguintes informações:

- Nome da rua e o seu número lido através das tags **meta** do xml.
- Informações acerca da rua, localizado no corpo do html em cada tag **para**. As outras tags dentro dessa forma ignoradas, visto que são variáveis e a sua personalização teria de ser feito manualmente.
- Lista de casas lida através da tag **lista-casas**, onde é possível obter algumas informações específicas acerca das várias casas.
- Imagem antigas com várias vistas, dentro das tags **figura**, onde era necessário direcionar a imagem para o seu respetivo path.
- Imagens atuais das ruas, coisa que não está dentro do .xml mas que é possível aceder, visto que na pasta atual é possíel ver isso mesmo. Como para cada rua existiam duas vistas em .png com o nome da rua como nome da imagem era possível aceder às mesmas através do script.
- Hiperligação para voltar para o índice inicial.

## Notas:

Em primeiro lugar, referir que existe um warning no **BeautifulSoup** ao ler o ficheiro _.xml_. Este warning não foi possível remover, mas em nada afeta os resultados obridos, daí o uso da biblioteca _warnings_.

Apesar de no enunciado apenas serem pedidos "2 ou 3 páginas html das ruas", decidi fazer com que o script fosse geral o suficiente para construir a página para todas.

Assim sendo o programa tem **59 ruas** com as suas respetivas páginas totalmente completas e funcionais e uma página, a página 58, onde as imagens antigas não carregam porque o path do _.xml_ direciona para uma imagem que não existe, visto que o seu nome se encontra desformatado.

### Caso específico (Rua 58):

Path da imagem no _.xml_:
```
<imagem path="../imagem/MRB-58-RuaDaCónega-sul.jpg"/>
```

Nome da imagem na diretoria _atual_:

```
MRB-58-RuaDaC┬ónega-norte.jpg
```
