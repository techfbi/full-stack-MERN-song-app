import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./components/App.jsx";
import AuthContextProvider from "../contexts/AuthContext.jsx";
import PassmailContextProvider from "../contexts/PassmailContext.jsx";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <AuthContextProvider>
      <PassmailContextProvider>
        <BrowserRouter basename="/">
          <App />
        </BrowserRouter>
      </PassmailContextProvider>
    </AuthContextProvider>
  </StrictMode>,
);
