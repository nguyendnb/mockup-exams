const axios = require('axios');

async function testExamFlow() {
  try {
    console.log('🧪 Testing Exam Flow...');
    
    // Test 1: Check backend health
    console.log('\n1. Testing backend health...');
    const healthResponse = await axios.get('http://localhost:5000/api/health');
    console.log('✅ Backend health:', healthResponse.data);
    
    // Test 2: Start exam
    console.log('\n2. Starting exam...');
    const startResponse = await axios.post('http://localhost:5000/api/exam/start');
    console.log('✅ Exam started:', startResponse.data);
    
    // Test 3: Get first question
    console.log('\n3. Getting first question...');
    const questionResponse = await axios.get('http://localhost:5000/api/exam/question/0');
    console.log('✅ Question loaded:', {
      success: questionResponse.data.success,
      question: questionResponse.data.question.question.substring(0, 100) + '...',
      choices: questionResponse.data.question.choices.length
    });
    
    // Test 4: Test frontend accessibility
    console.log('\n4. Testing frontend...');
    const frontendResponse = await axios.get('http://localhost:3000');
    console.log('✅ Frontend accessible:', frontendResponse.status === 200);
    
    console.log('\n🎉 All tests passed! The exam should be working now.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

testExamFlow();

