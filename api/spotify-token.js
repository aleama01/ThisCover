// src/api/spotify-token.js

export default async function handler(req, res) {
  // Log the request method to check which method is being used
  console.log(`Request Method: ${req.method}`);

  // Accept only POST requests, and log an error otherwise
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed, please use POST.' });
  }

  // Retrieve environment variables securely
  const client_id = process.env.CLIENT_ID;
  const client_secret = process.env.CLIENT_SECRET;
  const refresh_token = process.env.REFRESH_TOKEN;

  // Check if the environment variables are available
  if (!client_id || !client_secret || !refresh_token) {
    console.error('Missing environment variables');
    return res.status(500).json({ error: 'Missing environment variables' });
  }

  try {
    // Fetch the Spotify access token
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refresh_token,
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
      },
    });

    // Check if the response is okay
    if (!response.ok) {
      console.error('Failed to fetch access token:', response.statusText);
      return res.status(response.status).json({ error: 'Failed to fetch access token' });
    }

    // Send the token back to the client
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching access token:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
