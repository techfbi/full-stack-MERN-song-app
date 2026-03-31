import { createContext, useReducer, useEffect } from "react";
import { setUpdateAccessTokenCallback } from "../src/components/Api";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      return { user: null };

    default:
      return state;
  }
};

const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
  });

  // Register interceptor callback to update user access token
  useEffect(() => {
    setUpdateAccessTokenCallback((newToken) => {
      // Update user object with new token
      if (state.user) {
        dispatch({
          type: "LOGIN",
          payload: { ...state.user, accessToken: newToken },
        });
      }
    });
  }, [state.user]); // track state.user so we update token in the correct user object

  useEffect(() => {
    // This is for RENDER DEPLOY sake to check if the backend is awake so that users wont get errors when they first visit the site

    const checkedUser = JSON.parse(localStorage.getItem("user"));

    const confirmationCheck = async () => {
      if (!checkedUser) return;

      dispatch({
        type: "LOGIN",
        payload: checkedUser,
      });
    };
    confirmationCheck();
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
