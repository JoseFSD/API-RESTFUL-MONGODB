const express = require('express');
const router = express.Router();
const userController = require('../controllers/usuarios_controller');

// Nuestro path --> http://localhost:3000/api/usuarios
router.get("/", userController.todosUsuarios);
router.post("/", userController.crearUsuario);
router.put("/:email", userController.actualizarUsuario);
router.delete("/:email", userController.eliminarUsuario);

// http://localhost:3000/api/usuarios/activos
router.get("/activos", userController.todosUsuariosActivos);

// http://localhost:3000/api/usuarios/desactivar/:email
router.put("/desactivar/:email", userController.desactivarUsuario);

// http://localhost:3000/api/usuarios/activar/:email
router.put("/activar/:email", userController.activarUsuario);

module.exports = router;