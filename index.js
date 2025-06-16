// ----------------------------
// 🔌 IMPORTAR MÓDULOS
// ----------------------------
const express = require("express"); // Framework web de Node.js
const session = require("express-session"); // Middleware para manejar sesiones
const bcrypt = require("bcryptjs"); // Para encriptar contraseñas
const dotenv = require("dotenv"); // Cargar variables del archivo .env
const db = require("./database/db"); // Archivo con la conexión a la base de datos
const path = require("path"); // Para manejar rutas absolutas

// Cargar variables del archivo .env
dotenv.config({ path: "./env/.env" }); // Cargamos variables del archivo .env

// Inicializar app
const app = express(); // Creamos la app con Express

// ----------------------------
// ⚙️ CONFIGURACIONES
// ----------------------------

// Configuración de EJS como motor de plantillas
app.set("view engine", "ejs");

// Configuración para archivos estáticos (CSS, imágenes, etc.)
app.use("/resources", express.static(__dirname + "/public"));

// Middleware para recibir datos de formularios
app.use(express.urlencoded({ extended: false })); // Para procesar formularios
app.use(express.json()); // Para aceptar datos JSON (ej. APIs)

// Middleware de sesión
app.use(
  session({
    secret: "secreto_super_seguro", // Clave para firmar la sesión
    resave: false, // No guarda la sesión si no hay cambios
    saveUninitialized: false, // Evita crear sesión vacía
  })
);

// Middleware global → todas las vistas tendrán `login` disponible automáticamente
app.use((req, res, next) => {
  res.locals.login = req.session.loggedin || false; // `login` disponible en todas las vistas
  next(); // Continuamos con el siguiente middleware o ruta
});

// Middleware para definir un título por defecto si no se pasa desde la vista
app.use((req, res, next) => {
  res.locals.title = "Mi sitio"; // Título por defecto
  next();
});

// ----------------------------
// 🌐 RUTAS PRINCIPALES
// ----------------------------

// Página de inicio
app.get("/", (req, res) => {
  res.render("index", {
    name: req.session.name || "Visitante",
    title: "Inicio" // ← 🆕 Título para <head>
  });
});

// Rutas de autenticación y administración
app.use("/", require("./routes/auth"));



// ----------------------------
// 🚀 ARRANCAR SERVIDOR
// ----------------------------
app.listen(process.env.PORT || 3000, () => {
  console.log(`🌍 Servidor funcionando en http://localhost:${process.env.PORT}`);
});
