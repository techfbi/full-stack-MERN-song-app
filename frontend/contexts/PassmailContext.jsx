import { createContext, useReducer } from "react";

export const PassmailContext = createContext();

export const PassmailReducer = (state, action) => {
  switch (action.type) {
    case "PASS":
      return { email: action.payload };
    case "REMOVE":
      return { email: null };

    default:
      return state;
  }
};

const PassmailContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(PassmailReducer, {
    email: null,
  });

  return (
    <PassmailContext.Provider value={{ ...state, dispatch }}>
      {children}
    </PassmailContext.Provider>
  );
};

export default PassmailContextProvider;
