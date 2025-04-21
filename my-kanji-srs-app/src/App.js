import React, { useState } from 'react';
import LessonSession from './components/LessonSession';
import ReviewSession from './components/ReviewSession';
import Dashboard from './components/Dashboard';
import kanjiData from './data/kanjiData';
import './App.css';

const DAILY_NEW_LIMIT = 5;

function App() {
  const [lessonCards, setLessonCards] = useState(kanjiData.slice(0, DAILY_NEW_LIMIT));
  const [reviewCards, setReviewCards] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [reviewQuestions, setReviewQuestions] = useState([]);

  const generateQuestions = (cards) => {
    const questions = [];
    cards.forEach(card => {
      const readings = [card.onyomi, card.kunyomi].filter(r => r && r !== 'N/A');
      if (readings.length > 0) {
        questions.push({
          prompt: card.kanji,
          answers: readings,
          type: 'reading',
        });
      }
      questions.push({
        prompt: card.kanji,
        answers: [card.meaning],
        type: 'meaning',
      });
    });
    return questions;
  };

  const handleLessonComplete = (card) => {
    setReviewCards(prev => [...prev, { ...card, nextDue: Date.now() + 24 * 60 * 60 * 1000 }]);
    setLessonCards(prev => {
      const newCards = prev.filter(c => c.kanji !== card.kanji);
      if (newCards.length === 0) {
        setActiveSession('review');
      }
      return newCards;
    });
  };

  const handleReviewResult = (question, correct) => {
    const card = reviewCards.find(c => c.kanji === question.prompt);
    if (!card) return;
    let updatedCards;
    if (!correct) {
      updatedCards = [...reviewCards.filter(c => c.kanji !== card.kanji), { ...card, nextDue: Date.now() }];
    } else {
      const interval = card.nextDue ? (card.nextDue - Date.now()) * 2 : 3 * 24 * 60 * 60 * 1000;
      updatedCards = [...reviewCards.filter(c => c.kanji !== card.kanji), { ...card, nextDue: Date.now() + interval }];
    }
    setReviewCards(updatedCards);
    setReviewQuestions(prev => prev.slice(1));
  };

  const startReview = () => {
    if (reviewCards.length === 0) return;
    const questions = generateQuestions(reviewCards);
    setReviewQuestions(questions);
    setActiveSession('review');
  };

  const startLesson = () => {
    if (lessonCards.length === 0) {
      console.warn('No lesson cards available');
      setActiveSession(null);
      return;
    }
    setActiveSession('lesson');
  };

  const canDoLesson = lessonCards.length > 0;
  const canDoReview = reviewCards.length > 0;

  return (
    <div className="App">
      <header>
        <h1>Kanji Learning ✨</h1>
      </header>
      <main className="main-layout">
        <Dashboard reviewCards={reviewCards} />
        <div className="content-area">
          <section className="session-selector">
            <button disabled={!canDoLesson} onClick={startLesson}>
              Lesson ({lessonCards.length}) 📚
            </button>
            <button disabled={!canDoReview} onClick={startReview}>
              Review ({reviewQuestions.length || reviewCards.length * 2}) 🧠
            </button>
          </section>
          {activeSession === 'lesson' && (
            <LessonSession
              lessonCards={lessonCards}
              onComplete={handleLessonComplete}
              onFinish={() => setActiveSession('review')}
            />
          )}
          {activeSession === 'review' && (
            <ReviewSession
              questions={reviewQuestions}
              onReviewResult={handleReviewResult}
              onFinish={() => {
                setReviewQuestions([]);
                setActiveSession(null);
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;