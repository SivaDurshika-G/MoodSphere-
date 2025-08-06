import React from 'react';

export default function SaveButton({ onClick }) {
  return (
    <button className="save-btn" onClick={onClick}>
      Save
    </button>
  );
}
