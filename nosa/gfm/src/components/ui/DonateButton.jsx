import React from 'react';
import { Send } from 'lucide-react';

const DonateButton = ({ className, children }) => {
  const handleClick = (e) => {
    e.preventDefault();
    const confirmed = window.confirm("You are about to be redirected to Telegram to complete your donation. Do you want to proceed?");
    if (confirmed) {
      window.open("https://t.me/+18647899613", "_blank", "noopener,noreferrer");
    }
  };

  return (
    <button 
      onClick={handleClick}
      className={className}
    >
      {children || "Donate Now"}
    </button>
  );
};

export default DonateButton;
