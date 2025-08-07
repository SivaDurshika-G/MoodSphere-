import React, { useState } from 'react';

export default function SaveButton({ onClick }) {
  const [isSaved, setIsSaved] = useState(false);

  const handleClick = () => {
    setIsSaved(true);
    onClick(); // Call the parent function
    setTimeout(() => {
      setIsSaved(false);
    }, 1000);
  };

  return (
    <button className="save-btn" onClick={handleClick}>
      {isSaved ? 'Saved ✨' : 'Save'}
    </button>
  );
}
