const express = require('express');
const router = express.Router();
const verify = require('../middlewares/verify');
const cursoController = require('../controllers/cursos_controller');

// http://localhost:3000/api/cursos
router.get("/", verify, cursoController.todosCursos);
router.post("/", verify, cursoController.crearCurso);
router.put("/:id", verify, cursoController.actualizarCurso);
router.delete("/:id", verify, cursoController.eliminarCurso);

// http://localhost:3000/api/cursos/activos
router.get("/activos", verify, cursoController.todosCursosActivos);

// http://localhost:3000/api/cursos/desactivar/:id
router.put("/desactivar/:id", verify, cursoController.desactivarCurso);

// http://localhost:3000/api/cursos/activar/:id
router.put("/activar/:id", verify, cursoController.activarCurso);

module.exports = router;