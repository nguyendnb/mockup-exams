from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import random
import json
from datetime import datetime, timedelta
import os
import sys

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://frontend:3000", "http://localhost"], supports_credentials=True)

# Global variables to store questions and exam state
questions_data = None
current_exam = None

def load_questions():
    """Load questions from CSV file with comprehensive error handling"""
    global questions_data
    
    print("Starting to load questions...")
    
    # Define all possible paths for the CSV file
    possible_paths = [
        # Docker paths
        '/app/data/Architect - result (2).csv',
        '/app/Architect - result (2).csv',
        # Local development paths
        os.path.join(os.path.dirname(__file__), '..', 'Architect - result (2).csv'),
        os.path.join(os.getcwd(), 'Architect - result (2).csv'),
        'Architect - result (2).csv',
        # Additional paths
        os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'Architect - result (2).csv'),
    ]
    
    print(f"Current working directory: {os.getcwd()}")
    print(f"Script directory: {os.path.dirname(__file__)}")
    
    csv_path = None
    for i, path in enumerate(possible_paths):
        print(f"Trying path {i+1}: {path}")
        if os.path.exists(path):
            csv_path = path
            print(f"✅ Found CSV file at: {path}")
            break
        else:
            print(f"❌ Path not found: {path}")
    
    if not csv_path:
        error_msg = f"CSV file not found. Tried paths: {possible_paths}"
        print(f"❌ {error_msg}")
        raise FileNotFoundError(error_msg)
    
    try:
        print(f"Loading CSV from: {csv_path}")
        df = pd.read_csv(csv_path)
        print(f"✅ CSV loaded successfully: {len(df)} rows, {len(df.columns)} columns")
        print(f"Columns: {list(df.columns)}")
        
        # Filter out empty rows and clean data
        original_count = len(df)
        df = df.dropna(subset=['question'])
        df = df[df['question'].str.strip() != '']
        print(f"✅ After filtering: {len(df)} valid questions (removed {original_count - len(df)} empty rows)")
        
        # Convert to list of dictionaries for easier handling
        questions = []
        for idx, row in df.iterrows():
            try:
                question_data = {
                    'id': len(questions),
                    'filename': str(row.get('filename', '')),
                    'question': str(row['question']).strip(),
                    'choices': [],
                    'correct_answer': str(row.get('correct_answer', '')).strip(),
                    'user_data': str(row.get('user_data', '')),
                    'vote_count': int(row.get('user_data__vote_count', 0)) if pd.notna(row.get('user_data__vote_count')) else 0,
                    'is_most_voted': bool(row.get('user_data__is_most_voted', False)) if pd.notna(row.get('user_data__is_most_voted')) else False
                }
                
                # Add choices (A, B, C, D, E, F)
                for i in range(1, 7):
                    choice_key = f'choices__{i:03d}'
                    if choice_key in row and pd.notna(row[choice_key]) and str(row[choice_key]).strip():
                        question_data['choices'].append({
                            'letter': chr(64 + i),  # A, B, C, D, E, F
                            'text': str(row[choice_key]).strip()
                        })
                
                questions.append(question_data)
                
            except Exception as e:
                print(f"⚠️ Error processing row {idx}: {e}")
                continue
        
        print(f"✅ Successfully processed {len(questions)} questions")
        
        # Show sample question
        if questions:
            sample = questions[0]
            print(f"Sample question: {sample['question'][:100]}...")
            print(f"Sample choices: {len(sample['choices'])}")
            print(f"Sample correct answer: {sample['correct_answer']}")
        
        questions_data = questions
        return questions
        
    except Exception as e:
        error_msg = f"Error loading CSV file: {str(e)}"
        print(f"❌ {error_msg}")
        raise Exception(error_msg)

