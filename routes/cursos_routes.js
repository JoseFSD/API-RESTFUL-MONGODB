const express = require('express');
const router = express.Router();
const cursoController = require('../controllers/cursos_controller');

// http://localhost:3000/api/cursos
router.get("/", cursoController.todosCursos);
router.post("/", cursoController.crearCurso);
router.put("/:id", cursoController.actualizarCurso);
router.delete("/:id", cursoController.eliminarCurso);

// http://localhost:3000/api/cursos/activos
router.get("/activos", cursoController.todosCursosActivos);

// http://localhost:3000/api/cursos/desactivar/:id
router.put("/desactivar/:id", cursoController.desactivarCurso);

// http://localhost:3000/api/cursos/activar/:id
router.put("/activar/:id", cursoController.activarCurso);

module.exports = router;