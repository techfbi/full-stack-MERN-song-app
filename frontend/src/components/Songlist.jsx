import AddSong from "./AddSong";
import EachSongs from "./EachSongs";
import { useEffect, useContext, useState } from "react";
import { SongContext } from "../../contexts/SongContext";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Sort from "./Sort";
import { motion, AnimatePresence } from "framer-motion"; //Thia is for animation
import Modal from "./Modal";

//-------------------------------------------------------------------------------

function SongList() {
  const { songs, loading, error, success, setSuccess, setError } =
    useContext(SongContext);
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  //-------------------------------------------------------------------------------

  // Clear success and error messages after 5 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(false);
        setError(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [success, error]);

  //-------------------------------------------------------------------------------

  // useEffect to update isMobile state on window resize
  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);
  //-------------------------------------------------------------------------------

  return (
    <div className="songlist">
      {success && <div className="success">{success}</div>}
      {error && <div className="error">{error}</div>}
      <div className="listside">
        {!loading && songs.length > 0 && (
          <>
            <small>
              You currently have <strong> {songs.length} </strong> song
              {songs.length > 1 && "s"} in the list.
            </small>
            <Sort />
          </>
        )}

        {/* Skeleton loader while fetching songs */}
        {loading && (
          <Box className="skeleton-loader">
            {[...Array(5)].map((_, i) => (
              <Skeleton width="100%" height={100} key={i + 1} />
            ))}
          </Box>
        )}

        {/* Show message if no songs are available */}
        {!loading && songs.length === 0 && (
          <p className="empty-state">No songs available</p>
        )}

        {/* Display the list of songs with animation */}
        <AnimatePresence>
          {songs.map((song) => (
            <motion.div
              key={song._id}
              layout // Enables layout animation
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <EachSongs
                title={song.title}
                artist={song.artist}
                rate={song.rate}
                created={song.createdAt}
                id={song._id}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* conditional rendering of the FAB button and the form depending on screensize and song length */}
      {isMobile ? (
        !loading && (
          <>
            {songs.length <= 3 ? (
              <AddSong />
            ) : (
              <>
                <button className="fab-btn" onClick={() => setOpen(true)}>
                  +
                </button>

                <Modal isOpen={open} onClose={() => setOpen(false)}>
                  <AddSong />
                </Modal>
              </>
            )}
          </>
        )
      ) : (
        <AddSong />
      )}
    </div>
  );
}

export default SongList;
