import React from "react";

function Modal({ children, handleCloseModal }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={handleCloseModal}>
          &times;
        </span>
        {children}
      </div>
    </div>
  );
}

export default Modal;
