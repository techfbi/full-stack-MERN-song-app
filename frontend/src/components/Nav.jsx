//Im using NavLink instead of Link bcos it gives an active class to the link when its active
// and helps in styling the active link differently
import { NavLink } from "react-router-dom";

function Navbar() {
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
        <li>
          <NavLink to="/contact">Contact</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
