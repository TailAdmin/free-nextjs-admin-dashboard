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