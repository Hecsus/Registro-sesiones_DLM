// -------------------------------------
// 🔌 IMPORTAR MÓDULOS NECESARIOS
// -------------------------------------
const express = require("express");
const router = express.Router(); // Usamos Router de Express
const bcrypt = require("bcryptjs"); // Para encriptar contraseñas
const db = require("../database/db"); // Conexión a la base de datos
const { validationResult } = require("express-validator"); // Para manejar errores de validación

// Importamos nuestras validaciones personalizadas
const { validateRegister, validateLogin } = require("../middlewares/validator");

// -------------------------------------
// 📝 RUTA: REGISTRO (GET)
// -------------------------------------
router.get("/registro", (req, res) => {
  res.render("register", {
    alert: false,
    oldData: {},
    errors: [],
    title: "Registro"
  });
});

// -------------------------------------
// 📝 RUTA: REGISTRO (POST)
// -------------------------------------
router.post("/register", validateRegister, async (req, res) => {
  const { user, name, rol, pass } = req.body;

  // Capturamos errores de validación (si los hay)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("register", {
      alert: false,
      errors: errors.array(),
      oldData: { user, name, rol },
      title: "Registro"
    });
  }

  // Verificamos si el usuario ya existe en la base de datos
  db.query("SELECT * FROM usuarios WHERE usuario = ?", [user], async (err, results) => {
    if (err) {
      console.error("❌ Error al verificar existencia del usuario:", err);
      return res.send("Error del servidor");
    }

    // Si el usuario ya existe, mostrar error en el formulario
    if (results.length > 0) {
      return res.render("register", {
        alert: false,
        errors: [{ param: "user", msg: "El usuario ya existe" }],
        oldData: { user, name, rol },
        title: "Registro"
      });
    }

    // Si el usuario no existe, ciframos la contraseña
    const hash = await bcrypt.hash(pass, 8);

    // Insertamos nuevo usuario en la base de datos
    db.query(
      "INSERT INTO usuarios SET ?",
      { usuario: user, nombre: name, rol, pass: hash },
      (err) => {
        if (err) {
          console.error("❌ Error al registrar:", err);
          return res.send("Error al guardar usuario");
        }

        // Mostramos alerta de éxito al registrarse
        res.render("register", {
          alert: true,
          alertTitle: "Registro exitoso",
          alertMessage: "El usuario ha sido creado correctamente",
          alertIcon: "success",
          showConfirmButton: false,
          timer: 1500,
          ruta: "login",
          errors: [],
          oldData: {},
          title: "Registro"
        });
      }
    );
  });
});

// -------------------------------------
// 🔐 RUTA: LOGIN (GET)
// -------------------------------------
router.get("/login", (req, res) => {
  res.render("login", {
    alert: false,
    errors: [],
    oldData: {},
    title: "Iniciar sesión"
  });
});

// -------------------------------------
// 🔐 RUTA: LOGIN (POST)
// -------------------------------------
router.post("/auth", validateLogin, async (req, res) => {
  const { user, pass } = req.body;
  const errors = validationResult(req);

  // Si hay errores de validación, volvemos a mostrar el login con errores
  if (!errors.isEmpty()) {
    return res.render("login", {
      alert: false,
      errors: errors.array(),
      oldData: { user },
      title: "Iniciar sesión"
    });
  }

  // Comprobamos si el usuario existe en la base de datos
  db.query("SELECT * FROM usuarios WHERE usuario = ?", [user], async (err, results) => {
    if (err) {
      console.error("❌ Error en la base de datos al hacer login:", err);
      return res.send("Error del servidor");
    }

    // Verificamos si el usuario existe y la contraseña es correcta
    if (
      results.length === 0 ||
      !(await bcrypt.compare(pass, results[0].pass))
    ) {
      return res.render("login", {
        alert: true,
        alertTitle: "Error",
        alertMessage: "Credenciales incorrectas",
        alertIcon: "error",
        showConfirmButton: true,
        timer: false,
        ruta: "login",
        oldData: { user },
        errors: [],
        title: "Iniciar sesión"
      });
    }

    // ✅ Usuario válido: guardamos datos en la sesión
    req.session.loggedin = true;
    req.session.name = results[0].nombre;
    req.session.rol = results[0].rol;

    // Mostramos bienvenida
    res.render("login", {
      alert: true,
      alertTitle: "Bienvenido",
      alertMessage: "Inicio de sesión correcto",
      alertIcon: "success",
      showConfirmButton: false,
      timer: 1000,
      ruta: "admin",
      errors: [],
      oldData: {},
      title: "Iniciar sesión"
    });
  });
});

// -------------------------------------
// ⚙️ RUTA: PANEL ADMINISTRADOR (Solo si está logueado)
// -------------------------------------
router.get("/admin", (req, res) => {
  if (!req.session.loggedin) return res.redirect("/login");

  // Consultamos todos los productos
  db.query("SELECT * FROM productos", (err, results) => {
    if (err) {
      console.error("❌ Error al obtener productos:", err);
      return res.render("admin", {
        name: req.session.name,
        rol: req.session.rol,
        productos: [],
        errorMsg: "No se pudieron cargar los productos",
        title: "Panel de administración"
      });
    }

    // Mostramos la vista admin con los productos
    res.render("admin", {
      name: req.session.name,
      rol: req.session.rol,
      productos: results,
      errorMsg: null,
      title: "Panel de administración"
    });
  });
});

// -------------------------------------
// 🚪 RUTA: CERRAR SESIÓN
// -------------------------------------
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

// -------------------------------------
// 🧩 Importar rutas de productos y montarlas aquí directamente
// -------------------------------------
const productosRoutes = require("./productos"); // cargamos las rutas
router.use(productosRoutes); // montamos sus rutas dentro de este router

// Exportamos el router para usarlo en `index.js`
module.exports = router;

