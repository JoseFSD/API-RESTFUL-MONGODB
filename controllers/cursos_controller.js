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
        const resultado = await Curso
            .find({ estado: true })
            .populate('autor', 'nombre -_id');
        /* 
            con populate le estamos diciendo que muestre a través de la id de referencia del campo autor, todo el documento 
            con los datos de ese autor. ".populate('autor');"
            
            Si añadimos mas parámetros después del autor, populate 
            entiende que solo querrás que se visualicen esos parámetros adicionales, en este caso, le estamos diciendo que haga 
            un populate a autor, y que solo visualice el campo nombre del autor. ".populate('autor', 'nombre');" 

            Si además, queremos excluir algún campo dentro del parámetro autor, ".populate('autor', 'nombre -_id');", aquí le 
            estamos diciendo a mongo que nos excluya el campo _id.

            Finalmente, lo que la constante resultado nos devolvería sería la consulta de todos los cursos con el estado en true, 
            y a su vez visualizaríamos todos sus campos, y además, dentro del campo autor, visualizaríamos solo el nombre del autor.
            Con populate embebemos todos los datos de ese usuario, pero en este caso le hemos indicado que solo queremos visualizar el
            campo nombre y por defecto nos pone el nombre y el _id, pero le hemos pedido a la consulta que no nos muestre tampoco el 
            "_id" poniendole el símbolo menos por delante, tal que así "-_id"
        */

        res.status(200).json({
            listadoCursos: resultado
        })
    } catch (err) {
        res.status(400).json(err)
    };
}

async function crearCurso(req, res) {

    const { error, value } = schema.validate({ titulo: req.body.titulo, descripcion: req.body.descripcion });

    if (error) res.status(400).json({ validationError: error });
    try {
        let curso = new Curso({
            titulo: req.body.titulo,
            autor: req.usuario._id,
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
}

async function actualizarCurso(req, res) {

    const { error, value } = schema.validate({ titulo: req.body.titulo, descripcion: req.params.descripcion });

    if (error) res.status(400).json({ validationError: error });
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