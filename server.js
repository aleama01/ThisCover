const express = require('express');
const app = express();
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

app.use(cors());

dotenv.config();

cloudinary.config({
  cloud_name: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.REACT_APP_CLOUDINARY_API_KEY,
  api_secret: process.env.REACT_APP_CLOUDINARY_API_SECRET,
});

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



// Configure Multer to use Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'user_images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'heic'],
  },
});

const upload = multer({ storage });


// Register Route
app.post('/api/register', upload.single('profileImage'), async (req, res) => {
  const { username, password } = req.body;
  let imageUrl = process.env.REACT_APP_CLOUDINARY_DEFAULT_URL;

  // Check if an image was uploaded
  if (req.file) {
    imageUrl = req.file.path; // Cloudinary automatically provides the image URL
  }

  try {
    // Check if user exists
    const userCheck = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user with the image URL
    const newUser = await pool.query(
      'INSERT INTO users (username, password, image_url) VALUES ($1, $2, $3) RETURNING *',
      [username, hashedPassword, imageUrl]
    );

    res.status(201).json({ message: 'User registered successfully', user: newUser.rows[0] });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login Route
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Check if user exists
    const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const id = user.rows[0].id;

    // Check password
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    // Create JWT token
    const token = jwt.sign({ id: user.rows[0].id }, process.env.REACT_APP_JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Logged in successfully', token, id });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Insert a rating element into the database
app.post('/api/ratings', async (req, res) => {
  const { userId, albumId, songId, rating, comment } = req.body;
  console.log(userId, albumId, songId, rating)
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
  const { user_id, date, friend_id, album_id } = req.body;
  console.log(user_id, date, friend_id, album_id)
  try {
    const insertQuery = `
      INSERT INTO Schedule (user_id, deadline, friend_id, album_id, is_active)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const result = await pool.query(insertQuery, [user_id, date, friend_id, album_id, true]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Error inserting schedule' });
  }
});

// Get all common schedule elements for a couple of users
app.get('/api/schedules/:userId/:friendId', async (req, res) => {
  const { userId, friendId } = req.params;
  try {
    const result = await pool.query('SELECT * FROM Schedule WHERE (user_id = $1 AND friend_id = $2) OR (friend_id = $1 AND user_id = $2)', [userId, friendId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching schedules:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all schedule elements for a user
app.get('/api/schedules/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(`SELECT *,
    CASE 
      WHEN user_id = $1 THEN friend_id
      WHEN friend_id = $1 THEN user_id
      END AS selected_id
      FROM Schedule 
      WHERE (user_id = $1 OR friend_id = $1) 
      AND is_active = $2`,
      [userId, true]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching schedules:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update the is_active status of a schedule
app.put('/api/schedules/:userId/:deadline', async (req, res) => {
  const { userId, deadline } = req.params; // Assuming weekId uniquely identifies the schedule with the userId
  const { isActive } = req.body; // Get the new isActive status from the request body

  try {
    // Update the is_active status of the schedule entry
    const result = await pool.query(
      'UPDATE Schedule SET is_active = $1 WHERE user_id = $2 AND deadline = $3 RETURNING *',
      [isActive, userId, deadline]
    );

    // Check if the update affected any rows
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    res.status(200).json({ message: 'Schedule updated successfully', schedule: result.rows[0] });
  } catch (error) {
    console.error('Error updating schedule:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get username and image from id
app.get('/api/users/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query('SELECT username,image_url FROM Users WHERE id = $1', [userId]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching schedules:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
}
)

// Get all rating elements for an album and a user
app.get('/api/ratings/:userId/:albumId', async (req, res) => {
  const { userId, albumId } = req.params;
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
  console.log(userId, friendId)
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
    let users_ids = new Array;
    let result_tmp = new Array;

    // Get all friends ids
    const result = await pool.query('SELECT * FROM Friends WHERE user_id = $1 OR friend_id = $1', [userId]);
    result.rows.map((row) => {
      if (userId == row.user_id) {
        users_ids.push(row.friend_id);
      } else if (userId == row.friend_id) {
        users_ids.push(row.user_id)
      }
    })

    //Get all friends data
    for (let id of users_ids) {
      try {
        const result = await pool.query('SELECT username,id,image_url FROM Users WHERE id = $1', [id]);
        result_tmp.push(result.rows[0])
      } catch (error) {
        console.error('Error fetching schedules:', error.message);
        res.status(500).json({ error: 'Server error' });
      }
    }
    res.json(result_tmp);
  } catch (error) {
    console.error('Error fetching friends:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all users
app.get('/api/allusers/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    // Get all friends ids
    const result = await pool.query('SELECT username,image_url,id FROM Users WHERE id != $1', [userId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching friends:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start Server
const port = process.env.REACT_APP_PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
