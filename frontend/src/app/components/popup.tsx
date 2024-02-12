import React, { useState, useEffect } from 'react';

interface PopupProps {
  message: string;
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 6000); // Adjust the duration (in milliseconds) as needed

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="popup">
      <p>{message}</p>
    </div>
  );
};

export default Popup;
