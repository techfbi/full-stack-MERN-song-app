import useAuthContext from "../hooks/useAuthContext";
import { SongContext } from "../contexts/SongContext";
import { useContext } from "react";

const useLogout = () => {
  const { dispatch } = useAuthContext();
  const { setSongs } = useContext(SongContext);
  const logout = () => {
    // remove user from storage
    localStorage.removeItem("user");
    localStorage.removeItem("tempEmail");

    // dispatch logout action
    dispatch({ type: "LOGOUT" });
    setSongs([]); // Clear songs from context on logout
  };

  return { logout };
};

export default useLogout;
