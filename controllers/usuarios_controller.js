// instanciamos nuestro modelo Usuario
const Usuario = require('../models/usuario_model');
// instanciamos nuestro paquete de validadores
const Joi = require('@hapi/joi');

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
        const resultado = await Usuario.find();

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
        const resultado = await Usuario.find({ estado: true });

        res.status(200).json({
            listadoUsuarios: resultado
        })
    } catch (err) {
        res.status(400).json(err)
    };
}

// CREAR un nuevo usuario
async function crearUsuario(req, res) {

    // SEGUNDO, utilizamos nuestro validador, para el nombre y el email
    const { error, value } = schema.validate({ nombre: req.body.nombre, email: req.body.email });

    // TERCERO, si no hay error, continua ejecutando
    if (!error) {
        try {
            let usuario = new Usuario({
                email: req.body.email,
                nombre: req.body.nombre,
                password: req.body.password
            });

            const resultado = await usuario.save();

            res.status(200).json({
                usuarioCreado: resultado
            })
        } catch (err) {
            res.status(400).json({
                error: err
            })
        };
        // CUARTO, si hay error, muéstramelo en formato json
    } else {
        res.status(400).json({ validationError: error });
    }

}

// ACTUALIZAR un usuario
async function actualizarUsuario(req, res) {

    // utilizamos nuestro validador, en este caso validamos el nombre y el email que recibimos a través de la URL (params)
    const { error, value } = schema.validate({ nombre: req.body.nombre, email: req.params.email });

    if (!error) {
        try {
            let usuario = await Usuario.findOneAndUpdate({ email: req.params.email }, {
                $set: {
                    nombre: req.body.nombre,
                    password: req.body.password
                }
            }, { new: true });

            res.status(200).json({
                usuarioModificado: usuario
            })
        } catch (err) {
            res.status(400).json({
                error: err
            })
        };
    } else {
        res.status(400).json({ validationError: error });
    }
}

// ELIMINAR definitivamente un usuario de nuestra base de datos
async function eliminarUsuario(req, res) {
    try {
        let usuario = await Usuario.findOneAndDelete({ email: req.params.email });

        res.status(200).json({
            usuarioEliminado: usuario
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
            usuarioDesactivado: usuario
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
            usuarioActivado: usuario
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