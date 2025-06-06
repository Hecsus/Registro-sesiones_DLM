// ----------------------------
// 🔌 IMPORTAR MÓDULOS
// ----------------------------
const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const db = require("./database/db");

// Cargar variables del archivo .env
dotenv.config({ path: "./env/.env" });

// Inicializar app
const app = express();

// ----------------------------
// ⚙️ CONFIGURACIONES
// ----------------------------

// Motor de plantillas EJS
app.set("view engine", "ejs");

// Archivos estáticos
app.use("/resources", express.static(__dirname + "/public"));

// Middleware para parseo de formularios
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Middleware de sesión
app.use(
  session({
    secret: "secreto_super_seguro",
    resave: false,
    saveUninitialized: false,
  })
);

// Middleware global → todas las vistas tendrán `login` disponible automáticamente
app.use((req, res, next) => {
  res.locals.login = req.session.loggedin || false;
  next();
});

// ----------------------------
// 🌐 RUTAS
// ----------------------------

// Página principal
app.get("/", (req, res) => {
  res.render("index", {
    name: req.session.name || "Visitante",
  });
});

// Página de registro (GET)
app.get("/registro", (req, res) => {
  res.render("register", { alert: false });
});

// Registro de usuario (POST)
app.post("/register", async (req, res) => {
  const { user, name, rol, pass } = req.body;
  const hash = await bcrypt.hash(pass, 8);

  db.query(
    "INSERT INTO usuarios SET ?",
    { usuario: user, nombre: name, rol, pass: hash },
    (err) => {
      if (err) return console.error("❌ Error al registrar:", err);

      res.render("register", {
        alert: true,
        alertTitle: "Registrado",
        alertMessage: "Usuario creado con éxito",
        alertIcon: "success",
        showConfirmButton: false,
        timer: 1500,
        ruta: "login",
      });
    }
  );
});

// Página de login (GET)
app.get("/login", (req, res) => {
  res.render("login", { alert: false });
});

// Login de usuario (POST)
app.post("/auth", async (req, res) => {
  const { user, pass } = req.body;

  if (!user || !pass) {
    return res.render("login", {
      alert: true,
      alertTitle: "Campos vacíos",
      alertMessage: "Introduce usuario y contraseña",
      alertIcon: "warning",
      showConfirmButton: true,
      timer: false,
      ruta: "login",
    });
  }

  db.query(
    "SELECT * FROM usuarios WHERE usuario = ?",
    [user],
    async (err, results) => {
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
        });
      }

      req.session.loggedin = true;
      req.session.name = results[0].nombre;
      req.session.rol = results[0].rol;

      res.render("login", {
        alert: true,
        alertTitle: "Bienvenido",
        alertMessage: "Inicio de sesión correcto",
        alertIcon: "success",
        showConfirmButton: false,
        timer: 1000,
        ruta: "admin",
      });
    }
  );
});

// Panel de administrador
app.get("/admin", (req, res) => {
  if (!req.session.loggedin) return res.redirect("/login");

  res.render("admin", {
    name: req.session.name,
    rol: req.session.rol,
  });
});

// Cierre de sesión
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

// ----------------------------
// 🚀 ARRANCAR SERVIDOR
// ----------------------------
app.listen(process.env.PORT || 3000, () => {
  console.log(`🌍 Servidor funcionando en http://localhost:${process.env.PORT}`);
});
