import re

cont = 0
with open("filmes.json", encoding="utf-8") as file:
    filmes = file.read()

correct_file = re.sub(r'^({.*?})$', r'\1,', filmes, flags=re.M)[:-2]

correct_file = '{\n"filmes":[\n' +correct_file + ']}'



with open("filmes-fixed.json", "w", encoding="utf-8") as file:
    file.write(correct_file)

