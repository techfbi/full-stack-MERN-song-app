import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../components/Api";
import useAuthContext from "../../hooks/useAuthContext";
import CircularIndeterminate from "../components/CircularLoading";
import usePassMailContext from "../../hooks/usePassmailContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();
  const { email: passMail, dispatch: passMailDispatch } = usePassMailContext();
  //------------------------------------------------------------------------------------------------------
  // This useEffect is to "wake" the backend when the frontend loads so that users won't encounter errors if they visit the site when the backend is asleep (e.g., on Render.com free tier)
  useEffect(() => {
    const wakeBackend = async (retries = 2) => {
      try {
        await api.get("/ping");
        console.log("Backend is awake!");
      } catch (err) {
        if (retries > 0) {
          console.log(
            `Backend is asleep, retrying in 2 seconds... (${retries} retries left)`,
          );
          setTimeout(() => wakeBackend(retries - 1), 2000);
        } else {
          console.log("Backend still asleep after all retries.");
        }
      }
    };

    wakeBackend(); // call it with default retries
  }, []);
  //------------------------------------------------------------------------------------------------------------

  // This useEffect is to pre-fill the email field with the email used in forgot password flow (stored in PassMailContext)
  useEffect(() => {
    if (passMail) {
      setEmail(passMail);
    }
  }, [passMail]);

  //----------------------------------------------------------------------------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    passMailDispatch({
      type: "PASS",
      payload: email.toLowerCase(),
    });

    try {
      setIsLoading(true);
      setEmail(email.toLowerCase()); // Convert to lowercase
      const response = await api.post("/api/users/login", {
        email: email.toLowerCase(),
        password,
      });
      const data = response.data;
      // Update the authentication context with the logged-in user data
      dispatch({
        type: "LOGIN",
        payload: data,
      });

      // save the user data to localStorage for persistence
      localStorage.setItem("user", JSON.stringify(data));
      setIsLoading(false);
      setError(null);
      passMailDispatch({
        type: "REMOVE",
      });
    } catch (error) {
      setError(
        error.response?.data?.error || "Login failed. Please try again.",
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-card">
          <h2 className="login-heading">Welcome back!</h2>
          <nav className="small-heading">
            Don't have an account yet? <Link to="/signup">Sign up now</Link>
          </nav>
          {error && <p className="login-error">{error}</p>}

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="password-box">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="eye"
                onClick={() => setShowPassword(!showPassword)}
              >
                👁
              </span>
            </div>

            <div className="options">
              <nav>
                <Link to="/forgot">Forgot password?</Link>
              </nav>
            </div>

            <button disabled={isLoading} type="submit" className="submit">
              {isLoading ? <CircularIndeterminate /> : "Log in"}
            </button>
          </form>
        </div>
      </div>

      <div className="login-right">
        <div className="pattern">
          <img src="/assets/EarBluetooth.jpg" alt="headset picture" />
        </div>
      </div>
    </div>
  );
};

export default Login;
