const config = require('config');
const jwt = require("jsonwebtoken");

const verify = (req, res, next) => {
    // si no tengo token
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json("El token no es válido");
    }

    // verificar token
    jwt.verify(token, config.get('configToken.SECRET'), (error, decoded) => {
        if (error) {
            console.log(error);
            return res.status(401).json({
                Error: error
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
};

module.exports = verify;