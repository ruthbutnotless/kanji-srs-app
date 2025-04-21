import React from 'react';
import './JapaneseKeyboard.css';

function JapaneseKeyboard({ onKeyClick }) {
  // A simple set of Hiragana keys for demonstration
  const keys = [
    'あ','い','う','え','お',
    'か','き','く','け','こ',
    'さ','し','す','せ','そ',
    'た','ち','つ','て','と',
    'な','に','ぬ','ね','の'
  ];

  return (
    <div className="japanese-keyboard">
      {keys.map(key => (
        <button key={key} onClick={() => onKeyClick(key)}>
          {key}
        </button>
      ))}
    </div>
  );
}

export default JapaneseKeyboard;
