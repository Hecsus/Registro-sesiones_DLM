// controllers/productosController.js

const db = require("../database/db"); // 🔌 Conexión a la base de datos

// -----------------------------------------------------------
// ✅ 1. Mostrar formulario para agregar un nuevo producto
// -----------------------------------------------------------
exports.formNuevoProducto = (req, res) => {
  // Solo los administradores pueden acceder a este formulario
  if (req.session.rol !== "admin") {
    return res.redirect("/admin");
  }

  res.render("form-producto", {
    title: "Nuevo Producto",       // Título de la página
    producto: {},                  // Objeto vacío, ya que es creación
    accion: "/nuevo-producto",     // Ruta que usará el formulario (POST)
    metodo: "POST",                // Método del formulario
    botonTexto: "Crear producto",  // Texto del botón
    errorMsg: null,                // Mensaje de error (si lo hubiera)
  });
};

// -----------------------------------------------------------
// ✅ 2. Guardar nuevo producto en la base de datos (POST)
// -----------------------------------------------------------
exports.crearProducto = (req, res) => {
  const { ref, nombre, precio, stock } = req.body;

  // Validación simple (puedes mejorarla luego con express-validator)
  if (!ref || !nombre || !precio || !stock) {
    return res.render("form-producto", {
      title: "Nuevo Producto",
      producto: req.body,
      accion: "/nuevo-producto",
      metodo: "POST",
      botonTexto: "Crear producto",
      errorMsg: "Todos los campos son obligatorios",
    });
  }

  // Ejecutamos inserción SQL
  const query = "INSERT INTO productos (ref, nombre, precio, stock) VALUES (?, ?, ?, ?)";
  db.query(query, [ref, nombre, precio, stock], (err) => {
    if (err) {
      console.error("❌ Error al insertar:", err);
      return res.render("form-producto", {
        title: "Nuevo Producto",
        producto: req.body,
        accion: "/nuevo-producto",
        metodo: "POST",
        botonTexto: "Crear producto",
        errorMsg: "Error al guardar el producto",
      });
    }

    // Redirigimos al panel admin si todo salió bien
    res.redirect("/admin");
  });
};

// -----------------------------------------------------------
// 🔄 3. Mostrar formulario para editar producto existente
// -----------------------------------------------------------
exports.formEditarProducto = (req, res) => {
  const ref = req.params.ref;

  // Solo admin puede editar
  if (req.session.rol !== "admin") {
    return res.redirect("/admin");
  }

  // Buscar el producto por su ref
  db.query("SELECT * FROM productos WHERE ref = ?", [ref], (err, results) => {
    if (err || results.length === 0) {
      console.error("❌ Error al buscar producto para editar:", err);
      return res.redirect("/admin");
    }

    const producto = results[0];

    res.render("form-producto", {
      title: "Editar Producto",
      producto,
      accion: `/editar-producto/${ref}`, // Ruta que usará el form
      metodo: "POST",
      botonTexto: "Actualizar producto",
      errorMsg: null,
    });
  });
};

// -----------------------------------------------------------
// 🛠️ 4. Guardar cambios del producto editado
// -----------------------------------------------------------
exports.actualizarProducto = (req, res) => {
  const ref = req.params.ref;
  const { nombre, precio, stock } = req.body;

  if (!nombre || !precio || !stock) {
    return res.render("form-producto", {
      title: "Editar Producto",
      producto: { ref, nombre, precio, stock },
      accion: `/editar-producto/${ref}`,
      metodo: "POST",
      botonTexto: "Actualizar producto",
      errorMsg: "Todos los campos son obligatorios",
    });
  }

  // Ejecutamos UPDATE
  const query = "UPDATE productos SET nombre = ?, precio = ?, stock = ? WHERE ref = ?";
  db.query(query, [nombre, precio, stock, ref], (err) => {
    if (err) {
      console.error("❌ Error al actualizar producto:", err);
      return res.render("form-producto", {
        title: "Editar Producto",
        producto: { ref, nombre, precio, stock },
        accion: `/editar-producto/${ref}`,
        metodo: "POST",
        botonTexto: "Actualizar producto",
        errorMsg: "Error al actualizar el producto",
      });
    }

    res.redirect("/admin"); // Redirigimos al panel
  });
};

// -----------------------------------------------------------
// ❌ 5. Eliminar un producto
// -----------------------------------------------------------
exports.borrarProducto = (req, res) => {
  const ref = req.params.ref;

  if (req.session.rol !== "admin") {
    return res.redirect("/admin");
  }

  // Ejecutamos DELETE
  db.query("DELETE FROM productos WHERE ref = ?", [ref], (err) => {
    if (err) {
      console.error("❌ Error al borrar producto:", err);
      // Podrías mostrar error en admin si quieres
    }

    res.redirect("/admin"); // Siempre redirigimos
  });
};
