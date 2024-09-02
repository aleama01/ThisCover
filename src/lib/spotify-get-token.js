require('dotenv').config({ debug: true })

var client_id = process.env.REACT_APP_CLIENT_ID;
var client_secret = process.env.REACT_APP_CLIENT_SECRET;
var refresh_token = process.env.REACT_APP_REFRESH_TOKEN;

async function getAccessToken() {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    body: new URLSearchParams({
      'grant_type': 'refresh_token',
      refresh_token: refresh_token
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')),
    },
  });

  let res = await response.json();
  return res
}

export const getAlbum = async () => {
  const { access_token } = await getAccessToken();

  return fetch(`https://api.spotify.com/v1/albums/4aawyAB9vmqN3uQ7FjRGTy`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
}

export const getMyAlbum = async () => {
  const response = await getAlbum();
  const item = await response.json()
  console.log(item)
  return item.name
}

export const search = async (secondEncodedName) => {
  const { access_token } = await getAccessToken();
  const res = fetch(`https://api.spotify.com/v1/search?q=${secondEncodedName}&type=album&limt=10&market=IT`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })
  return res;
}

export const getSearchResults = async (name) => {
  const firstEncodedName = encodeURIComponent(name);
  const secondEncodedName = encodeURIComponent(firstEncodedName);

  const response = await search(secondEncodedName);
  const item = await response.json()
  return item
} 
