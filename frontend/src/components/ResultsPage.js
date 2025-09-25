import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Award, CheckCircle, XCircle, Clock, RotateCcw, Home } from 'lucide-react';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (location.state?.results) {
      setResults(location.state.results);
    } else {
      // If no results in state, redirect to home
      navigate('/');
    }
  }, [location.state, navigate]);

  const handleRetakeExam = () => {
    navigate('/exam');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  if (!results) {
    return (
      <div className="container">
        <div className="loading">Loading results...</div>
      </div>
    );
  }

  const { score, total_questions, percentage, duration_minutes, passed, results: questionResults } = results;

  return (
    <div className="container">
      <div className="card">
        {/* Results Header */}
        <div className="results-container">
          <div style={{ marginBottom: '30px' }}>
            {passed ? (
              <Award size={80} color="#28a745" style={{ marginBottom: '20px' }} />
            ) : (
              <XCircle size={80} color="#dc3545" style={{ marginBottom: '20px' }} />
            )}
            <h1 style={{ 
              fontSize: '36px', 
              marginBottom: '10px',
              color: passed ? '#28a745' : '#dc3545'
            }}>
              {passed ? 'Congratulations!' : 'Better Luck Next Time'}
            </h1>
            <p style={{ fontSize: '18px', color: '#666', marginBottom: '30px' }}>
              {passed 
                ? 'You have successfully passed the GCP Cloud Architect practice exam!'
                : 'You need to score 70% or higher to pass. Keep studying and try again!'
              }
            </p>
          </div>

          {/* Score Display */}
          <div className="score-display" style={{ 
            color: passed ? '#28a745' : '#dc3545',
            marginBottom: '30px'
          }}>
            {percentage}%
          </div>

          {/* Stats Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '20px', 
            marginBottom: '40px' 
          }}>
            <div style={{ 
              padding: '20px', 
              background: '#f8f9fa', 
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <CheckCircle size={32} color="#28a745" style={{ marginBottom: '10px' }} />
              <h3 style={{ marginBottom: '5px', color: '#333' }}>Correct</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
                {score}
              </p>
            </div>
            
            <div style={{ 
              padding: '20px', 
              background: '#f8f9fa', 
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <XCircle size={32} color="#dc3545" style={{ marginBottom: '10px' }} />
              <h3 style={{ marginBottom: '5px', color: '#333' }}>Incorrect</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc3545' }}>
                {total_questions - score}
              </p>
            </div>
            
            <div style={{ 
              padding: '20px', 
              background: '#f8f9fa', 
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <Clock size={32} color="#4285f4" style={{ marginBottom: '10px' }} />
              <h3 style={{ marginBottom: '5px', color: '#333' }}>Time Taken</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#4285f4' }}>
                {Math.floor(duration_minutes)}m
              </p>
            </div>
            
            <div style={{ 
              padding: '20px', 
              background: '#f8f9fa', 
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <Award size={32} color="#ffc107" style={{ marginBottom: '10px' }} />
              <h3 style={{ marginBottom: '5px', color: '#333' }}>Total Questions</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffc107' }}>
                {total_questions}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ marginBottom: '40px' }}>
            <button 
              className="btn" 
              onClick={handleRetakeExam}
              style={{ 
                marginRight: '15px',
                background: 'linear-gradient(135deg, #4285f4, #34a853)',
                fontSize: '16px',
                padding: '12px 30px'
              }}
            >
              <RotateCcw size={20} style={{ marginRight: '8px' }} />
              Retake Exam
            </button>
            
            <button 
              className="btn btn-outline" 
              onClick={handleGoHome}
              style={{ 
                fontSize: '16px',
                padding: '12px 30px'
              }}
            >
              <Home size={20} style={{ marginRight: '8px' }} />
              Back to Home
            </button>
          </div>

          {/* Detailed Results Toggle */}
          <div style={{ marginBottom: '20px' }}>
            <button 
              className="btn btn-secondary"
              onClick={() => setShowDetails(!showDetails)}
              style={{ fontSize: '14px', padding: '10px 20px' }}
            >
              {showDetails ? 'Hide' : 'Show'} Detailed Results
            </button>
          </div>
        </div>

        {/* Detailed Results */}
        {showDetails && (
          <div style={{ marginTop: '40px', textAlign: 'left' }}>
            <h2 style={{ 
              marginBottom: '30px', 
              textAlign: 'center',
              color: '#333',
              borderBottom: '2px solid #e9ecef',
              paddingBottom: '15px'
            }}>
              Question-by-Question Review
            </h2>
            
            {questionResults.map((result, index) => (
              <div 
                key={index}
                className={`result-item ${result.is_correct ? 'correct' : 'incorrect'}`}
              >
                <div style={{ marginBottom: '15px' }}>
                  <h3 style={{ 
                    marginBottom: '10px',
                    color: result.is_correct ? '#155724' : '#721c24'
                  }}>
                    Question {index + 1} - {result.is_correct ? 'Correct' : 'Incorrect'}
                  </h3>
                  <p style={{ 
                    lineHeight: '1.6',
                    marginBottom: '15px',
                    color: '#333'
                  }}>
                    {result.question}
                  </p>
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <h4 style={{ marginBottom: '8px', color: '#666' }}>Your Answer:</h4>
                  <p style={{ 
                    padding: '8px 12px',
                    background: result.is_correct ? '#d4edda' : '#f8d7da',
                    borderRadius: '4px',
                    border: `1px solid ${result.is_correct ? '#c3e6cb' : '#f5c6cb'}`,
                    color: result.is_correct ? '#155724' : '#721c24',
                    fontWeight: '500'
                  }}>
                    {result.user_answer ? (
                      result.user_answer.length > 1 ? 
                        result.user_answer.split('').join(', ') : 
                        result.user_answer
                    ) : 'No answer provided'}
                  </p>
                </div>
                
                <div>
                  <h4 style={{ marginBottom: '8px', color: '#666' }}>Correct Answer:</h4>
                  <p style={{ 
                    padding: '8px 12px',
                    background: '#d1ecf1',
                    borderRadius: '4px',
                    border: '1px solid #bee5eb',
                    color: '#0c5460',
                    fontWeight: '500'
                  }}>
                    {result.correct_answer.length > 1 ? 
                      result.correct_answer.split('').join(', ') : 
                      result.correct_answer}
                  </p>
                </div>
                
                {result.choices && result.choices.length > 0 && (
                  <div style={{ marginTop: '15px' }}>
                    <h4 style={{ marginBottom: '8px', color: '#666' }}>All Options:</h4>
                    <div style={{ display: 'grid', gap: '5px' }}>
                      {result.choices.map((choice, choiceIndex) => {
                        // Handle multiple correct answers (e.g., "ACE", "AB", etc.)
                        const isCorrectChoice = result.correct_answer.length > 1 
                          ? result.correct_answer.includes(choice.letter)
                          : choice.letter === result.correct_answer;
                        
                        return (
                          <div 
                            key={choiceIndex}
                            style={{ 
                              padding: '6px 10px',
                              background: isCorrectChoice ? '#d4edda' : '#f8f9fa',
                              borderRadius: '4px',
                              border: `1px solid ${isCorrectChoice ? '#c3e6cb' : '#e9ecef'}`,
                              color: isCorrectChoice ? '#155724' : '#333'
                            }}
                          >
                            <strong>{choice.letter}.</strong> {choice.text}
                            {isCorrectChoice && (
                              <span style={{ 
                                marginLeft: '8px', 
                                fontSize: '12px', 
                                color: '#28a745',
                                fontWeight: 'bold'
                              }}>
                                ✓ Correct
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsPage;
