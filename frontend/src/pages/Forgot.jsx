import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../components/Api";
import CircularIndeterminate from "../components/CircularLoading";
import useAuthContext from "../../hooks/useAuthContext";
import usePassMailContext from "../../hooks/usePassmailContext";

const ForgotPass = () => {
  const [show, setShow] = useState(false);
  const [securityAns, setSecurityAns] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [shownext, setShownext] = useState(false);
  const { dispatch } = useAuthContext();
  const { dispatch: passMailDispatch, email: passMail } = usePassMailContext();
  const navigate = useNavigate();

  //-----------------------------------------------------------------------------------------------------------------------------------
  //This useEffect is to pre-fill the email field with the email used in forgot password flow (stored in PassMailContext) in case user navigates back to forgot page from login page
  useEffect(() => {
    if (passMail) {
      setEmail(passMail);
    }
  }, [passMail]);

  //----------------------------------------------------------------------------------------------------------------------------------
  // To check user mail and get secutity question
  const handleMailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      setEmail(email.toLowerCase()); // Convert to lowercase
      const response = await api.post("/api/users/forgot-mail-check", {
        email: email.toLowerCase(),
      });
      const question = response.data;
      setQuestion(question.securityQue);
      setShownext(true);
      setIsLoading(false);
    } catch (error) {
      setError(error.response?.data?.error);
      setIsLoading(false);
      setShownext(false);
    }
  };
  //----------------------------------------------------------------------------------------------------------------------------------

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (newPassword === confirmNewPassword) {
      passMailDispatch({
        type: "REMOVE",
      });
      localStorage.removeItem("user");
      try {
        setEmail(email.toLowerCase()); // Convert to lowercase
        const response = await api.post("/api/users/change-password", {
          email: email.toLowerCase(),
          newPassword,
          securityAns,
        });

        // Update the authentication context with the logged-in user data
        dispatch({
          type: "LOGOUT",
        });

        // Update the Passmail context with the email for potential use in the login page
        passMailDispatch({
          type: "PASS",
          payload: email.toLowerCase(),
        });

        // navigate to login page after password change
        navigate("/login");
        setEmail("");
        setSecurityAns("");
        setNewPassword("");
        setConfirmNewPassword("");
        setIsLoading(false);
        setError(null);
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
    <div className="forgot-page">
      <div className="forgot-left">
        <div className="forgot-card">
          <h2 className="forgot-heading">Reset Password</h2>
          <p className="small-heading">
            {!shownext
              ? "Enter email"
              : "Input your security answer to reset password"}
          </p>
          {error && <p className="login-error">{error}</p>}

          <form>
            <div style={{ display: !shownext ? "block" : "none" }}>
              <input
                id="email"
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                onClick={handleMailSubmit}
                disabled={isLoading}
                type="submit"
                className="submit"
              >
                {isLoading ? <CircularIndeterminate /> : ">>>"}
              </button>
            </div>

            <div style={{ display: shownext ? "block" : "none" }}>
              <label
                htmlFor="answer"
                className="sec-Question"
                style={{
                  display: "flex",
                  marginBottom: "10px",
                  fontWeight: "600",
                }}
              >
                {question}
              </label>
              <input
                id="answer"
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
                    display: "inline-flex", // inline-flex so it doesn’t force line break
                    gap: "0.5rem", // space between checkbox and text
                    cursor: "pointer", // makes it clickable
                    marginBottom: "25px",
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
              <input
                type="password"
                placeholder="Input new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="confirm new password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
              />

              <button
                onClick={handleFinalSubmit}
                disabled={isLoading}
                type="submit"
                className="submit"
              >
                {isLoading ? <CircularIndeterminate /> : "Change Password"}
              </button>
              <p
                style={{
                  color: "blue",
                  cursor: "pointer",
                  textDecoration: "underline",
                  marginTop: "20px",
                }}
                onClick={() => setShownext(false)}
              >
                ← Back
              </p>
            </div>
          </form>
        </div>
      </div>

      <div className="forgot-right">
        <div className="pattern">
          <img src="/assets/EarBluetooth.jpg" alt="headset picture" />
        </div>
      </div>
    </div>
  );
};

export default ForgotPass;
