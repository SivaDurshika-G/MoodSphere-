import React from 'react';

export default function NoteSection({ note, onChange }) {
  return (
    <div className="note-section">
      <textarea
        id="note"
        value={note}
        onChange={e => onChange(e.target.value)}
        placeholder="Write a note..."
      />
    </div>
  );
}
