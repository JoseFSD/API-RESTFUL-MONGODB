// requerimos mongoose
const mongoose = require('mongoose');
/*
    creamos nuestro schema (esquema o estructura de nuestra colección)
    esto quiere decir que cada vez que creemos un nuevo usuario, deberá cumplir con la estructura 
    definida en nuestro eschema.
*/
const usuarioSchema = new mongoose.Schema({
    email: {
        type: String, // el campo email será string
        required: true, // el campo email será requerido para crear el usuario
        unique: true // el campo email será único, en caso de ser repetido la DB no lo creará
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
        type: Boolean, // el campo estado será booleano (solo admitirá true / false)
        default: true // por defecto, en caso de no especificarlo al momento de crearlo, le será asignado true
    },
    imagen: {
        type: String,
        required: false // el campo imagen no será requerido (obligatorio) en el momento de crear el usuario
    }
});
/*
    creamos nuestro modelo de datos, de esta forma podremos requerirlo desde cualquier parte
    el nombre para poder utilizarlo será Usuario (U tiene que ser mayúscula por convención)
    y hará referencia al usuarioSchema
*/
module.exports = mongoose.model('Usuario', usuarioSchema);