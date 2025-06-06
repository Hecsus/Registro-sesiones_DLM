// Cargamos variables de entorno desde .env
require("dotenv").config({ path: "env/.env" });

// Importamos mysql2 para conectarnos a MySQL
const mysql = require("mysql2");

// Creamos la conexión usando los datos del .env
const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// Validamos conexión
conn.connect((err) => {
  if (err) {
    console.error("❌ Error al conectar con la base de datos:", err);
    return;
  }
  console.log("✅ Conectado correctamente a la base de datos.");
});

module.exports = conn;