import sqlite3
import os

def init_database():
    """Initialize the database with songs table and preloaded data"""
    
    # Connect to database (creates file if doesn't exist)
    conn = sqlite3.connect('songs.db')
    cursor = conn.cursor()
    
    # Create songs table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS songs (
            song_id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            artist TEXT NOT NULL,
            mood TEXT NOT NULL,
            cover_url TEXT NOT NULL,
            youtube_link TEXT NOT NULL
        )
    ''')
    
    # Check if data already exists
    cursor.execute('SELECT COUNT(*) FROM songs')
    count = cursor.fetchone()[0]
    
    if count == 0:
        # Insert sample songs for each mood
        sample_songs = [
            # Happy songs
            ("Happy", "Pharrell Williams", "Happy", "https://i.ytimg.com/vi/ZbZSe6N_BXs/maxresdefault.jpg", "https://www.youtube.com/watch?v=ZbZSe6N_BXs"),
            ("Good as Hell", "Lizzo", "Happy", "https://i.ytimg.com/vi/SmbmeOgWsqE/maxresdefault.jpg", "https://www.youtube.com/watch?v=SmbmeOgWsqE"),
            ("Uptown Funk", "Mark Ronson ft. Bruno Mars", "Happy", "https://i.ytimg.com/vi/OPf0YbXqDm0/maxresdefault.jpg", "https://www.youtube.com/watch?v=OPf0YbXqDm0"),
            ("Can't Stop the Feeling", "Justin Timberlake", "Happy", "https://i.ytimg.com/vi/ru0K8uYEZWw/maxresdefault.jpg", "https://www.youtube.com/watch?v=ru0K8uYEZWw"),
            ("Walking on Sunshine", "Katrina and the Waves", "Happy", "https://i.ytimg.com/vi/iPUmE-tne5U/maxresdefault.jpg", "https://www.youtube.com/watch?v=iPUmE-tne5U"),
            ("Shake It Off", "Taylor Swift", "Happy", "https://i.ytimg.com/vi/nfWlot6h_JM/maxresdefault.jpg", "https://www.youtube.com/watch?v=nfWlot6h_JM"),
            ("Good Vibes", "Chris Janson", "Happy", "https://i.ytimg.com/vi/uQb7QRyF4p4/maxresdefault.jpg", "https://www.youtube.com/watch?v=uQb7QRyF4p4"),
            
            # Sad songs
            ("Someone Like You", "Adele", "Sad", "https://i.ytimg.com/vi/hLQl3WQQoQ0/maxresdefault.jpg", "https://www.youtube.com/watch?v=hLQl3WQQoQ0"),
            ("Hello", "Adele", "Sad", "https://i.ytimg.com/vi/YQHsXMglC9A/maxresdefault.jpg", "https://www.youtube.com/watch?v=YQHsXMglC9A"),
            ("The Sound of Silence", "Disturbed", "Sad", "https://i.ytimg.com/vi/u9Dg-g7t2l4/maxresdefault.jpg", "https://www.youtube.com/watch?v=u9Dg-g7t2l4"),
            ("Mad World", "Gary Jules", "Sad", "https://i.ytimg.com/vi/4N3N1MlvVc4/maxresdefault.jpg", "https://www.youtube.com/watch?v=4N3N1MlvVc4"),
            ("Hurt", "Johnny Cash", "Sad", "https://i.ytimg.com/vi/8AHCfZTRGiI/maxresdefault.jpg", "https://www.youtube.com/watch?v=8AHCfZTRGiI"),
            ("Black", "Pearl Jam", "Sad", "https://i.ytimg.com/vi/5ZH2it92ZmA/maxresdefault.jpg", "https://www.youtube.com/watch?v=5ZH2it92ZmA"),
            ("Tears in Heaven", "Eric Clapton", "Sad", "https://i.ytimg.com/vi/JxPj3GAYYZ0/maxresdefault.jpg", "https://www.youtube.com/watch?v=JxPj3GAYYZ0"),
            
            # Angry songs
            ("Break Stuff", "Limp Bizkit", "Angry", "https://i.ytimg.com/vi/ZpUYjpKg9KY/maxresdefault.jpg", "https://www.youtube.com/watch?v=ZpUYjpKg9KY"),
            ("Bodies", "Drowning Pool", "Angry", "https://i.ytimg.com/vi/04F4xlWSFh0/maxresdefault.jpg", "https://www.youtube.com/watch?v=04F4xlWSFh0"),
            ("Chop Suey", "System of a Down", "Angry", "https://i.ytimg.com/vi/CSvFpBOe8eY/maxresdefault.jpg", "https://www.youtube.com/watch?v=CSvFpBOe8eY"),
            ("In the End", "Linkin Park", "Angry", "https://i.ytimg.com/vi/eVTXPUF4Oz4/maxresdefault.jpg", "https://www.youtube.com/watch?v=eVTXPUF4Oz4"),
            ("B.Y.O.B.", "System of a Down", "Angry", "https://i.ytimg.com/vi/zUzd9KyIDrM/maxresdefault.jpg", "https://www.youtube.com/watch?v=zUzd9KyIDrM"),
            ("Killing in the Name", "Rage Against the Machine", "Angry", "https://i.ytimg.com/vi/bWXazVhlyxQ/maxresdefault.jpg", "https://www.youtube.com/watch?v=bWXazVhlyxQ"),
            ("Given Up", "Linkin Park", "Angry", "https://i.ytimg.com/vi/0xyxtzD54rM/maxresdefault.jpg", "https://www.youtube.com/watch?v=0xyxtzD54rM"),
            
            # Depressed songs
            ("Breathe Me", "Sia", "Depressed", "https://i.ytimg.com/vi/hSjIz8oQuko/maxresdefault.jpg", "https://www.youtube.com/watch?v=hSjIz8oQuko"),
            ("Heavy", "Linkin Park ft. Kiiara", "Depressed", "https://i.ytimg.com/vi/5dmQ3QWpy1Q/maxresdefault.jpg", "https://www.youtube.com/watch?v=5dmQ3QWpy1Q"),
            ("Numb", "Linkin Park", "Depressed", "https://i.ytimg.com/vi/kXYiU_JCYtU/maxresdefault.jpg", "https://www.youtube.com/watch?v=kXYiU_JCYtU"),
            ("How to Save a Life", "The Fray", "Depressed", "https://i.ytimg.com/vi/cjVQ36NhbMk/maxresdefault.jpg", "https://www.youtube.com/watch?v=cjVQ36NhbMk"),
            ("Boulevard of Broken Dreams", "Green Day", "Depressed", "https://i.ytimg.com/vi/Soa3gO7tL-c/maxresdefault.jpg", "https://www.youtube.com/watch?v=Soa3gO7tL-c"),
            ("Fade to Black", "Metallica", "Depressed", "https://i.ytimg.com/vi/WEQnzs8wl6E/maxresdefault.jpg", "https://www.youtube.com/watch?v=WEQnzs8wl6E"),
            ("One More Day", "Diamond Rio", "Depressed", "https://i.ytimg.com/vi/W7EyC0VFhLY/maxresdefault.jpg", "https://www.youtube.com/watch?v=W7EyC0VFhLY"),
        ]
        
        cursor.executemany('''
            INSERT INTO songs (title, artist, mood, cover_url, youtube_link)
            VALUES (?, ?, ?, ?, ?)
        ''', sample_songs)
        
        print(f"Database initialized with {len(sample_songs)} songs")
    
    conn.commit()
    conn.close()

def get_songs_by_mood(mood):
    """Get all songs for a specific mood"""
    conn = sqlite3.connect('songs.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT song_id, title, artist, mood, cover_url, youtube_link 
        FROM songs 
        WHERE mood = ?
        ORDER BY RANDOM()
        LIMIT 10
    ''', (mood,))
    
    songs = cursor.fetchall()
    conn.close()
    
    # Convert to list of dictionaries
    result = []
    for song in songs:
        result.append({
            'song_id': song[0],
            'title': song[1],
            'artist': song[2],
            'mood': song[3],
            'cover_url': song[4],
            'youtube_link': song[5]
        })
    
    return result

