
import mysql from 'mysql2';

const pool = mysql.createPool({
  host: 'localhost',
    user: 'root',
    password: '98215062Mlina',
    database: 'fursaDash',
}).promise()

export default async function getUsers() {
  const [rows] = await pool.query("SELECT * FROM users")
  return rows
}


const users = await getUsers();