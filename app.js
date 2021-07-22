// requerimos la librería express y mongoose que son las que instalamos al principio
const express = require('express');
const mongoose = require('mongoose');
const usuarios = require('./routes/usuarios_routes');
const cursos = require('./routes/cursos_routes');
const auth = require('./routes/auth_routes');
const config = require('config')

/* 
    nos conectamos a nuestra base de datos, para ello antes necesitamos haberla requerido anteriormente
    usamos su método connect para conectarnos a ella. Para mas información sobre los métodos de mongoose
    puedes consultar documentación oficial en https://mongoosejs.com/
*/
mongoose.connect(config.get('configDB.HOST'), {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    // ya que mongoose.connect nos devuelve una promesa utilizamos "then / catch" para detectar si ha salido todo bien y en caso de 
    // fallo que nos muestre el error en la conexión por consola
    .then(() => console.log('Conectado a la base de datos DEMO!!'))
    .catch((err) => console.log('No se pudo conectar a la bade datos DEMO... ', err));
// para esta versión de mongoose, nos aparece en la consola cada vez que levantamos el servicio el mensaje de DeprecationWarning
// por utilizar ensureIndex. La consola nos sugiere utilizar useCreateIndex en su lugar y lo corregimos con la siguiente expresión
mongoose.set('useCreateIndex', true);

// por convención creamos la constante "app" que es una instancia de express
const app = express();

app.use(express.json()); // indicamos a express que queremos hacer uso del método JSON, que nos permitirá leer de este formato
app.use(express.urlencoded({ extended: true })); // en este caso, igual que con json, estamos indicando que queremos utilizar urlencoded, que nos va a permitir leer parámetros recibidos desde el BODY
app.use('/api/usuarios', usuarios); // le estamos diciendo a express que vamos a utilizar la ruta /api/usuarios y /api/cursos
app.use('/api/cursos', cursos); // hay que tener en cuenta que ambas rutas se exportan al final del archivo routes/usuarios_routes.js y routes/cursos_routes.js
app.use('/api/auth', auth); // hay que tener en cuenta que ambas rutas se exportan al final del archivo routes/usuarios_routes.js y routes/cursos_routes.js

// declaramos la constante "port" a la que se le asignará el número del puerto 
// desde donde se ejecutará nuestro servicio
const port = process.env.PORT || 3000; // en caso de existir una variable de entorno recibirá el parámetro de esta y en caso de no existir se le asignará 3000 por defecto

// el método listen de express nos permite escuchar el puerto y en este caso lanzar el mensaje siguiente por consola
app.listen(port, () => {
    console.log(`Api RESTFul ejecutándose en puerto ${port}`);
});