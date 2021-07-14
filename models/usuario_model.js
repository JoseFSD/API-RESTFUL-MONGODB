// requerimos mongoose
const mongoose = require('mongoose');
/*
    creamos nuestro schema (esquema o estructura de nuestra colección)
    esto quiere decir que cada vez que creemos un nuevo usuario, deberá cumplir con la estructura 
    definida en nuestro eschema.
*/
const usuarioSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    estado: {
        type: Boolean,
        default: true
    },
    imagen: {
        type: String,
        required: false
    }
});
/*
    creamos nuestro modelo de datos, de esta forma podremos requerirlo desde cualquier parte
    el nombre para poder utilizarlo será Usuario (U tiene que ser mayúscula por convención)
    y hará referencia al usuarioSchema
*/
module.exports = mongoose.model('Usuario', usuarioSchema);