def initialize_exam():
    """Initialize a new exam session"""
    global current_exam, questions_data
    
    if not questions_data:
        raise Exception("Questions not loaded. Please restart the server.")
    
    # Shuffle questions for random order
    shuffled_questions = questions_data.copy()
    random.shuffle(shuffled_questions)
    
    current_exam = {
        'questions': shuffled_questions,
        'current_question': 0,
        'answers': {},
        'start_time': datetime.now(),
        'time_limit': 120  # 2 hours in minutes
    }
    
    print(f"✅ Exam initialized with {len(shuffled_questions)} questions")
    return current_exam

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint with detailed status"""
    try:
        questions_loaded = questions_data is not None and len(questions_data) > 0
        return jsonify({
            'status': 'healthy' if questions_loaded else 'unhealthy',
            'questions_loaded': questions_loaded,
            'question_count': len(questions_data) if questions_data is not None else 0,
            'current_exam': current_exam is not None,
            'working_directory': os.getcwd(),
            'files_in_cwd': os.listdir(os.getcwd()) if os.path.exists(os.getcwd()) else [],
            'files_in_app': os.listdir('/app') if os.path.exists('/app') else [],
            'files_in_data': os.listdir('/app/data') if os.path.exists('/app/data') else []
        })
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'error': str(e),
            'working_directory': os.getcwd()
        }), 500

@app.route('/api/exam/start', methods=['POST'])
def start_exam():
    """Start a new exam"""
    global current_exam
    try:
        if not questions_data:
            return jsonify({
                'success': False,
                'error': 'Questions not loaded. Please check server logs.'
            }), 500
            
        exam = initialize_exam()
        
        return jsonify({
            'success': True,
            'exam_id': 'exam_' + str(int(datetime.now().timestamp())),
            'total_questions': len(exam['questions']),
            'time_limit': exam['time_limit'],
            'first_question': exam['questions'][0] if exam['questions'] else None
        })
    except Exception as e:
        print(f"Error starting exam: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/exam/question/<int:question_id>', methods=['GET'])
def get_question(question_id):
    """Get a specific question by ID"""
    global current_exam
    
    if not current_exam:
        return jsonify({'error': 'No active exam'}), 400
    
    if question_id < 0 or question_id >= len(current_exam['questions']):
        return jsonify({'error': 'Invalid question ID'}), 400
    
    question = current_exam['questions'][question_id]
    
    # Remove correct answer from response for security
    question_copy = question.copy()
    del question_copy['correct_answer']
    
    return jsonify({
        'success': True,
        'question': question_copy,
        'question_number': question_id + 1,
        'total_questions': len(current_exam['questions']),
        'time_remaining': get_time_remaining()
    })

@app.route('/api/exam/answer', methods=['POST'])
def submit_answer():
    """Submit an answer for a question"""
    global current_exam
    
    if not current_exam:
        return jsonify({'error': 'No active exam'}), 400
    
    data = request.get_json()
    question_id = data.get('question_id')
    answer = data.get('answer')
    
    if question_id is None or answer is None:
        return jsonify({'error': 'Missing question_id or answer'}), 400
    
    if question_id < 0 or question_id >= len(current_exam['questions']):
        return jsonify({'error': 'Invalid question ID'}), 400
    
    # Store the answer
    current_exam['answers'][question_id] = answer
    
    return jsonify({
        'success': True,
        'message': 'Answer submitted successfully'
    })

@app.route('/api/exam/submit', methods=['POST'])
def submit_exam():
    """Submit the entire exam and get results"""
    global current_exam
    
    if not current_exam:
        return jsonify({'error': 'No active exam'}), 400
    
    # Calculate score
    correct_answers = 0
    total_questions = len(current_exam['questions'])
    results = []
    
    for i, question in enumerate(current_exam['questions']):
        user_answer = current_exam['answers'].get(i, '')
        correct_answer = question['correct_answer']
        
        # Handle multiple correct answers (e.g., "ACE", "AB", etc.)
        if len(correct_answer) > 1:
            # For multiple correct answers, check if user's answer contains all correct letters
            # Convert to sets for comparison (order doesn't matter)
            user_letters = set(user_answer.upper())
            correct_letters = set(correct_answer.upper())
            is_correct = user_letters == correct_letters
        else:
            # Single correct answer (original logic)
            is_correct = user_answer.upper() == correct_answer.upper()
        
        if is_correct:
            correct_answers += 1
        
        results.append({
            'question_id': i,
            'question': question['question'],
            'user_answer': user_answer,
            'correct_answer': question['correct_answer'],
            'is_correct': is_correct,
            'choices': question['choices']
        })
    
    score_percentage = (correct_answers / total_questions) * 100
    end_time = datetime.now()
    duration = end_time - current_exam['start_time']
    
    exam_result = {
        'success': True,
        'score': correct_answers,
        'total_questions': total_questions,
        'percentage': round(score_percentage, 2),
        'duration_minutes': round(duration.total_seconds() / 60, 2),
        'results': results,
        'passed': score_percentage >= 70  # 70% passing grade
    }
    
    # Reset exam
    current_exam = None
    
    return jsonify(exam_result)

@app.route('/api/exam/progress', methods=['GET'])
def get_progress():
    """Get current exam progress"""
    global current_exam
    
    if not current_exam:
        return jsonify({'error': 'No active exam'}), 400
    
    answered_questions = len(current_exam['answers'])
    total_questions = len(current_exam['questions'])
    
    return jsonify({
        'success': True,
        'answered_questions': answered_questions,
        'total_questions': total_questions,
        'progress_percentage': round((answered_questions / total_questions) * 100, 2),
        'time_remaining': get_time_remaining()
    })

def get_time_remaining():
    """Calculate remaining time in minutes"""
    if not current_exam:
        return 0
    
    elapsed = datetime.now() - current_exam['start_time']
    remaining_seconds = (current_exam['time_limit'] * 60) - elapsed.total_seconds()
    return max(0, round(remaining_seconds / 60, 2))

@app.route('/api/exam/time', methods=['GET'])
def get_time():
    """Get remaining time"""
    return jsonify({
        'success': True,
        'time_remaining': get_time_remaining()
    })

@app.route('/api/exam/reset', methods=['POST'])
def reset_exam():
    """Reset the current exam"""
    global current_exam
    current_exam = None
    return jsonify({'success': True, 'message': 'Exam reset successfully'})

if __name__ == '__main__':
    print("🚀 Starting GCP Cloud Architect Exam Backend...")
    print("=" * 50)
    
    # Load questions on startup
    try:
        questions = load_questions()
        print(f"✅ Successfully loaded {len(questions)} questions")
        print("=" * 50)
    except Exception as e:
        print(f"❌ Failed to load questions: {e}")
        print("=" * 50)
        print("The server will start but exam functionality will not work.")
        print("Please check the CSV file path and restart the server.")
        print("=" * 50)
    
    print("🌐 Starting Flask server on http://0.0.0.0:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)