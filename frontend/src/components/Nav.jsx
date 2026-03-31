//Im using NavLink instead of Link bcos it gives an active class to the link when its active
// and helps in styling the active link differently
import { NavLink } from "react-router-dom";
import useAuthContext from "../../hooks/useAuthContext";
import BackgroundLetterAvatars from "./Avatar";
import { useState, useEffect } from "react";

function Navbar() {
  const { user } = useAuthContext();
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768);

  // Add event listener to handle window resize and update isTablet state
  useEffect(() => {
    const handleResize = () => {
      setIsTablet(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className="navbar">
      <h1>My Fav Songs</h1>
      <ul>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/about">About</NavLink>
        </li>

        {user && (
          <li>
            <NavLink to="/profile" className="user-link">
              <span>{isTablet && user.email}</span>
              <BackgroundLetterAvatars name={user.email} size={30} />
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
