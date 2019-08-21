# Microsserviços-NodeJS

## endpoint /uploads

1. Abra o executável através das teclas Windows + R

2. Digite CMD e pressione ENTER

3. Navegue até o diretório que contém a imagem, no meu caso (cd C:\Users\Administrador\Picures)

4. informe o comando abaixo:

curl -X POST -H "Content-Type:image/png" --data-binary "@wifrane033.png" http://localhost:3000/uploads/sample_02.png

Nota

-X --request <command> Especifica o comando de requisição a ser usado

-H --header <header / @ file> Define cabeçalho (s) personalizado (s) para o servidor

node imagini

test: 
http://localhost:3000/thumbnail.png

http://localhost:3000/thumbnail.png?width=600

http://localhost:3000/thumbnail.png?width=600&height=350

http://localhost:3000/thumbnail.png?width=600&height=350&fgcolor=cyan
