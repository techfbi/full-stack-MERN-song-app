//to use these three import for date formatting, must have done npm install dayjs
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
//-----------------------------------------------------
import { useEffect, useState, useContext } from "react";
import { SongContext } from "../../contexts/SongContext";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import ModeIcon from "@mui/icons-material/Mode";
import EditSong from "./EditForm";

function EachSongs({ title, artist, rate, created, id }) {
  //-----------------------------------------------------------------
  //state to hold the time ago string
  const [timeAgo, setTimeAgo] = useState(dayjs(created).fromNow());
  const { deleteSong } = useContext(SongContext);
  const [hovered, setHovered] = useState(false);
  const [isLaptop, setIsLaptop] = useState(window.innerWidth > 768);
  const [showEdit, setShowEdit] = useState(false);

  //------------------------------------------------------------------
  // useEffect to update time ago every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeAgo(dayjs(created).fromNow());
    }, 60000); // update every minute

    return () => clearInterval(interval); // cleanup on unmount
  }, [created]);

  //----------------------------------------------------------------------
  // useEffect to update isMobile state on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsLaptop(window.innerWidth > 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  //-----------------------------------------------------------------------

  //function to handle edit icon click
  const handleEditIconClick = () => {
    setShowEdit((prev) => !prev);
  };

  //-----------------------------------------------------------------------

  // Function to confirm deletion
  const confirmDelete = (id) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete "${title}"?`
    );

    if (isConfirmed) {
      deleteSong(id); // call your delete function
    }
  };
  //------------------------------------------------------------------------

  return (
    <div className="eachsongs">
      <div className="cont-img">
        <img src="/assets/musical-note.png" alt="musical note" />
      </div>
      <div>
        {!showEdit && (
          <>
            <div className="title-del">
              <h2
                onMouseOver={isLaptop ? () => setHovered(true) : undefined}
                onMouseLeave={isLaptop ? () => setHovered(false) : undefined}
                onClick={
                  !isLaptop ? () => setHovered((prev) => !prev) : undefined
                }
              >
                {title}
                {hovered && (
                  <ModeIcon
                    className="edit-icon"
                    onClick={handleEditIconClick}
                  />
                )}
              </h2>
              <RemoveCircleOutlineIcon
                onClick={() => confirmDelete(id)}
                className="del-icon"
              />
            </div>
            <p>{artist}</p>
            <br />
          </>
        )}
        {showEdit && <EditSong id={id} setShowEdit={setShowEdit} />}

        <div className="rate-date">
          <span className="rate">⭐ {rate} / 10</span>
          <span className="date">{timeAgo}</span>
        </div>
      </div>
    </div>
  );
}

export default EachSongs;
