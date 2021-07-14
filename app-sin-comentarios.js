// requires
const express = require('express');
const mongoose = require('mongoose');
const usuarios = require('./routes/usuarios_routes');
const cursos = require('./routes/cursos_routes');

// conectamos con la base de datos
mongoose.connect('mongodb://localhost:27017/demo', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Conectado a la base de datos DEMO!!'))
    .catch((err) => console.log('No se pudo conectar a la bade datos DEMO... ', err));

// instanciamos express
const app = express();

// utilizamos los recursos que necesitamos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/usuarios', usuarios);
app.use('/api/cursos', cursos);

// definimos el número del puerto
const port = process.env.PORT || 3000;

// ponemos el servicio en escucha en el puerto definido
app.listen(port, () => {
    console.log(`Api RESTFul ejecutándose en puerto ${port}`);
});