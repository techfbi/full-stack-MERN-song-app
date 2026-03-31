import { createContext, useState, useEffect } from "react";
import api from "../src/components/Api";
import useAuthContext from "../hooks/useAuthContext";

export const SongContext = createContext();

const SongContextProvider = ({ children }) => {
  //-------------------------------------------------------------------------------
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { user } = useAuthContext();
  //-------------------------------------------------------------------------------

  // Fetch songs from the backend when the component mounts
  useEffect(() => {
    const getUserSongs = async () => {
      if (user) {
        try {
          const response = await api.get("/api/songs", {
            headers: {
              Authorization: `Bearer ${user.accessToken}`,
            },
          });
          const data = response.data;
          setSongs(data);
          setLoading(false);
          setError(null);
        } catch (error) {
          setError("Error fetching songs");
          console.error("Error fetching songs:", error);
        }
      }
    };

    getUserSongs(); // trigger song fetch on frontend load
  }, [user]); // Re-run when user changes (e.g., login/logout)
  //-------------------------------------------------------------------------------

  const deleteSong = async (id) => {
    if (user) {
      try {
        const response = await api.delete(`/api/songs/${id}`, {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        });
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
    }
  };

  const updateSong = async (id, title, artist) => {
    if (user) {
      try {
        const response = await api.patch(
          `/api/songs/${id}`,
          {
            title,
            artist,
          },
          {
            headers: {
              Authorization: `Bearer ${user.accessToken}`,
            },
          },
        );
        const data = response.data;
        setSongs((prevSongs) =>
          prevSongs.map((song) =>
            song._id === id ? { ...song, title, artist } : song,
          ),
        );
        setError(null);
        setSuccess(data.message);
        console.log("Song updated successfully:");
      } catch (error) {
        setError("Problem updating the song");
        setSuccess(null);
        console.error("Error updating song:");
      }
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
