// config/database.js
const mysql = require('mysql2/promise')
const dotenv = require("dotenv");

dotenv.config({ path: './.env' });

// Configuración de la conexión a MySQL
const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root2310",
    database: "InnovaDB",
    waitForConnections: true,
    connectionLimit: 10,
});

// Conectar a la base de datos
(async () => {
    try {
        const conn = await db.getConnection();
        console.log("MySQL Pool Connected!");
        conn.release(); // Liberar la conexión de vuelta al pool
    } catch (error) {
        console.error("MySQL Connection Failed:", error);
    }
})();
// Exportar la conexión para usarla en otros archivos
module.exports = db;
