import mysql from 'mysql2/promise'

export const pool = mysql.createPool({
  host: 'localhost',       // o tu IP si es un servidor externo
  user: 'root',            // tu usuario de MySQL
  password: '', // tu contraseña
  database: 'proyectofinal', // tu base de datos
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})
