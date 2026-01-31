import { useState, useContext, useEffect } from "react";
import api from "./Api";
import { SongContext } from "../../contexts/SongContext";
import Modal from "./Modal";

function AddSong({ isOpen, setOpen }) {
  const { setSongs } = useContext(SongContext);
  const [music, setMusic] = useState({
    title: "",
    artist: "",
    rate: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [adding, setAdding] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/songs", music);
      const data = response.data;

      setMusic({
        title: "",
        artist: "",
        rate: "",
      });
      setSongs((prevSongs) => [data, ...prevSongs]); // Update the song list with the new song
      setError(null);
      setSuccess(true);
      setAdding(false);
    } catch (error) {
      setError("Failed to add song. Please try again.");
      setSuccess(false);
      console.error("Error adding song:", error);
    }
  };

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(false);
        setError(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [success, error]);

  return (
    <>
      {success && <div className="success">Song added successfully!</div>}
      {error && <div className="error">{error}</div>}
      <div className="formside">
        <form className="addsong-form" onSubmit={handleSubmit}>
          <h2 className="form-title">Add New Song</h2>
          <label>Title:</label>
          <input
            type="text"
            value={music.title}
            onChange={(e) => setMusic({ ...music, title: e.target.value })}
            required
          />
          <label>Artist:</label>
          <input
            type="text"
            value={music.artist}
            onChange={(e) => setMusic({ ...music, artist: e.target.value })}
            required
          />
          <div className="rate-field">
            <label htmlFor="rate-select">Rate:</label>

            <select
              id="rate-select"
              value={music.rate}
              onChange={(e) =>
                setMusic({ ...music, rate: Number(e.target.value) })
              }
              required
            >
              <option value="" disabled>
                Select
              </option>
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>

            <span>/ 10</span>
          </div>

          <button type="submit">Add Song</button>
        </form>
      </div>
    </>
  );
}

export default AddSong;
