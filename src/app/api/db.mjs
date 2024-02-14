/*import mysql from 'mysql2/promise';

export default async function handler(
  req,
  res
) {

  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '98215062Mlina',
    database: 'fursaDash',
  });
  
  try {
    const [rows] = await connection.execute('SELECT * FROM users');
    await connection.end();
    res.status(200).json({rows});
    console.log({rows});
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}*/

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

const users = await getUsers()