def init_users_table():
    """Initialize the users table"""
    conn = sqlite3.connect('songs.db')
    cursor = conn.cursor()
    
    # Create users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.commit()
    conn.close()

def create_user(username, email, password):
    """Create a new user"""
    import hashlib
    
    # Hash the password
    password_hash = hashlib.sha256(password.encode()).hexdigest()
    
    try:
        conn = sqlite3.connect('songs.db')
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO users (username, email, password_hash)
            VALUES (?, ?, ?)
        ''', (username, email, password_hash))
        
        user_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return user_id
    except sqlite3.IntegrityError:
        return None

def verify_user(email, password):
    """Verify user credentials"""
    import hashlib
    
    password_hash = hashlib.sha256(password.encode()).hexdigest()
    
    conn = sqlite3.connect('songs.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT user_id, username, email 
        FROM users 
        WHERE email = ? AND password_hash = ?
    ''', (email, password_hash))
    
    user = cursor.fetchone()
    conn.close()
    
    if user:
        return {
            'user_id': user[0],
            'username': user[1],
            'email': user[2]
        }
    return None

def get_user_by_email(email):
    """Get user by email"""
    conn = sqlite3.connect('songs.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT user_id, username, email 
        FROM users 
        WHERE email = ?
    ''', (email,))
    
    user = cursor.fetchone()
    conn.close()
    
    if user:
        return {
            'user_id': user[0],
            'username': user[1],
            'email': user[2]
        }
    return None

if __name__ == "__main__":
    init_database()
    init_users_table()
    print("Database setup complete!")