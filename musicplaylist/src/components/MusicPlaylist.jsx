import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MusicPlayList.css";

const MusicPlaylist = () => {
  const [songs, setSongs] = useState([]);
  const [song, setSong] = useState({ id: "", title: "", artist: "", genre: "", link: "" });
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState("");
  const [idToFetch, setIdToFetch] = useState("");
  const [fetchedSong, setFetchedSong] = useState(null);

  const baseUrl = `${import.meta.env.VITE_API_URL}/songs`; // API URL in .env

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const res = await axios.get(baseUrl);
      setSongs(res.data);
    } catch {
      setMessage("Failed to fetch songs.");
    }
  };

  const handleChange = (e) => {
    setSong({ ...song, [e.target.name]: e.target.value });
  };

  const saveSong = async () => {
    if (!song.title || !song.artist) {
      setMessage("Title and Artist are required.");
      return;
    }
    try {
      if (editMode) {
        await axios.put(`${baseUrl}/${song.id}`, song);
        setMessage("Song updated successfully.");
      } else {
        await axios.post(baseUrl, song);
        setMessage("Song added successfully.");
      }
      fetchSongs();
      resetForm();
    } catch {
      setMessage("Error saving song.");
    }
  };

  const deleteSong = async (id) => {
    try {
      await axios.delete(`${baseUrl}/${id}`);
      setMessage("Song deleted successfully.");
      fetchSongs();
    } catch {
      setMessage("Error deleting song.");
    }
  };

  const editSong = (s) => {
    setSong(s);
    setEditMode(true);
    setMessage(`Editing song: ${s.title}`);
  };

  const resetForm = () => {
    setSong({ id: "", title: "", artist: "", genre: "", link: "" });
    setEditMode(false);
  };

  const fetchSongById = async () => {
    if (!idToFetch) return;
    try {
      const res = await axios.get(`${baseUrl}/${idToFetch}`);
      setFetchedSong(res.data);
      setMessage("");
    } catch {
      setFetchedSong(null);
      setMessage("Song not found.");
    }
  };

  return (
    <div className="playlist-container">
      <h1>🎵 Music Playlist</h1>

      {message && <div className="message">{message}</div>}

      {/* Add / Edit Form */}
      <div className="form-card">
        <h2>{editMode ? "Edit Song" : "Add New Song"}</h2>
        <div className="form-grid">
          <input type="text" name="title" placeholder="Song Title" value={song.title} onChange={handleChange} />
          <input type="text" name="artist" placeholder="Artist" value={song.artist} onChange={handleChange} />
          <input type="text" name="genre" placeholder="Genre" value={song.genre} onChange={handleChange} />
          <input type="text" name="link" placeholder="YouTube/Spotify Link" value={song.link} onChange={handleChange} />
        </div>
        <div className="form-buttons">
          <button className="btn-primary" onClick={saveSong}>
            {editMode ? "Update Song" : "Add Song"}
          </button>
          {editMode && <button className="btn-secondary" onClick={resetForm}>Cancel</button>}
        </div>
      </div>

      {/* Fetch by ID */}
      <div className="fetch-card">
        <h2>Fetch Song By ID</h2>
        <div className="fetch-grid">
          <input
            type="number"
            placeholder="Enter Song ID"
            value={idToFetch}
            onChange={(e) => setIdToFetch(e.target.value)}
          />
          <button className="btn-primary" onClick={fetchSongById}>Fetch</button>
        </div>
        {fetchedSong && (
          <div className="fetched-song">
            <p><b>ID:</b> {fetchedSong.id}</p>
            <p><b>Title:</b> {fetchedSong.title}</p>
            <p><b>Artist:</b> {fetchedSong.artist}</p>
            <p><b>Genre:</b> {fetchedSong.genre}</p>
            <p><b>Link:</b> {fetchedSong.link}</p>
          </div>
        )}
      </div>

      {/* Song List Table */}
      <div className="playlist-card">
        <h2>My Playlist</h2>
        {songs.length === 0 ? (
          <p>No songs available.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Artist</th>
                  <th>Genre</th>
                  <th>Link</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {songs.map((s) => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>{s.title}</td>
                    <td>{s.artist}</td>
                    <td>{s.genre}</td>
                    <td>{s.link && <a href={s.link} target="_blank" rel="noreferrer">Listen</a>}</td>
                    <td className="action-buttons">
                      <button className="btn-edit" onClick={() => editSong(s)}>Edit</button>
                      <button className="btn-delete" onClick={() => deleteSong(s.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicPlaylist;