# SWARA-AI-Powered-Mood-Based-Music-Recommendation-System

# SWARA - AI-Powered Mood-Based Music Recommendation System

A sophisticated web application that detects user moods through interactive modules and recommends personalized music based on emotional states.

## 🎵 Features

### Mood Detection Methods
- **Quiz Module**: Answer personality and mood-based questions to determine emotional state
- **Image Analysis Module**: View images and select your emotional response
- **Puzzle Game**: Engage in a puzzle game and track your mood through gameplay

### Music Recommendations
- Personalized music recommendations based on detected moods
- Curated song catalog across multiple emotional categories:
  - Happy 😊
  - Sad 😢
  - Angry 😠
  - Depressed 😔

### User Authentication
- Secure user registration and login
- Password hashing with SHA-256
- Session management
- Forgot password functionality

### User Dashboard
- Personalized user experience
- Quick access to all mood detection modules
- Music recommendations feed
- User profile management

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- pip (Python package manager)
- Virtual environment (recommended)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/SWARA.git
cd SWARA
```

2. **Create a virtual environment**
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Run the application**
```bash
python app.py
```

The application will start on `http://localhost:5001`

## 📁 Project Structure

```
SWARA/
├── app.py                 # Main Flask application
├── database.py            # Database initialization and queries
├── requirements.txt       # Python dependencies
├── static/
│   ├── css/
│   │   ├── auth.css      # Authentication pages styling
│   │   ├── dashboard.css # Dashboard styling
│   │   ├── style.css     # General styling
│   │   └── styles.css    # Additional styles
│   └── js/
│       ├── auth.js       # Authentication logic
│       ├── dashboard.js  # Dashboard functionality
│       ├── quiz.js       # Quiz module logic
│       ├── images.js     # Image analysis logic
│       ├── puzzle.js     # Puzzle game logic
│       └── main.js       # Main application logic
├── templates/
│   ├── index.html        # Landing page
│   ├── signup.html       # User registration
│   ├── signin.html       # User login
│   ├── dashboard.html    # Main dashboard
│   ├── quiz.html         # Quiz module
│   ├── images.html       # Image analysis module
│   ├── puzzle.html       # Puzzle game module
│   ├── image.html        # Image display page
│   ├── forgot_password.html
│   └── landing.html      # Welcome page
└── quiz-game/            # Quiz game assets
    └── src/assets/       # Game assets
```

## 🗄️ Database

The application uses SQLite with two main tables:

### Songs Table
```sql
CREATE TABLE songs (
    song_id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    mood TEXT NOT NULL,
    cover_url TEXT NOT NULL,
    youtube_link TEXT NOT NULL
)
```

### Users Table
```sql
CREATE TABLE users (
    user_id INTEGER PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

## 🔐 Authentication

- User registration with email validation
- Password requirements: Minimum 6 characters
- Passwords hashed using SHA-256
- Session-based authentication

## 🎮 Modules

### 1. Quiz Module
Interactive mood detection through personality questions.
- Multiple choice questions
- Scoring system
- Mood classification

### 2. Image Analysis
Emotional response to curated images.
- View various images
- Select emotional response
- Mood determination

### 3. Puzzle Game
Classic puzzle gameplay with mood tracking.
- Click-based puzzle game
- Difficulty levels
- Session tracking

## 🎵 Music Catalog

Pre-loaded with 28+ songs across 4 mood categories:
- **7 Happy songs** - Uplifting and energetic tracks
- **7 Sad songs** - Emotional and melancholic tracks
- **7 Angry songs** - High-energy rock/metal tracks
- **7 Depressed songs** - Introspective and somber tracks

## 🛠️ API Endpoints

### Authentication
- `POST /register` - User registration
- `POST /login` - User login
- `GET /logout` - User logout
- `POST /reset_password` - Password reset request

### Application
- `GET /` - Landing page
- `GET /signup` - Signup page
- `GET /signin` - Signin page
- `GET /dashboard` - Main dashboard (protected)
- `GET /quiz` - Quiz module (protected)
- `GET /images` - Image analysis (protected)
- `GET /puzzle` - Puzzle game (protected)
- `POST /get_recommendations` - Get music recommendations (protected)

## 🔧 Configuration

The application runs with the following defaults:
- **Host**: 0.0.0.0 (accessible from any interface)
- **Port**: 5001
- **Debug Mode**: Enabled (development only)
- **Database**: SQLite (`songs.db`)

## 📦 Dependencies

```
Flask==2.3.3
Werkzeug==2.3.7
gunicorn
```

See `requirements.txt` for complete list.

## 🚨 Security Notes

- **Production**: Use environment variables for sensitive data
- **Passwords**: Consider using bcrypt or argon2 instead of SHA-256
- **HTTPS**: Enable SSL/TLS in production
- **CORS**: Configure appropriate CORS policies
- **Secret Key**: Change `app.secret_key` in production

## 📝 Usage

1. **Sign Up**: Create a new account with email and password
2. **Login**: Access your account
3. **Choose Module**: Select quiz, image analysis, or puzzle game
4. **Complete Module**: Answer questions or interact with content
5. **Get Recommendations**: Receive mood-based music suggestions
6. **Play Music**: Access YouTube links to listen to recommended songs

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 👥 Author

Created as an AI-Powered Music Recommendation System

## 🐛 Bug Reports

Please report bugs by opening an issue on the GitHub repository.

## 🎯 Future Enhancements

- [ ] Machine learning mood prediction
- [ ] Spotify API integration
- [ ] User listening history
- [ ] Playlist creation
- [ ] Social features (sharing recommendations)
- [ ] Mobile app version
- [ ] Advanced mood analytics

## 📞 Support

For questions or support, please open an issue on the repository.

---

**Made with ❤️ for music lovers and mood explorers**
