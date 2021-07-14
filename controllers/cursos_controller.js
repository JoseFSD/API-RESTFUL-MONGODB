const Curso = require('../models/curso_model');
const Joi = require('@hapi/joi');

const schema = Joi.object({
    titulo: Joi.string()
        .min(3)
        .max(20)
        .required(),

    descripcion: Joi.string()
        .min(10)
        .max(150)
});

async function todosCursos(req, res) {
    try {
        const resultado = await Curso.find();

        res.status(200).json({
            listadoCursos: resultado
        })
    } catch (err) {
        res.status(400).json(err)
    };
}

async function todosCursosActivos(req, res) {
    try {
        const resultado = await Curso.find({ estado: true });

        res.status(200).json({
            listadoCursos: resultado
        })
    } catch (err) {
        res.status(400).json(err)
    };
}

async function crearCurso(req, res) {

    const { error, value } = schema.validate({ titulo: req.body.titulo, descripcion: req.body.descripcion });

    if (!error) {
        try {
            let curso = new Curso({
                titulo: req.body.titulo,
                descripcion: req.body.descripcion
            });

            const resultado = await curso.save();

            res.status(200).json({
                cursoCreado: resultado
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

async function actualizarCurso(req, res) {

    const { error, value } = schema.validate({ titulo: req.body.titulo, descripcion: req.params.descripcion });

    if (!error) {
        try {
            let curso = await Curso.findByIdAndUpdate(req.params.id, {
                $set: {
                    titulo: req.body.titulo,
                    descripcion: req.body.descripcion
                }
            }, { new: true });

            res.status(200).json({
                cursoModificado: curso
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

async function eliminarCurso(req, res) {
    try {
        let curso = await Curso.findByIdAndDelete(req.params.id);

        res.status(200).json({
            cursoEliminado: curso
        })
    } catch (err) {
        res.status(400).json({
            error: err
        })
    };
}

async function desactivarCurso(req, res) {
    try {
        let curso = await Curso.findByIdAndUpdate(req.params.id, {
            $set: {
                estado: false
            }
        }, { new: true });

        res.status(200).json({
            cursoDesactivado: curso
        })
    } catch (err) {
        res.status(400).json({
            error: err
        })
    };
}

async function activarCurso(req, res) {
    try {
        let curso = await Curso.findByIdAndUpdate(req.params.id, {
            $set: {
                estado: true
            }
        }, { new: true });

        res.status(200).json({
            cursoActivado: curso
        })
    } catch (err) {
        res.status(400).json({
            error: err
        })
    };
}


module.exports = {
    todosCursos,
    todosCursosActivos,
    crearCurso,
    actualizarCurso,
    eliminarCurso,
    desactivarCurso,
    activarCurso
};