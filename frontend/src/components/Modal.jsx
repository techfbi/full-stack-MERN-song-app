// A modal is a popup window that appears on top of a webpage and forces the user to interact with it before continuing.

import { useEffect } from "react";

const Modal = ({ isOpen, onClose, children }) => {
  //-----------------------------------------------------------------------
  // Close on ESC key but i dont need it in this project
  //   useEffect(() => {
  //     const handleEsc = (e) => {
  //       if (e.key === "Escape") onClose();
  //     };

  //     document.addEventListener("keydown", handleEsc);

  //     return () => document.removeEventListener("keydown", handleEsc);
  //   }, [onClose]);
  //-----------------------------------------------------------------------

  // Lock scroll when modal open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto"; // Disable scroll when modal is open

    return () => (document.body.style.overflow = "auto"); // Cleanup to Re-enable scroll
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="overlay" onClick={onClose}>
      {/*This div below wraps the form which is passed as a child, and The stopPropagation() method prevents the click event from bubbling because if we click the form the browser might think we click the background too*/}
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {children} {/* Render the form or content passed as children */}
      </div>
    </div>
  );
};

export default Modal;
