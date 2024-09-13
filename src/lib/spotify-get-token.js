async function getAccessToken() {
  try {
    // Make a POST request to the Vercel function
    const response = await fetch('/api/spotify-token', {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch access token');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching access token:', error);
    throw error;
  }
}

export const getAlbum = async (albumId) => {
  const { access_token } = await getAccessToken();

  return fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
}

export const getSongs = async (albumId) => {
  const { access_token } = await getAccessToken();
  return fetch(`https://api.spotify.com/v1/albums/${albumId}/tracks?limit=50`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
}

export const getAlbumSongs = async (albumId) => {
  let songs = new Array;
  const response = await getSongs(albumId);
  const item = await response.json()

  for (let el of item.items) {
    let res = {
      name: el.name,
      id: el.id,
      link: el.uri,
      track_number: el.track_number,
    }
    songs.push(res)
  }

  return songs
}

export const getAlbums = async (ids) => {
  let albums = new Array;
  for (let id of ids) {
    console.log(id)
    const response = await getAlbum(id);
    const item = await response.json()
    const album = {
      id: item.id,
      title: item.name,
      release_date: item.release_date,
      artists: item.artists.map((_artist) => ({
        name: _artist.name
      })
      ),
      image: item.images[0].url,
      tags: item.genres,
    }
    albums.push(album)
  }
  return albums
}

export const getOneAlbum = async (id) => {
  const response = await getAlbum(id);
  const item = await response.json()
  const album = {
    id: item.id,
    title: item.name,
    release_date: item.release_date,
    artists: item.artists.map((_artist) => ({
      name: _artist.name
    })
    ),
    url: item.external_urls.spotify,
    image: item.images[0].url,
    tags: item.genres,
  }
  return album
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

  const albumsResult = new Array;
  const response = await search(secondEncodedName);
  const item = await response.json()
  for (let el of item.albums.items) {
    const album = {
      id: el.id,
      title: el.name,
      artists: el.artists.map((_artist) => ({
        name: _artist.name
      })
      ),
      image: el.images[0].url,
    }
    albumsResult.push(album)
  }

  return albumsResult
} 
