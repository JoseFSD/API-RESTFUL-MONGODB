const express = require('express');
const router = express.Router();
const verify = require('../middlewares/verify');
const userController = require('../controllers/usuarios_controller');

// Nuestro path --> http://localhost:3000/api/usuarios
router.get("/", verify, userController.todosUsuarios);
router.post("/", userController.crearUsuario); // no podemos proteger esta ruta ya que es la que va a crear al usuario por primera vez
router.put("/:email", verify, userController.actualizarUsuario);
router.delete("/:email", verify, userController.eliminarUsuario);

// http://localhost:3000/api/usuarios/activos
router.get("/activos", verify, userController.todosUsuariosActivos);

// http://localhost:3000/api/usuarios/desactivar/:email
router.put("/desactivar/:email", verify, userController.desactivarUsuario);

// http://localhost:3000/api/usuarios/activar/:email
router.put("/activar/:email", verify, userController.activarUsuario);

module.exports = router;