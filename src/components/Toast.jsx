import React, { useEffect } from 'react';

const Toast = ({ show, message, type = 'info', onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  }[type];

  return (
    <div className={`fixed top-5 right-5 z-50 px-4 py-2 text-white rounded shadow-lg ${bgColor}`}>
      {message}
    </div>
  );
};

export default Toast;