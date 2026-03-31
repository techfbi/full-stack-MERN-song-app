import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../components/Api";
import useAuthContext from "../../hooks/useAuthContext";
import CircularIndeterminate from "../components/CircularLoading";
import { motion, AnimatePresence } from "framer-motion"; //Thia is for animation

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [securityQue, setSecurityQue] = useState("");
  const [securityAns, setSecurityAns] = useState("");
  const [show, setShow] = useState(false);
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password === confirmPass) {
      try {
        setIsLoading(true);
        setEmail(email.toLowerCase()); // Convert to lowercase
        const response = await api.post("/api/users/signup", {
          email: email.toLowerCase(),
          password,
          securityQue,
          securityAns,
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
        localStorage.removeItem("tempEmail");
      } catch (error) {
        setError(error.response?.data?.error);
        setIsLoading(false);
      }
    } else {
      setError("Passwords do not match");
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-left">
        <AnimatePresence>
          <motion.div
            layout // Enables layout animation
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <div className="signup-card">
              <h2 className="signup-heading">Create an Account!</h2>
              <nav className="small-heading">
                Already have an account? <Link to="/login">Login</Link>
              </nav>
              {error && <p className="signup-error">{error}</p>}

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
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    required
                  />

                  <div className="sec-question">
                    <label htmlFor="security" className="label">
                      Security Question:
                    </label>
                    <select
                      id="security"
                      className="security-que"
                      value={securityQue}
                      onChange={(e) => setSecurityQue(e.target.value)}
                      required
                    >
                      <option value="" disabled>
                        {" "}
                        Select{" "}
                      </option>
                      <option>What was the name of your first pet?</option>
                      <option>
                        What was the name of your childhood best friend?
                      </option>
                      <option>What is the first school you attended?</option>
                    </select>
                  </div>

                  <input
                    type={show ? "text" : "password"}
                    placeholder="Input answer"
                    value={securityAns}
                    onChange={(e) => setSecurityAns(e.target.value)}
                    required
                  />

                  <div
                    className="ans-checkbox"
                    style={{
                      whiteSpace: "nowrap",
                      textAlign: "left",
                    }}
                  >
                    <label
                      htmlFor="checkbox"
                      style={{
                        display: "inline-flex", // <-- use inline-flex so it doesn’t force line break
                        gap: "0.5rem", // space between checkbox and text
                        cursor: "pointer", // makes it clickable
                      }}
                    >
                      <input
                        id="checkbox"
                        style={{
                          cursor: "pointer",
                          transform: "scale(1.4)",
                          marginRight: "6px",
                        }}
                        type="checkbox"
                        checked={show}
                        onChange={(e) => setShow(e.target.checked)}
                      />
                      Show Answer
                    </label>
                  </div>
                </div>

                <button disabled={isLoading} type="submit" className="submit">
                  {isLoading ? <CircularIndeterminate /> : "Sign Up"}
                </button>
              </form>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="signup-right">
        <div className="pattern">
          <img src="/assets/EarBluetooth.jpg" alt="headset picture" />
        </div>
      </div>
    </div>
  );
};

export default Signup;
