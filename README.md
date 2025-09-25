# GCP Cloud Architect Practice Exam Application

A comprehensive web application for practicing GCP Cloud Architect certification exam questions. Built with React frontend and Flask backend, featuring a modern UI and full exam simulation.

## Features

- **500+ Real Exam Questions**: Practice with actual GCP Cloud Architect exam questions
- **Full Exam Simulation**: 2-hour timed exam with realistic conditions
- **Modern UI**: Clean, responsive design with intuitive navigation
- **Progress Tracking**: Real-time progress monitoring and question navigation
- **Detailed Results**: Comprehensive score analysis and question-by-question review
- **Timer Management**: Automatic time tracking with warnings
- **Answer Review**: Detailed explanations and correct answers for all questions

## Tech Stack

- **Frontend**: React 18, React Router, Axios, Lucide React Icons
- **Backend**: Flask, Pandas, Flask-CORS
- **Database**: CSV file-based (no database setup required)
- **Deployment**: Docker, Docker Compose, Nginx

## Quick Start

### Option 1: Docker Compose (Recommended)

1. **Clone and navigate to the project directory:**
   ```bash
   cd /mnt/d/Joon/test
   ```

2. **Start the application:**
   ```bash
   docker-compose up --build
   ```

3. **Access the application:**
   - Open your browser and go to `http://localhost`
   - The application will be available on port 80

### Option 2: Manual Setup

#### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Start the Flask server:**
   ```bash
   python app.py
   ```

   The backend will be available at `http://localhost:5000`

#### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Start the React development server:**
   ```bash
   npm start
   ```

   The frontend will be available at `http://localhost:3000`

## Usage

1. **Start the Exam**: Click "Start Practice Exam" on the home page
2. **Answer Questions**: Navigate through questions using the navigation buttons or question grid
3. **Track Progress**: Monitor your progress and time remaining
4. **Submit Exam**: Submit when ready or when time runs out
5. **Review Results**: Get detailed feedback on your performance

## Exam Features

- **Time Limit**: 2 hours (120 minutes)
- **Question Count**: 500+ questions from the CSV file
- **Passing Score**: 70%
- **Navigation**: Free navigation between questions
- **Auto-save**: Answers are saved automatically
- **Timer Warnings**: Visual warnings when time is running low

## API Endpoints

### Backend API

- `POST /api/exam/start` - Start a new exam
- `GET /api/exam/question/<id>` - Get a specific question
- `POST /api/exam/answer` - Submit an answer
- `POST /api/exam/submit` - Submit the entire exam
- `GET /api/exam/progress` - Get exam progress
- `GET /api/exam/time` - Get remaining time
- `POST /api/exam/reset` - Reset the current exam

## File Structure

```
├── backend/
│   ├── app.py              # Flask application
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile         # Backend Docker configuration
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.js        # Main App component
│   │   └── index.js      # Entry point
│   ├── package.json      # Node.js dependencies
│   └── Dockerfile        # Frontend Docker configuration
├── Architect - result (2).csv  # Exam questions data
├── docker-compose.yml    # Docker Compose configuration
├── nginx.conf           # Nginx configuration
└── README.md           # This file
```

## Customization

### Adding More Questions

1. Update the CSV file with new questions following the same format
2. Restart the application to load new questions

### Modifying Exam Settings

Edit the following in `backend/app.py`:
- `time_limit`: Change exam duration (in minutes)
- Passing score threshold (currently 70%)

### Styling Changes

Modify CSS files in `frontend/src/`:
- `index.css`: Global styles
- `App.css`: Component-specific styles

## Troubleshooting

### Common Issues

1. **Port Already in Use**: Change ports in `docker-compose.yml` or stop conflicting services
2. **CSV File Not Found**: Ensure the CSV file is in the correct location
3. **CORS Issues**: The backend includes CORS headers, but check if firewall is blocking requests

### Docker Issues

1. **Build Failures**: Try `docker-compose down` and `docker-compose up --build --force-recreate`
2. **Permission Issues**: Ensure Docker has proper permissions on the project directory

## Development

### Running in Development Mode

1. **Backend**: Run `python app.py` in the backend directory
2. **Frontend**: Run `npm start` in the frontend directory
3. **Hot Reload**: Both services support hot reloading during development

### Making Changes

1. **Backend Changes**: Restart the Flask server
2. **Frontend Changes**: React will automatically reload
3. **Docker Changes**: Rebuild containers with `docker-compose up --build`

## License

This project is for educational purposes. The exam questions are sourced from public practice materials.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the console logs for error messages
3. Ensure all dependencies are properly installed
