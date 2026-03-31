import { useEffect, useState } from "react";
import useAuthContext from "../../hooks/useAuthContext";
import useLogout from "../../hooks/useLogout";
import BackgroundLetterAvatars from "./Avatar";

const Profile = () => {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const [greeting, setGreeting] = useState("Hi");

  useEffect(() => {
    const timeGreet = () => {
      const hour = new Date().getHours();
      if (hour < 12) {
        setGreeting("Good Morning");
      } else if (hour < 18) {
        setGreeting("Good Afternoon");
      } else {
        setGreeting("Good Evening");
      }
    };
    timeGreet();
  }, []);

  const handleClick = () => {
    logout();
  };
  return (
    <div className="profile-container">
      <div className="avatar-container" style={{ marginBottom: "30px" }}>
        <BackgroundLetterAvatars name={""} size={100} />
      </div>
      <h1>
        {greeting} 👋,{" "}
        <span className="username">
          <strong>{user.email}</strong>
        </span>
      </h1>

      <nav>
        <button className="logout-btn" onClick={handleClick}>
          Logout
        </button>
      </nav>
    </div>
  );
};

export default Profile;
