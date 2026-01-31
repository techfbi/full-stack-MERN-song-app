import { useContext, useState } from "react";
import { SongContext } from "../../contexts/SongContext";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const EditSong = ({ id, setShowEdit }) => {
  const { songs, updateSong } = useContext(SongContext);
  // Find the exact song with the given id to edit
  const exactSong = songs.find((song) => song._id === id) || {};
  // State to hold the edited song details
  const [songEdit, setSongEdit] = useState({
    title: exactSong.title || "",
    artist: exactSong.artist || "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateSong(id, songEdit.title, songEdit.artist);
    setShowEdit(false);
  };

  return (
    <>
      {exactSong && (
        <form className="editform" onSubmit={handleSubmit}>
          <input
            className="edit-title"
            type="text"
            value={songEdit.title}
            onChange={(e) =>
              setSongEdit({ ...songEdit, title: e.target.value })
            }
            autoFocus
          />
          <div className="art-check-cont">
            <input
              className="edit-artist"
              type="text"
              value={songEdit.artist}
              onChange={(e) =>
                setSongEdit({ ...songEdit, artist: e.target.value })
              }
            />
            <button>
              <CheckCircleOutlineIcon className="save-btn" />
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default EditSong;
