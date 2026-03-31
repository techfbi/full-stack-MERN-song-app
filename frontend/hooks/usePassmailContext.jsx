import { useContext } from "react";
import { PassmailContext } from "../contexts/PassmailContext";

const usePassmailContext = () => {
  const context = useContext(PassmailContext);

  if (!context) {
    throw new Error(
      "usePassmailContext must be used within an PassmailContextProvider",
    );
  }
  return context;
};

export default usePassmailContext;
