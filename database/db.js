// database/db.js

// --------------------------------------
// 🔌 CARGAR VARIABLES DE ENTORNO
// --------------------------------------
require("dotenv").config({ path: __dirname + "/../env/.env" }); // Cargamos variables del archivo .env

// --------------------------------------
// 💾 CONEXIÓN MYSQL
// --------------------------------------
const mysql = require("mysql2"); // Cliente MySQL para Node.js

// Creamos conexión usando los datos del .env
const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT, // Extra opcional pero recomendado
});

// Verificamos que la conexión es exitosa
conn.connect((err) => {
  if (err) {
    console.error("❌ Error al conectar con la base de datos:", err);
    return;
  }
  console.log("✅ Conectado correctamente a la base de datos.");
});

// Exportamos la conexión para poder usarla en otros archivos
module.exports = conn; // Exportamos la conexión para usarla en otros archivos