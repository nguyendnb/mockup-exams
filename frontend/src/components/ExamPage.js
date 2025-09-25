import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Clock, CheckCircle, ArrowLeft, ArrowRight, Flag } from 'lucide-react';

const ExamPage = () => {
  const [examData, setExamData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentQuestionData, setCurrentQuestionData] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [answers, setAnswers] = useState({});
  const [gradedAnswers, setGradedAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(120);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('ExamPage mounted, starting exam...');
    startExam();
  }, []);

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 60000); // Update every minute

      return () => clearInterval(timer);
    }
  }, [timeRemaining]);

  const startExam = async () => {
    try {
      console.log('Starting exam...');
      setLoading(true);
      setError(null);
      
      // First check if backend is healthy
      const backendUrl = 'http://localhost:5000';
      console.log('Checking backend health at:', backendUrl);
      const healthResponse = await axios.get(`${backendUrl}/api/health`);
      console.log('Backend health:', healthResponse.data);
      
      if (!healthResponse.data.questions_loaded) {
        throw new Error('Backend is not ready. Questions not loaded.');
      }
      
      const response = await axios.post(`${backendUrl}/api/exam/start`);
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to start exam');
      }
      
      setExamData(response.data);
      setTimeRemaining(response.data.time_limit);
      // Load the first question
      await loadQuestion(0);
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to start exam. Please try again.';
      setError(errorMessage);
      console.error('Error starting exam:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadQuestion = async (questionIndex) => {
    try {
      const backendUrl = 'http://localhost:5000';
      const response = await axios.get(`${backendUrl}/api/exam/question/${questionIndex}`);
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to load question');
      }
      
      const question = response.data.question;
      setCurrentQuestion(questionIndex);
      setCurrentQuestionData(question);
      const savedAnswer = answers[questionIndex] || '';
      setSelectedAnswer(savedAnswer);
      // For multiple answers, split the saved answer into an array
      setSelectedAnswers(savedAnswer ? savedAnswer.split('').sort() : []);
      console.log('Loaded question:', question);
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to load question. Please try again.';
      setError(errorMessage);
      console.error('Error loading question:', err);
    }
  };

  const handleAnswerSelect = (answer) => {
    // Don't allow changing answers after grading
    if (gradedAnswers[currentQuestion]) {
      return;
    }

    // Check if this is a multiple choice question by looking for patterns in the question text
    const questionText = currentQuestionData?.question?.toLowerCase() || '';
    const isMultipleChoice = questionText.includes('choose two') || 
                            questionText.includes('select two') ||
                            questionText.includes('choose all') || 
                            questionText.includes('select all') ||
                            questionText.includes('which two') ||
                            questionText.includes('which three') ||
                            questionText.includes('multiple') ||
                            (currentQuestionData?.choices?.length > 6);
    
    if (isMultipleChoice) {
      // Handle multiple answer selection
      setSelectedAnswers(prev => {
        const newAnswers = prev.includes(answer) 
          ? prev.filter(a => a !== answer)  // Remove if already selected
          : [...prev, answer].sort();       // Add and sort
        const answerString = newAnswers.join('');
        setSelectedAnswer(answerString);
        setAnswers(prevAnswers => ({
          ...prevAnswers,
          [currentQuestion]: answerString
        }));
        
        return newAnswers;
      });
    } else {
      // Handle single answer selection (original logic)
      setSelectedAnswer(answer);
      setSelectedAnswers([answer]);
      setAnswers(prev => ({
        ...prev,
        [currentQuestion]: answer
      }));
    }
  };

  const submitAnswer = async () => {
    try {
      const backendUrl = 'http://localhost:5000';
      const response = await axios.post(`${backendUrl}/api/exam/answer`, {
        question_id: currentQuestion,
        answer: selectedAnswer
      });
      
      if (response.data.success) {
        // Store the grading result
        setGradedAnswers(prev => ({
          ...prev,
          [currentQuestion]: {
            is_correct: response.data.is_correct,
            correct_answer: response.data.correct_answer,
            correct_choice_text: response.data.correct_choice_text,
            explanation: response.data.explanation,
            user_answer: response.data.user_answer
          }
        }));
      }
    } catch (err) {
      console.error('Error submitting answer:', err);
    }
  };

  const handleSubmit = async () => {
    if (!selectedAnswer) {
      alert('Please select an answer before submitting.');
      return;
    }
    
    await submitAnswer();
  };

  const handleNext = () => {
    if (currentQuestion < examData.total_questions - 1) {
      loadQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      loadQuestion(currentQuestion - 1);
    }
  };

  const handleQuestionSelect = (questionIndex) => {
    loadQuestion(questionIndex);
  };

  const handleSubmitExam = async () => {
    try {
      if (selectedAnswer) {
        await submitAnswer();
      }
      
      const backendUrl = 'http://localhost:5000';
      const response = await axios.post(`${backendUrl}/api/exam/submit`);
      navigate('/results', { state: { results: response.data } });
    } catch (err) {
      setError('Failed to submit exam. Please try again.');
      console.error('Error submitting exam:', err);
    }
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}:${mins.toString().padStart(2, '0')}`;
  };

  const getTimerClass = () => {
    if (timeRemaining <= 10) return 'timer danger';
    if (timeRemaining <= 30) return 'timer warning';
    return 'timer';
  };

  const answeredQuestions = Object.keys(answers).length;
  const gradedQuestions = Object.keys(gradedAnswers).length;
  const progressPercentage = examData ? (answeredQuestions / examData.total_questions) * 100 : 0;

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div>Loading exam...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">
          {error}
          <button className="btn" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!examData) {
    return (
      <div className="container">
        <div className="error">No exam data available</div>
      </div>
    );
  }

  const question = currentQuestionData;

  return (
    <div className="exam-container">
      {/* Header */}
      <div className="exam-header">
        <div>
          <h1 className="exam-title">GCP Cloud Architect Practice Exam</h1>
        </div>
        <div className="exam-stats">
          <div className="stat-item">
            <div className="stat-label">Progress</div>
            <div className="stat-value">{answeredQuestions}/{examData.total_questions}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Graded</div>
            <div className="stat-value">{gradedQuestions}/{examData.total_questions}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Time Remaining</div>
            <div className="stat-value">{formatTime(timeRemaining)}</div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      {/* Timer Warning */}
      <div className={getTimerClass()}>
        <Clock size={20} style={{ marginRight: '10px' }} />
        Time Remaining: {formatTime(timeRemaining)}
        {timeRemaining <= 10 && (
          <div style={{ marginTop: '5px', fontSize: '14px' }}>
            ⚠️ Time is running out! Submit your exam soon.
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="exam-main-content">
        {/* Question Section */}
        <div className="question-section">
          <div className="question-container">
            <div className="question-header">
              <div className="question-number">
                Question {currentQuestion + 1} of {examData.total_questions}
              </div>
              <div className="question-timer">
                {formatTime(timeRemaining)} remaining
              </div>
            </div>

            <div className="question-text">
              {question?.question}
            </div>

            <div className="choices-container">
              {question?.choices?.map((choice, index) => {
                const questionText = question?.question?.toLowerCase() || '';
                const isMultipleChoice = questionText.includes('choose two') || 
                                       questionText.includes('select two') ||
                                       questionText.includes('choose all') || 
                                       questionText.includes('select all') ||
                                       questionText.includes('which two') ||
                                       questionText.includes('which three') ||
                                       questionText.includes('multiple') ||
                                       (question?.choices?.length > 6);
                const isSelected = isMultipleChoice 
                  ? selectedAnswers.includes(choice.letter)
                  : selectedAnswer === choice.letter;
                
                // Get grading result for this question
                const grading = gradedAnswers[currentQuestion];
                const isGraded = grading !== undefined;
                
                // Handle multiple correct answers (e.g., "AD", "BC")
                let isCorrect = false;
                let isUserAnswer = false;
                
                if (grading) {
                  // Use the structured data from backend if available, otherwise fallback to parsing
                  const correctLetters = grading.correct_letters || 
                    (grading.correct_answer ? grading.correct_answer.split('').map(l => l.toUpperCase()) : []);
                  const userLetters = grading.user_letters || 
                    (grading.user_answer ? grading.user_answer.split('').map(l => l.toUpperCase()) : []);
                  
                  isCorrect = correctLetters.includes(choice.letter.toUpperCase());
                  isUserAnswer = userLetters.includes(choice.letter.toUpperCase());
                }
                
                let choiceClass = 'choice-item';
                if (isSelected) choiceClass += ' selected';
                if (isGraded) {
                  if (isCorrect) choiceClass += ' correct';
                  else if (isUserAnswer && !isCorrect) choiceClass += ' incorrect';
                }
                
                return (
                  <div
                    key={index}
                    className={choiceClass}
                    onClick={() => handleAnswerSelect(choice.letter)}
                    style={{
                      pointerEvents: isGraded ? 'none' : 'auto',
                      opacity: isGraded && !isCorrect && !isUserAnswer ? 0.6 : 1
                    }}
                  >
                    <div className="choice-letter">
                      {isGraded ? (
                        isCorrect ? '✓' : (isUserAnswer ? '✗' : (isMultipleChoice ? '☐' : choice.letter + '.'))
                      ) : (
                        isMultipleChoice ? (isSelected ? '☑' : '☐') : (choice.letter + '.')
                      )}
                    </div>
                    <div className="choice-text">{choice.text}</div>
                    {isGraded && isCorrect && (
                      <div className="correct-indicator">Correct Answer</div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Show explanation if question is graded */}
            {gradedAnswers[currentQuestion] && (
              <div className="explanation-container">
                <div className={`explanation ${gradedAnswers[currentQuestion].is_correct ? 'correct' : 'incorrect'}`}>
                  <h4>
                    {gradedAnswers[currentQuestion].is_correct ? '✅ Correct!' : '❌ Incorrect'}
                  </h4>
                  <p>{gradedAnswers[currentQuestion].explanation}</p>
                </div>
              </div>
            )}

            {/* Question Action Buttons */}
            <div className="question-actions">
              <button 
                className="btn btn-primary" 
                onClick={handleSubmit}
                disabled={!selectedAnswer || gradedAnswers[currentQuestion] !== undefined}
              >
                Submit Answer
              </button>
              
              <div className="nav-buttons">
                <button 
                  className="btn btn-secondary" 
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                >
                  <ArrowLeft size={16} style={{ marginRight: '5px' }} />
                  Previous
                </button>
                
                <button 
                  className="btn btn-primary" 
                  onClick={handleNext}
                  disabled={currentQuestion === examData.total_questions - 1}
                >
                  Next
                  <ArrowRight size={16} style={{ marginLeft: '5px' }} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Question Grid Section */}
        <div className="question-grid-section">
          <div className="question-grid-container">
            <h3>Questions</h3>
            <div className="question-grid">
              {Array.from({ length: examData.total_questions }, (_, index) => {
                const isGraded = gradedAnswers[index] !== undefined;
                const isCorrect = isGraded && gradedAnswers[index].is_correct;
                const isAnswered = answers[index];
                
                return (
                  <button
                    key={index}
                    className={`question-grid-btn ${
                      isAnswered ? 'answered' : ''
                    } ${index === currentQuestion ? 'current' : ''} ${
                      isGraded ? (isCorrect ? 'graded' : 'graded incorrect') : ''
                    }`}
                    onClick={() => handleQuestionSelect(index)}
                  >
                    {index + 1}
                    {isGraded && (
                      <span className="grade-indicator">
                        {isCorrect ? '✓' : '✗'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Submit Section */}
      <div className="submit-section">
        <div className="submit-warning">
          ⚠️ Make sure you have answered all questions before submitting. 
          You cannot return to the exam after submission.
        </div>
        <button 
          className="btn btn-success" 
          onClick={() => setShowSubmitModal(true)}
          style={{ fontSize: '18px', padding: '15px 30px' }}
        >
          <Flag size={20} style={{ marginRight: '10px' }} />
          Submit Exam
        </button>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '12px',
            maxWidth: '500px',
            width: '90%',
            textAlign: 'center'
          }}>
            <h2 style={{ marginBottom: '20px', color: '#333' }}>
              Submit Exam?
            </h2>
            <p style={{ marginBottom: '30px', color: '#666', lineHeight: '1.6' }}>
              You have answered {answeredQuestions} out of {examData.total_questions} questions.
              Are you sure you want to submit your exam? You cannot return to make changes.
            </p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button 
                className="btn btn-secondary"
                onClick={() => setShowSubmitModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-success"
                onClick={handleSubmitExam}
              >
                Yes, Submit Exam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamPage;
