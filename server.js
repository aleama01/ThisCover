const express = require('express');
const app = express();
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cors = require('cors');

app.use(cors());

dotenv.config();

// PostgreSQL pool setup
const pool = new Pool({
  user: process.env.REACT_APP_DB_USER,
  host: process.env.REACT_APP_DB_HOST,
  database: process.env.REACT_APP_DB_DATABASE,
  password: process.env.REACT_APP_DB_PASSWORD,
  port: process.env.REACT_APP_DB_PORT,
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Register Route
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Check if user exists
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    //const hashedPassword = password;

    // Insert new user
    const newUser = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, hashedPassword]
    );

    res.status(201).json({ message: 'User registered successfully', user: newUser.rows[0] });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login Route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if user exists
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    // Create JWT token
    const token = jwt.sign({ id: user.rows[0].id }, process.env.REACT_APP_JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Logged in successfully', token });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Insert a rating element into the database
app.post('/api/rating', async (req, res) => {
  const { userId, albumId, songId, rating, comment } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO Rating (user_id, album_id, song_id, rating, comment)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, album_id, song_id) DO UPDATE 
       SET rating = EXCLUDED.rating, comment = EXCLUDED.comment
       RETURNING *;`,
      [userId, albumId, songId, rating, comment]
    );
    res.status(201).json({ message: 'Rating inserted successfully', rating: result.rows[0] });
  } catch (error) {
    console.error('Error inserting rating:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Insert a schedule element into the database
app.post('/api/schedule', async (req, res) => {
  const { userId, weekNumber, friendId, albumId } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO Schedule (user_id, week_number, friend_id, album_id)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, week_number) DO UPDATE 
       SET friend_id = EXCLUDED.friend_id, album_id = EXCLUDED.album_id
       RETURNING *;`,
      [userId, weekNumber, friendId, albumId]
    );
    res.status(201).json({ message: 'Schedule inserted successfully', schedule: result.rows[0] });
  } catch (error) {
    console.error('Error inserting schedule:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all schedule elements for a user
app.get('/api/schedules/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query('SELECT * FROM Schedule WHERE user_id = $1', [userId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching schedules:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all rating elements for an album and a user
app.get('/api/ratings', async (req, res) => {
  const { userId, albumId } = req.query;
  try {
    const result = await pool.query('SELECT * FROM Rating WHERE user_id = $1 AND album_id = $2', [userId, albumId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching ratings:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Insert a friend element into the database
app.post('/api/friends', async (req, res) => {
  const { userId, friendId } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO Friends (user_id, friend_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, friend_id) DO NOTHING
       RETURNING *;`,
      [userId, friendId]
    );
    res.status(201).json({ message: 'Friend inserted successfully', friend: result.rows[0] });
  } catch (error) {
    console.error('Error inserting friend:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all friend elements for a user
app.get('/api/friends/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query('SELECT * FROM Friends WHERE user_id = $1', [userId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching friends:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start Server
const port = process.env.REACT_APP_PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
