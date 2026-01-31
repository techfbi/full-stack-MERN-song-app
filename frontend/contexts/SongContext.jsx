import { createContext, useState, useEffect } from "react";
import api from "../src/components/Api";

export const SongContext = createContext();

const SongContextProvider = ({ children }) => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const getSongs = async () => {
      try {
        const response = await api.get("/api/songs");
        const data = response.data;
        setSongs(data);
        setLoading(false);
        setError(null);
      } catch (error) {
        setError("Error fetching songs");
        console.error("Error fetching songs:", error);
      }
    };

    getSongs();

    // const timer = setTimeout(() => {
    //   getSongs();
    // }, 2000); // 2 second delay for demonstration

    // return () => clearTimeout(timer); // Cleanup timeout on unmount
  }, []);

  const deleteSong = async (id) => {
    try {
      const response = await api.delete(`/api/songs/${id}`);
      setSongs((prevSongs) => prevSongs.filter((song) => song._id !== id));
      if (response.data.error) {
        setError(response.data.error);
      }
      setError(null);
      console.log("Song deleted successfully:");
    } catch (error) {
      setError("Problem deleting the song");
      console.error("Error deleting song:");
    }
  };

  const updateSong = async (id, title, artist) => {
    try {
      const response = await api.patch(`/api/songs/${id}`, {
        title,
        artist,
      });
      const data = response.data;
      setSongs((prevSongs) =>
        prevSongs.map((song) =>
          song._id === id ? { ...song, title, artist } : song
        )
      );
      setError(null);
      setSuccess(data.message);
      console.log("Song updated successfully:");
    } catch (error) {
      setError("Problem updating the song");
      setSuccess(null);
      console.error("Error updating song:");
    }
  };

  return (
    <SongContext.Provider
      value={{
        songs,
        setSongs,
        loading,
        deleteSong,
        error,
        setError,
        updateSong,
        success,
        setSuccess,
      }}
    >
      {children}
    </SongContext.Provider>
  );
};

export default SongContextProvider;
