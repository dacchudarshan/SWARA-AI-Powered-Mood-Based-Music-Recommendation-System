// Main script for SWARA mood detection flow
let currentModule = 0;
let userMoods = {
    quiz: null,
    images: null,
    puzzle: null
};
let puzzleGame = null;

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize all modules
    initializeQuiz();
    initializeImages();
    initializePuzzle();
    
    // Set up navigation
    setupNavigation();
    
    // Show first module
    showModule(0);
}

function setupNavigation() {
    // Progress bar functionality
    updateProgress();
    
    // Next button handlers
    document.getElementById('quizNext').addEventListener('click', () => nextModule());
    document.getElementById('imageNext').addEventListener('click', () => nextModule());
    document.getElementById('puzzleNext').addEventListener('click', () => getRecommendations());
}

function initializeQuiz() {
    const questions = document.querySelectorAll('.question');
    const options = document.querySelectorAll('.option');
    const nextBtn = document.getElementById('quizNext');
    
    let currentQuestion = 0;
    let quizAnswers = [];
    
    // Handle option selection
    options.forEach(option => {
        option.addEventListener('click', function() {
            const mood = this.dataset.mood;
            const questionId = this.closest('.question').id;
            
            // Remove active class from other options in this question
            this.closest('.question').querySelectorAll('.option').forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Add active class to selected option
            this.classList.add('selected');
            
            // Store answer
            quizAnswers[questionId] = mood;
            
            // Check if all questions are answered
            if (quizAnswers['question1'] && quizAnswers['question2'] && quizAnswers['question3']) {
                nextBtn.classList.remove('hidden');
                
                // Calculate dominant mood
                const moodCounts = {};
                Object.values(quizAnswers).forEach(mood => {
                    moodCounts[mood] = (moodCounts[mood] || 0) + 1;
                });
                
                const dominantMood = Object.keys(moodCounts).reduce((a, b) => 
                    moodCounts[a] > moodCounts[b] ? a : b
                );
                
                userMoods.quiz = dominantMood;
            }
        });
    });
}

function initializeImages() {
    const imageCards = document.querySelectorAll('.image-card');
    const nextBtn = document.getElementById('imageNext');
    
    imageCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove selection from other cards
            imageCards.forEach(c => c.classList.remove('selected'));
            
            // Select this card
            this.classList.add('selected');
            
            // Store mood
            userMoods.images = this.dataset.mood;
            
            // Show next button
            nextBtn.classList.remove('hidden');
        });
    });
}

function initializePuzzle() {
    const startBtn = document.getElementById('startPuzzle');
    const skipBtn = document.getElementById('skipPuzzle');
    const nextBtn = document.getElementById('puzzleNext');
    
    startBtn.addEventListener('click', startPuzzleGame);
    skipBtn.addEventListener('click', skipPuzzle);
    
    // Initialize puzzle game
    puzzleGame = new PuzzleGame();
}

class PuzzleGame {
    constructor() {
        this.grid = document.getElementById('puzzleGrid');
        this.timeElement = document.getElementById('puzzleTime');
        this.mistakesElement = document.getElementById('puzzleMistakes');
        this.nextNumberElement = document.getElementById('nextNumber');
        this.startBtn = document.getElementById('startPuzzle');
        
        this.time = 0;
        this.mistakes = 0;
        this.nextNumber = 1;
        this.isActive = false;
        this.timer = null;
        this.tiles = [];
        this.mood = null;
    }
    
    start() {
        this.isActive = true;
        this.time = 0;
        this.mistakes = 0;
        this.nextNumber = 1;
        
        this.startBtn.textContent = 'Restart Puzzle';
        this.generateTiles();
        this.startTimer();
        this.updateDisplay();
    }
    
    generateTiles() {
        this.grid.innerHTML = '';
        this.tiles = [];
        
        // Create 4x4 grid with numbers 1-16
        const numbers = Array.from({length: 16}, (_, i) => i + 1);
        
        // Shuffle numbers
        for (let i = numbers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
        }
        
        // Create tiles
        numbers.forEach((number, index) => {
            const tile = document.createElement('div');
            tile.className = 'puzzle-tile';
            tile.textContent = number;
            tile.dataset.number = number;
            tile.dataset.index = index;
            
            tile.addEventListener('click', () => this.handleTileClick(tile));
            
            this.grid.appendChild(tile);
            this.tiles.push(tile);
        });
    }
    
    handleTileClick(tile) {
        if (!this.isActive) return;
        
        const clickedNumber = parseInt(tile.dataset.number);
        
        if (clickedNumber === this.nextNumber) {
            // Correct tile
            tile.classList.add('correct');
            tile.style.visibility = 'hidden';
            this.nextNumber++;
            
            if (this.nextNumber > 16) {
                this.complete();
            }
        } else {
            // Wrong tile
            this.mistakes++;
            tile.classList.add('wrong');
            setTimeout(() => tile.classList.remove('wrong'), 500);
        }
        
        this.updateDisplay();
    }
    
    startTimer() {
        this.timer = setInterval(() => {
            this.time++;
            this.updateDisplay();
        }, 1000);
    }
    
    updateDisplay() {
        this.timeElement.textContent = `${this.time}s`;
        this.mistakesElement.textContent = this.mistakes;
        this.nextNumberElement.textContent = this.nextNumber;
    }
    
