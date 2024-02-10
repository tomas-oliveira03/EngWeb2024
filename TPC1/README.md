# Construir página estática em html 

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

Apesar de no enunciado apenas serem pedidos "2 ou 3 páginas html das ruas", decidi fazer com que o script fosse geral o suficiente para construir a página para todas. Infelizmente não consegui carregar algumas fotografias de algumas das ruas, visto que os seus nomes estavam desfromatados. Logo, para esses casos a imagem não carrega, visto que não é possível fazer com que o path reconheça a imagem.

Assim sendo o programa tem **24 ruas** com as suas respetivas páginas totalmente completas e **36 ruas** onde algumas imagens não carregam devido à desformatação do nome das imagens referido acima.

As ruas toalmente completas são as que têm número:
**1,2,5,7,8,11,12,13,18,21,22,24,27,28,34,40,41,50,51,52,54,55,56,57**
