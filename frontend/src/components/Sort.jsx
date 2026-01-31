import { useState, useEffect } from "react";
import api from "./Api";
import { useContext } from "react";
import { SongContext } from "../../contexts/SongContext";

const Sort = () => {
  const [sortBy, setSortBy] = useState("");
  const [order, setOrder] = useState("desc");
  const { setSongs, setError } = useContext(SongContext);

  useEffect(() => {
    if (!sortBy || !order) return;

    const sortSongs = async () => {
      try {
        const response = await api.post("/api/songs/sort", { sortBy, order });
        const sortedSongs = response.data;
        setSongs(sortedSongs);
        setError(null);
      } catch (error) {
        setError("Error Sorting songs");
        console.error("Error fetching sorted songs:", error);
      }
    };
    sortSongs();
  }, [sortBy, order]);

  return (
    <div className="sort-bar">
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="" disabled>
          Sort By
        </option>
        <option value="createdAt">Sort by Date</option>
        <option value="rate">Sort by Rating</option>
      </select>

      <button onClick={() => setOrder(order === "asc" ? "desc" : "asc")}>
        {order === "asc" ? "⬆ Asc" : "⬇ Desc"}
      </button>
    </div>
  );
};

export default Sort;
