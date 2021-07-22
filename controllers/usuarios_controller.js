// requerimos nuestro modelo Usuario
const Usuario = require('../models/usuario_model');
// requerimos nuestra librería de validadores
const Joi = require('@hapi/joi');
// requerimos nuestra librería de encriptado
const bcrypt = require('bcrypt');

/*
    CONFIGURANDO VALIDADORES CON JOI 
    PRIMERO, creamos el esquema y definimos nuestros validadores
*/
const schema = Joi.object({
    nombre: Joi.string() // tipo string
        .min(3) // mínimo 3 caracteres
        .max(20) // máximo 20 caracteres
        .required(), // requerido

    password: Joi.string()
        .pattern(/^[a-zA-Z0-9]{3-30}$/), // puede contener letras minúsculas, mayúsculas y números. Además deberá ser entre 3 y 30 caracteres

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'es'] } }) // el email debe contener la extensión del dominio --> com / net / es
});

// devuelve todos los usuarios de nuestra colección Usuario
async function todosUsuarios(req, res) {
    try {
        const resultado = await Usuario.find()
            .select({ nombre: 1, email: 1 }); // para que solo nos devuelva el nombre y el email (en caso contrario también nos devolvería datos sensibles como la contraseña, estamos comenzando a proteger los datos de nuestros usuarios)

        res.status(200).json({
            listadoUsuarios: resultado
        })
    } catch (err) {
        res.status(400).json(err)
    };
}

// devuelve todos los usuarios "activos" de nuestra colección Usuario
async function todosUsuariosActivos(req, res) {
    try {
        const resultado = await Usuario.find({ estado: true })
            .select({ nombre: 1, email: 1 });

        res.status(200).json({
            listadoUsuarios: resultado
        })
    } catch (err) {
        res.status(400).json(err)
    };
}

// CREAR un nuevo usuario
async function crearUsuario(req, res) {

    // comprobación de si el email ya existe (solo para la creación de usuarios)
    Usuario.findOne({ email: req.body.email }, (err, user) => {
        // si hay un error
        if (err) {
            return res.status(400).json({ error: 'Server error' });
        }
        // si el usuario existe
        if (user) {
            return res.status(400).json({ mensaje: 'Ya existe un usuario con ese email registrado' })
        }
    });

    // SEGUNDO, utilizamos nuestro validador, para el nombre y el email
    const { error, value } = schema.validate({ nombre: req.body.nombre, email: req.body.email });

    // TERCERO, si hay error, muéstramelo en formato json
    if (error) res.status(400).json({ validationError: error });
    try {
        let usuario = new Usuario({
            email: req.body.email,
            nombre: req.body.nombre,
            password: bcrypt.hashSync(req.body.password, 10) // utilizamos la función bcrypt para encriptar la contraseña
        });

        const resultado = await usuario.save();

        res.status(200).json({
            usuarioCreado: resultado.nombre,
            email: usuario.email
        })
    } catch (err) {
        res.status(400).json({
            error: err
        })
    };
}

// ACTUALIZAR un usuario
async function actualizarUsuario(req, res) {

    // utilizamos nuestro validador, en este caso validamos el nombre y el email que recibimos a través de la URL (params)
    const { error, value } = schema.validate({ nombre: req.body.nombre, email: req.params.email });

    if (error) res.status(400).json({ validationError: error });
    try {
        let usuario = await Usuario.findOneAndUpdate({ email: req.params.email }, {
            $set: {
                nombre: req.body.nombre,
                password: req.body.password
            }
        }, { new: true });

        res.status(200).json({
            usuarioModificado: usuario.nombre,
            email: usuario.email
        })
    } catch (err) {
        res.status(400).json({
            error: err
        })
    };
}

// ELIMINAR definitivamente un usuario de nuestra base de datos
async function eliminarUsuario(req, res) {
    try {
        let usuario = await Usuario.findOneAndDelete({ email: req.params.email });

        res.status(200).json({
            usuarioEliminado: usuario.nombre,
            email: usuario.email
        })
    } catch (err) {
        res.status(400).json({
            error: err
        })
    };
}

// se realiza un BORRADO LÓGICO del usuario, pero permanece en nuestra base de ddatos "desactivado"
async function desactivarUsuario(req, res) {
    try {
        let usuario = await Usuario.findOneAndUpdate({ email: req.params.email }, {
            $set: {
                estado: false
            }
        }, { new: true });

        res.status(200).json({
            usuarioDesactivado: usuario.nombre
        })
    } catch (err) {
        res.status(400).json({
            error: err
        })
    };
}

// se realiza un ACTIVADO LÓGICO del usuario
async function activarUsuario(req, res) {
    try {
        let usuario = await Usuario.findOneAndUpdate({ email: req.params.email }, {
            $set: {
                estado: true
            }
        }, { new: true });

        res.status(200).json({
            usuarioActivado: usuario.nombre
        })
    } catch (err) {
        res.status(400).json({
            error: err
        })
    };
}


// exportamos los métodos creados para poder utilizarlos desde routes/usuarios_routes.js
module.exports = {
    todosUsuarios,
    todosUsuariosActivos,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    desactivarUsuario,
    activarUsuario
};