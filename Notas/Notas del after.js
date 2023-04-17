// Paso 0: Poner el type module con  npm init -y en el package.json justo antes de scripts y después de main.

// Paso 1: Instalar Nodemon de forma  global: "npm install -g nodemon"

// Paso 2: Instalar express de forma local "npm install express"

// Paso 3: Crear una carpeta "src"

// Paso 4: Crear un archivo "app.js" dentro del directorio "src"

// Paso 5: hacer el "import express from 'express'; " y const app = express();

// Paso 6: Poner el servidor en modo escucha con "app.listen(8080,()=>console.log('Listening on port 8080'))"

// Paso 7: Crear el método GET: "app.get('/rutaindicada',(request,response)=>{response.send('Hola express');})"

//Paso 8: En el navegador ES IMPORTANTE INDICAR LA RUTA DESPUÉS DEL PUERTO, ej, en el paso 6 indicamos que es el puerto 8080, entonces sería
// localhost:8080/rutaindicada

// Paso 9: DESAFIO ENTREGABLE: Para hacer el desafío entregable creamos un nuevo endpoint: app.get('/bienvenida',(request,response)=>{})

// Paso 10: Y dentro de {} escribimos un H1 que diga Bienvenido: app.get('/bienvenida',(request,response)=>{response.send(`<h1>Bienvenido</h1>`)})


