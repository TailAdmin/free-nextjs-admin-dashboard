/*import mysql from 'mysql2/promise';

export default async function handler(
  req,
  res
) {

  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '98215062Mlina',
    database: 'fursaDash',
  });
  
  try {
    
    const [rows] = await connection.execute('SELECT * FROM users');
    await connection.end();

    res.status(200).json(rows);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}*/
import cors from 'cors';
import express from 'express';
import getUsers from './db.mjs'

const app = express();

app.use(cors());

app.get('/users', async (req, res) => {
    const users = await getUsers();
    res.json(users);
});


// Start the server
app.listen(8000, () => {
  console.log('Server is running on http://localhost:8000');
});