const config = require('config');
const Usuario = require('../models/usuario_model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// para mostrar otra forma de crear este método, en lugar de utilizar async await, utilizaremos promesas
function login(req, res) {
    Usuario.findOne({ email: req.body.email })
        .then(datos => {
            if (datos) {
                const passwordValido = bcrypt.compareSync(req.body.password, datos.password)
                if (!passwordValido) return res.status(400).json({ mensaje: 'Usuario o contraseña incorrecta' });

                // generamos el token a través de su método sign y guardamos el id, nombre y email del usuario encriptados, y utilizaremos nuestro secreto (palabra guardada solo en el servidor) para encriptar
                const token = jwt.sign({
                    usuario: { _id: datos._id, nombre: datos.nombre, email: datos.email }
                }, config.get('configToken.SECRET'), { expiresIn: config.get('configToken.EXPIRATION') }); // pàra que el token expire en 24 horas

                // devolvemos los datos no sensibles, id, nombre, email y el token
                res.status(200).json({
                    usuario: {
                        _id: datos._id,
                        nombre: datos.nombre,
                        email: datos.email
                    },
                    token: token
                });
            } else {
                res.status(400).json({ mensaje: 'Usuario o contraseña incorrecta' }); // siempre es preferible que este mensaje sea así, para no dar pistas a los posibles hackers de cuál de los dos campos es el que está mal
            }
        })
        .catch(err => {
            res.status(400).json({ error: 'error en el servicio ' + err });
        });
}

module.exports = { login };