    complete() {
        this.isActive = false;
        clearInterval(this.timer);
        
        // Determine mood based on performance
        this.mood = this.analyzePerformance();
        userMoods.puzzle = this.mood;
        
        // Show completion message
        const completionMsg = document.createElement('div');
        completionMsg.className = 'puzzle-completion';
        completionMsg.innerHTML = `
            <h3>Puzzle Complete!</h3>
            <p>Time: ${this.time}s | Mistakes: ${this.mistakes}</p>
            <p>Detected mood: ${this.mood}</p>
        `;
        
        this.grid.parentNode.insertBefore(completionMsg, this.grid.nextSibling);
        
        // Show next button
        document.getElementById('puzzleNext').classList.remove('hidden');
    }
    
    analyzePerformance() {
        // Analyze behavior patterns to determine mood
        const avgTimePerTile = this.time / 16;
        const mistakeRate = this.mistakes / 16;
        
        if (mistakeRate > 0.3) {
            return 'Angry'; // High mistakes suggest frustration
        } else if (avgTimePerTile > 3) {
            return 'Depressed'; // Slow response suggests low energy
        } else if (avgTimePerTile < 1.5 && mistakeRate < 0.1) {
            return 'Happy'; // Fast and accurate suggests high energy
        } else {
            return 'Sad'; // Moderate performance suggests melancholy
        }
    }
    
    stop() {
        this.isActive = false;
        clearInterval(this.timer);
    }
}

function startPuzzleGame() {
    if (puzzleGame) {
        puzzleGame.start();
    }
}

function skipPuzzle() {
    if (confirm('Are you sure you want to skip the puzzle? Your mood will be analyzed from other modules.')) {
        userMoods.puzzle = 'Neutral';
        nextModule();
    }
}

function showModule(moduleIndex) {
    // Hide all modules
    document.querySelectorAll('.module').forEach(module => {
        module.classList.remove('active');
    });
    
    // Show selected module
    const modules = document.querySelectorAll('.module');
    if (modules[moduleIndex]) {
        modules[moduleIndex].classList.add('active');
    }
    
    // Update progress
    updateProgress(moduleIndex);
}

function nextModule() {
    currentModule++;
    if (currentModule < 4) {
        showModule(currentModule);
    }
}

function updateProgress(moduleIndex = currentModule) {
    // Update progress bar
    const progressFill = document.getElementById('progressFill');
    const progress = ((moduleIndex + 1) / 4) * 100;
    progressFill.style.width = `${progress}%`;
    
    // Update step indicators
    document.querySelectorAll('.step').forEach((step, index) => {
        if (index <= moduleIndex) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

async function getRecommendations() {
    const loading = document.getElementById('loading');
    const resultsModule = document.getElementById('resultsModule');
    
    // Show loading
    loading.classList.remove('hidden');
    resultsModule.classList.add('hidden');
    
    // Determine dominant mood
    const moodCounts = {};
    Object.values(userMoods).forEach(mood => {
        if (mood) {
            moodCounts[mood] = (moodCounts[mood] || 0) + 1;
        }
    });
    
    const dominantMood = Object.keys(moodCounts).reduce((a, b) => 
        moodCounts[a] > moodCounts[b] ? a : b
    ) || 'Happy';
    
    try {
        // Get recommendations from server
        const response = await fetch('/get_recommendations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                mood: dominantMood,
                module_type: 'combined'
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            displayResults(data);
        } else {
            throw new Error(data.error || 'Failed to get recommendations');
        }
        
    } catch (error) {
        console.error('Error getting recommendations:', error);
        displayError('Failed to get recommendations. Please try again.');
    } finally {
        loading.classList.add('hidden');
        resultsModule.classList.remove('hidden');
    }
}

function displayResults(data) {
    // Update mood display
    document.getElementById('dominantMood').textContent = data.dominant_mood;
    document.getElementById('quizMoodResult').textContent = userMoods.quiz || 'N/A';
    document.getElementById('imageMoodResult').textContent = userMoods.images || 'N/A';
    document.getElementById('puzzleMoodResult').textContent = userMoods.puzzle || 'N/A';
    
    // Display songs
    const songsContainer = document.getElementById('songsContainer');
    songsContainer.innerHTML = '';
    
    if (data.songs && data.songs.length > 0) {
        data.songs.forEach(song => {
            const songCard = createSongCard(song);
            songsContainer.appendChild(songCard);
        });
    } else {
        songsContainer.innerHTML = '<p class="no-songs">No songs found for this mood. Please try again.</p>';
    }
}

function createSongCard(song) {
    const card = document.createElement('div');
    card.className = 'song-card';
    card.innerHTML = `
        <div class="song-cover">
            <img src="${song.cover_url}" alt="${song.title}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\'%3E%3Crect width=\'200\' height=\'200\' fill=\'%23ddd\'/%3E%3Ctext x=\'100\' y=\'100\' text-anchor=\'middle\' fill=\'%23666\'%3E🎵%3C/text%3E%3C/svg%3E'">
        </div>
        <div class="song-info">
            <h4>${song.title}</h4>
            <p>${song.artist}</p>
            <span class="mood-tag">${song.mood}</span>
        </div>
        <div class="song-actions">
            <a href="${song.youtube_link}" target="_blank" class="play-btn">
                <i class="fas fa-play"></i> Play
            </a>
        </div>
    `;
    
    return card;
}

function displayError(message) {
    const songsContainer = document.getElementById('songsContainer');
    songsContainer.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            <p>${message}</p>
            <button onclick="getRecommendations()" class="retry-btn">Try Again</button>
        </div>
    `;
}

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}