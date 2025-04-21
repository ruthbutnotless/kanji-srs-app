import React, { useState } from 'react';
import { toHiragana } from 'wanakana';
import '../App.css';

const ReviewSession = ({ questions, onReviewResult, onFinish }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [left, setLeft] = useState(questions.length);

  const checkAnswer = (value, correctAnswers, type) => {
    if (type === 'reading') {
      const inputHiragana = toHiragana(value);
      return correctAnswers.some(answer => answer && inputHiragana === answer);
    }
    return correctAnswers.some(ans => ans.split(' / ').some(a => a.toLowerCase() === value.toLowerCase()));
  };

  const playAudio = (text) => {
    if (!text || text === 'N/A') return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    window.speechSynthesis.speak(utterance);
  };

  const handleInputChange = (e) => {
    let value = e.target.value;
    if (questions[currentQuestion].type === 'reading') {
      value = toHiragana(value);
    }
    setInput(value);
    setFeedback(''); // Clear feedback during typing
  };

  const handleCheckAnswer = () => {
    const correctAnswers = questions[currentQuestion].answers;
    const isCorrect = checkAnswer(input, correctAnswers, questions[currentQuestion].type);
    setFeedback(isCorrect ? '✅ Correct!' : '❌ Incorrect');
    if (isCorrect) {
      onReviewResult(questions[currentQuestion], true);
    } else {
      onReviewResult(questions[currentQuestion], false);
    }
  };

  const handleNextQuestion = () => {
    setLeft(prev => prev - 1);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setInput('');
      setFeedback('');
    } else {
      setLeft(0);
      onFinish();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && input) {
      handleCheckAnswer();
    }
  };

  if (!questions || questions.length === 0) {
    return <div>No review questions available 😓</div>;
  }

  const currentQuestionData = questions[currentQuestion];

  return (
    <div className="card">
      <h2>Review Session</h2>
      <p><strong>Question:</strong> {currentQuestionData.type === 'reading' ? 'Kanji Reading' : 'Kanji Meaning'}</p>
      <div className="kanji-display">{currentQuestionData.prompt}</div>
      {feedback.includes('✅') && (
        <div>
          <p><strong>Answer:</strong> {currentQuestionData.answers.join(' or ')}</p>
          {currentQuestionData.type === 'reading' && (
            <button className="audio-button" onClick={() => playAudio(currentQuestionData.answers[0])}>
              🔊
            </button>
          )}
        </div>
      )}
      <input
        value={input}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        className={
          feedback.includes('✅')
            ? 'correct-input'
            : feedback.includes('❌')
            ? 'incorrect-input'
            : 'answer-input'
        }
        placeholder={currentQuestionData.type === 'reading' ? 'Enter reading (e.g., kou)' : 'Enter meaning'}
      />
      <p className="count-left">{left} left</p>
      <div className="button-row">
        <button onClick={handleCheckAnswer}>Check ✅</button>
        {feedback.includes('✅') && <button onClick={handleNextQuestion}>Next ➡️</button>}
      </div>
      {feedback && (
        <p className={feedback.includes('✅') ? 'correct' : 'incorrect'}>{feedback}</p>
      )}
    </div>
  );
};

export default ReviewSession;