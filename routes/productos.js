// routes/productos.js
const express = require("express");
const router = express.Router(); // Creamos el enrutador
const productosController = require("../controllers/productosController"); // Importamos el controlador

// ✅ Muestra el formulario para crear un nuevo producto (GET)
router.get("/nuevo-producto", productosController.formNuevoProducto);

// ✅ Procesa el envío del formulario para crear el producto (POST)
router.post("/nuevo-producto", productosController.crearProducto);

// 📝 Mostrar formulario para editar producto existente (GET)
router.get("/editar-producto/:ref", productosController.formEditarProducto);

// 🔄 Procesar edición del producto (POST)
router.post("/editar-producto/:ref", productosController.actualizarProducto);

// ❌ Borrar producto (GET o POST; aquí usamos GET para simpleza)
router.get("/borrar-producto/:ref", productosController.borrarProducto);

module.exports = router;