import Navbar from "./Nav";
import SongList from "../pages/Songlist";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import SongContextProvider from "../../contexts/SongContext";
import About from "../pages/About";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Profile from "../components/Profile";
import ForgotPass from "../pages/forgot";
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "./NotFound";
import useAuthContext from "../../hooks/useAuthContext";

function App() {
  // Define routes where the Navbar should be hidden
  const location = useLocation();
  const showNavbarRoutes = ["/", "/about", "/profile"];

  // Access the user from the authentication context to conditionally render login and signup
  const { user } = useAuthContext();

  return (
    <div>
      <SongContextProvider>
        {/* Conditionally render Navbar based on the current route */}
        {showNavbarRoutes.includes(location.pathname) && <Navbar />}

        <Routes>
          <Route path="*" element={<NotFound />} />

          <Route
            path="/"
            element={user ? <SongList /> : <Navigate to="/login" />}
          />
          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <About />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/" />}
          />
          <Route
            path="/signup"
            element={!user ? <Signup /> : <Navigate to="/" />}
          />
          <Route
            path="/forgot"
            element={!user ? <ForgotPass /> : <Navigate to="/" />}
          />
        </Routes>
      </SongContextProvider>
    </div>
  );
}

export default App;
