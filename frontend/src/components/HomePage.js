import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, Award, CheckCircle } from 'lucide-react';
import axios from 'axios';

const HomePage = () => {
  const navigate = useNavigate();
  const [apiStatus, setApiStatus] = useState('Testing...');

  React.useEffect(() => {
    const testAPI = async () => {
      try {
        console.log('Testing API from HomePage...');
        const response = await axios.get('http://localhost:5000/api/health');
        console.log('API Response:', response.data);
        setApiStatus(`✅ API Working - ${response.data.question_count} questions loaded`);
      } catch (error) {
        console.error('API Error:', error);
        setApiStatus(`❌ API Error: ${error.message}`);
      }
    };
    testAPI();
  }, []);

  const handleStartExam = () => {
    navigate('/exam');
  };

  const testAPICall = async () => {
    try {
      console.log('Testing API call from button...');
      const response = await axios.get('http://localhost:5000/api/health');
      console.log('API Response:', response.data);
      alert(`API Working! Questions: ${response.data.question_count}`);
    } catch (error) {
      console.error('API Error:', error);
      alert(`API Error: ${error.message}`);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ textAlign: 'center', maxWidth: '800px', margin: '50px auto' }}>
        <div style={{ marginBottom: '30px' }}>
          <BookOpen size={64} color="#4285f4" style={{ marginBottom: '20px' }} />
          <h1 style={{ fontSize: '36px', marginBottom: '15px', color: '#333' }}>
            GCP Cloud Architect Practice Exam
          </h1>
          <p style={{ fontSize: '18px', color: '#666', lineHeight: '1.6' }}>
            Test your knowledge with real GCP Cloud Architect exam questions. 
            Practice with 500+ questions covering all exam domains.
          </p>
          <div style={{ 
            marginTop: '20px', 
            padding: '10px', 
            background: '#f8f9fa', 
            borderRadius: '8px',
            fontSize: '14px',
            color: '#333'
          }}>
            <strong>API Status:</strong> {apiStatus}
          </div>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px', 
          margin: '40px 0' 
        }}>
          <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
            <Clock size={32} color="#4285f4" style={{ marginBottom: '10px' }} />
            <h3 style={{ marginBottom: '10px', color: '#333' }}>2 Hours</h3>
            <p style={{ color: '#666', fontSize: '14px' }}>Complete exam time limit</p>
          </div>
          
          <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
            <BookOpen size={32} color="#4285f4" style={{ marginBottom: '10px' }} />
            <h3 style={{ marginBottom: '10px', color: '#333' }}>500+ Questions</h3>
            <p style={{ color: '#666', fontSize: '14px' }}>Real exam questions</p>
          </div>
          
          <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
            <Award size={32} color="#4285f4" style={{ marginBottom: '10px' }} />
            <h3 style={{ marginBottom: '10px', color: '#333' }}>70% Pass</h3>
            <p style={{ color: '#666', fontSize: '14px' }}>Minimum passing score</p>
          </div>
          
          <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
            <CheckCircle size={32} color="#4285f4" style={{ marginBottom: '10px' }} />
            <h3 style={{ marginBottom: '10px', color: '#333' }}>Instant Results</h3>
            <p style={{ color: '#666', fontSize: '14px' }}>Detailed feedback</p>
          </div>
        </div>

        <div style={{ marginTop: '40px' }}>
          <h2 style={{ marginBottom: '20px', color: '#333' }}>Exam Domains Covered</h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '15px',
            textAlign: 'left'
          }}>
            <div style={{ padding: '15px', background: '#e3f2fd', borderRadius: '6px' }}>
              <strong>Designing and planning a cloud solution architecture</strong>
            </div>
            <div style={{ padding: '15px', background: '#e8f5e8', borderRadius: '6px' }}>
              <strong>Managing and provisioning the cloud solution infrastructure</strong>
            </div>
            <div style={{ padding: '15px', background: '#fff3e0', borderRadius: '6px' }}>
              <strong>Designing for security and compliance</strong>
            </div>
            <div style={{ padding: '15px', background: '#f3e5f5', borderRadius: '6px' }}>
              <strong>Analyzing and optimizing technical and business processes</strong>
            </div>
            <div style={{ padding: '15px', background: '#e0f2f1', borderRadius: '6px' }}>
              <strong>Managing implementations and ensuring solution and operations reliability</strong>
            </div>
            <div style={{ padding: '15px', background: '#fce4ec', borderRadius: '6px' }}>
              <strong>Ensuring successful operation of a cloud solution</strong>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '40px' }}>
          <button 
            className="btn" 
            onClick={handleStartExam}
            style={{ 
              fontSize: '20px', 
              padding: '15px 40px',
              background: 'linear-gradient(135deg, #4285f4, #34a853)',
              border: 'none',
              borderRadius: '25px',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 5px 15px rgba(66, 133, 244, 0.3)'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px rgba(66, 133, 244, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 5px 15px rgba(66, 133, 244, 0.3)';
            }}
          >
            Start Practice Exam
          </button>
          
          <button 
            className="btn btn-secondary" 
            onClick={testAPICall}
            style={{ marginLeft: '10px' }}
          >
            Test API Call
          </button>
        </div>

        <div style={{ marginTop: '30px', padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
          <h3 style={{ marginBottom: '15px', color: '#333' }}>Instructions</h3>
          <ul style={{ textAlign: 'left', color: '#666', lineHeight: '1.6' }}>
            <li>You have 2 hours to complete the exam</li>
            <li>Answer all questions to the best of your ability</li>
            <li>You can navigate between questions freely</li>
            <li>Your progress is saved automatically</li>
            <li>You can submit the exam at any time</li>
            <li>A score of 70% or higher is required to pass</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
