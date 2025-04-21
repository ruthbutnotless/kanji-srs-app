import React from 'react';

function Flashcard({ card, children }) {
  return (
    <div className="card">
      <h2>{card.kanji}</h2>
      {children}
    </div>
  );
}

export default Flashcard;
