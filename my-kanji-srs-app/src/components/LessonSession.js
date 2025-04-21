import React, { useState, useEffect } from 'react';
import '../App.css';

const LessonSession = ({ lessonCards, onComplete, onFinish }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  useEffect(() => {
    console.log('lessonCards:', lessonCards);
  }, [lessonCards]);

  if (!lessonCards || lessonCards.length === 0) {
    console.warn('No lesson cards available, ending session');
    onFinish();
    return <div>No lessons available 😓</div>;
  }

  if (currentCardIndex >= lessonCards.length) {
    console.warn('Lesson complete, ending session');
    onFinish();
    return <div>Lesson complete! 🎉</div>;
  }

  const currentCard = lessonCards[currentCardIndex];

  if (!currentCard) {
    console.error('Current card is undefined', { currentCardIndex, lessonCards });
    onFinish();
    return <div>Error: No card available 😓</div>;
  }

  const playAudio = (text) => {
    if (!text || text === 'N/A') return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    window.speechSynthesis.speak(utterance);
  };

  const handleNext = () => {
    onComplete(currentCard);
    if (currentCardIndex + 1 < lessonCards.length) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      onFinish();
    }
  };

  return (
    <div className="card">
      <h2>Lesson</h2>
      <div className="kanji-display">{currentCard.kanji}</div>
      <p><strong>Meaning:</strong> {currentCard.meaning}</p>
      <p>
        <strong>Onyomi:</strong> {currentCard.onyomi || 'N/A'}
        {currentCard.onyomi && (
          <button className="audio-button" onClick={() => playAudio(currentCard.onyomi)}>
            🔊
          </button>
        )}
      </p>
      <p>
        <strong>Kunyomi:</strong> {currentCard.kunyomi || 'N/A'}
        {currentCard.kunyomi && (
          <button className="audio-button" onClick={() => playAudio(currentCard.kunyomi)}>
            🔊
          </button>
        )}
      </p>
      <p><strong>Mnemonic:</strong> {currentCard.mnemonicStory}</p>
      <p className="count-left">{lessonCards.length - currentCardIndex} left</p>
      <div className="button-row">
        <button onClick={handleNext}>Next ➡️</button>
      </div>
    </div>
  );
};

export default LessonSession;