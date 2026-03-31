// Puzzle JavaScript for SWARA
class PuzzleGame {
    constructor() {
        this.grid = document.getElementById('puzzleGrid');
        this.gameTime = document.getElementById('gameTime');
        this.gameMistakes = document.getElementById('gameMistakes');
        this.nextNumber = document.getElementById('nextNumber');
        this.gameProgress = document.getElementById('gameProgress');
        this.startGameBtn = document.getElementById('startGame');
        this.resetGameBtn = document.getElementById('resetGame');
        this.skipGameBtn = document.getElementById('skipGame');
        this.gameCompletion = document.getElementById('gameCompletion');
        this.finalTime = document.getElementById('finalTime');
        this.finalMistakes = document.getElementById('finalMistakes');
        this.avgTimePerTile = document.getElementById('avgTimePerTile');
        this.detectedMood = document.getElementById('detectedMood');
        this.completionMessage = document.getElementById('completionMessage');
        this.getRecommendationsBtn = document.getElementById('getRecommendations');
        this.playAgainBtn = document.getElementById('playAgain');
        this.loading = document.getElementById('loading');
        this.gameInstructions = document.getElementById('gameInstructions');
        this.gameStats = document.getElementById('gameStats');
        
        this.time = 0;
        this.mistakes = 0;
        this.nextExpectedNumber = 1;
        this.isActive = false;
        this.timer = null;
        this.tiles = [];
        this.mood = null;
        this.startTime = 0;
        this.clickTimes = [];
        
        this.initializePuzzle();
    }
    
    initializePuzzle() {
        this.setupEventListeners();
        this.updateDisplay();
    }
    
    setupEventListeners() {
        this.startGameBtn.addEventListener('click', () => this.startGame());
        this.resetGameBtn.addEventListener('click', () => this.resetGame());
        this.skipGameBtn.addEventListener('click', () => this.skipGame());
        this.getRecommendationsBtn.addEventListener('click', () => this.getRecommendations());
        this.playAgainBtn.addEventListener('click', () => this.playAgain());
    }
    
    startGame() {
        this.isActive = true;
        this.time = 0;
        this.mistakes = 0;
        this.nextExpectedNumber = 1;
        this.startTime = Date.now();
        this.clickTimes = [];
        
        this.startGameBtn.textContent = 'Game in Progress...';
        this.startGameBtn.disabled = true;
        this.resetGameBtn.disabled = false;
        this.skipGameBtn.disabled = true;
        
        this.generateTiles();
        this.startTimer();
        this.updateDisplay();
        
        // Hide instructions, show stats
        this.gameInstructions.classList.add('hidden');
        this.gameStats.classList.remove('hidden');
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
        const currentTime = Date.now();
        
        if (clickedNumber === this.nextExpectedNumber) {
            // Correct tile
            this.clickTimes.push(currentTime - this.startTime);
            tile.classList.add('correct');
            tile.style.visibility = 'hidden';
            this.nextExpectedNumber++;
            
            // Update progress
            const progress = Math.round((this.nextExpectedNumber - 1) / 16 * 100);
            this.gameProgress.textContent = `${progress}%`;
            
            if (this.nextExpectedNumber > 16) {
                this.completeGame();
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
        this.gameTime.textContent = `${this.time}s`;
        this.gameMistakes.textContent = this.mistakes;
        this.nextNumber.textContent = this.nextExpectedNumber;
    }
    
    completeGame() {
        this.isActive = false;
        clearInterval(this.timer);
        
        // Calculate final stats
        const finalTime = this.time;
        const finalMistakes = this.mistakes;
        const avgTimePerTile = this.clickTimes.length > 0 ? 
            Math.round(this.clickTimes.reduce((a, b) => a + b, 0) / this.clickTimes.length / 1000 * 10) / 10 : 0;
        
        // Determine mood based on performance
        this.mood = this.analyzePerformance(finalTime, finalMistakes, avgTimePerTile);
        
        // Update completion display
        this.finalTime.textContent = `${finalTime}s`;
        this.finalMistakes.textContent = finalMistakes;
        this.avgTimePerTile.textContent = `${avgTimePerTile}s`;
        this.detectedMood.textContent = this.mood;
        this.completionMessage.textContent = this.getCompletionMessage(this.mood);
        
        // Add mood-specific styling
        this.detectedMood.className = `stat-value mood-indicator mood-${this.mood.toLowerCase()}`;
        
        // Show completion
        this.gameCompletion.classList.remove('hidden');
        this.gameStats.classList.add('hidden');
        
        // Enable action buttons
        this.getRecommendationsBtn.disabled = false;
        this.playAgainBtn.disabled = false;
        
        // Reset game controls
        this.startGameBtn.textContent = 'Start Game';
        this.startGameBtn.disabled = false;
        this.resetGameBtn.disabled = true;
        this.skipGameBtn.disabled = false;
    }
    
    analyzePerformance(time, mistakes, avgTimePerTile) {
        const mistakeRate = mistakes / 16;
        const timePerTile = time / 16;
        
        if (mistakeRate > 0.3) {
            return 'Angry'; // High mistakes suggest frustration
        } else if (timePerTile > 3) {
            return 'Depressed'; // Slow response suggests low energy
        } else if (timePerTile < 1.5 && mistakeRate < 0.1) {
            return 'Happy'; // Fast and accurate suggests high energy
        } else if (mistakeRate > 0.2) {
            return 'Angry'; // Moderate mistakes suggest irritation
        } else {
            return 'Sad'; // Moderate performance suggests melancholy
        }
    }
    
    getCompletionMessage(mood) {
        const messages = {
            'Happy': 'Excellent performance! Your quick and accurate responses suggest you\'re in a positive, energetic mood.',
            'Sad': 'You took your time with the puzzle. Your measured approach suggests a contemplative, perhaps melancholic state.',
            'Angry': 'Your responses showed some frustration. This might indicate you\'re feeling stressed or irritated.',
            'Depressed': 'You completed the puzzle at a slower pace. This could reflect low energy or motivation levels.'
        };
        return messages[mood] || 'Your behavioral patterns have been analyzed.';
    }
    
    resetGame() {
        if (this.isActive) {
            clearInterval(this.timer);
            this.isActive = false;
        }
        
        this.time = 0;
        this.mistakes = 0;
        this.nextExpectedNumber = 1;
        this.clickTimes = [];
        
        this.startGameBtn.textContent = 'Start Game';
        this.startGameBtn.disabled = false;
        this.resetGameBtn.disabled = true;
        this.skipGameBtn.disabled = false;
        
        this.gameCompletion.classList.add('hidden');
        this.gameInstructions.classList.remove('hidden');
        this.gameStats.classList.add('hidden');
        
        this.updateDisplay();
    }
    
    skipGame() {
        if (confirm('Are you sure you want to skip the puzzle? Your mood will be set to neutral.')) {
            this.mood = 'Neutral';
            this.completeGame();
        }
    }
    
    async getRecommendations() {
        this.loading.classList.remove('hidden');
        this.getRecommendationsBtn.disabled = true;
        
        try {
            const response = await fetch('/get_recommendations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    mood: this.mood,
                    module_type: 'puzzle',
                    performance: {
                        time: this.time,
                        mistakes: this.mistakes,
                        avgTimePerTile: this.clickTimes.length > 0 ? 
                            this.clickTimes.reduce((a, b) => a + b, 0) / this.clickTimes.length / 1000 : 0
                    }
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.showRecommendations(data);
            } else {
                throw new Error(data.error || 'Failed to get recommendations');
            }
            
        } catch (error) {
            console.error('Error getting recommendations:', error);
            this.showError('Failed to get recommendations. Please try again.');
        } finally {
            this.loading.classList.add('hidden');
            this.getRecommendationsBtn.disabled = false;
        }
    }
    
    showRecommendations(data) {
        const modal = document.createElement('div');
        modal.className = 'recommendations-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>🎵 Your Music Recommendations</h2>
                    <button class="close-btn" onclick="this.closest('.recommendations-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="mood-summary">
                        <h3>Detected Mood: <span class="mood-${this.mood.toLowerCase()}">${this.mood}</span></h3>
                        <p>Based on your puzzle performance</p>
                        <div class="performance-stats">
                            <span>Time: ${this.time}s</span>
                            <span>Mistakes: ${this.mistakes}</span>
                            <span>Avg per tile: ${this.clickTimes.length > 0 ? 
                                Math.round(this.clickTimes.reduce((a, b) => a + b, 0) / this.clickTimes.length / 1000 * 10) / 10 : 0}s</span>
                        </div>
                    </div>
                    <div class="songs-grid">
                        ${data.songs.map(song => `
                            <div class="song-card">
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
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    playAgain() {
        this.resetGame();
        this.startGame();
    }
    
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-notification';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
}

// Initialize puzzle when page loads
document.addEventListener('DOMContentLoaded', function() {
    new PuzzleGame();
});

// Add CSS for puzzle styling
const style = document.createElement('style');
style.textContent = `
    .puzzle-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;
        max-width: 400px;
        margin: 0 auto;
    }
    
    .puzzle-tile {
        aspect-ratio: 1;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        font-weight: bold;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
        user-select: none;
    }
    
    .puzzle-tile:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    }
    
    .puzzle-tile.correct {
        background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
        animation: correctPulse 0.5s ease;
    }
    
    .puzzle-tile.wrong {
        background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%);
        animation: wrongShake 0.5s ease;
    }
    
    @keyframes correctPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    @keyframes wrongShake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    .game-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 15px;
        margin: 20px 0;
    }
    
    .stat-item {
        background: white;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .stat-item i {
        font-size: 1.5rem;
        color: #007bff;
    }
    
    .stat-info {
        display: flex;
        flex-direction: column;
    }
    
    .stat-label {
        font-size: 0.8rem;
        color: #666;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .stat-value {
        font-size: 1.2rem;
        font-weight: bold;
        color: #333;
    }
    
    .mood-indicator {
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: bold;
    }
    
    .mood-indicator.mood-happy {
        background: #ffc107;
        color: #000;
    }
    
    .mood-indicator.mood-sad {
        background: #17a2b8;
        color: white;
    }
    
    .mood-indicator.mood-angry {
        background: #dc3545;
        color: white;
    }
    
    .mood-indicator.mood-depressed {
        background: #6f42c1;
        color: white;
    }
    
    .mood-indicator.mood-neutral {
        background: #6c757d;
        color: white;
    }
    
    .completion-card {
        background: white;
        border-radius: 12px;
        padding: 30px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        text-align: center;
    }
    
    .completion-header {
        margin-bottom: 20px;
    }
    
    .completion-header i {
        font-size: 3rem;
        color: #ffc107;
        margin-bottom: 10px;
    }
    
    .completion-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
        margin: 20px 0;
    }
    
    .completion-stat {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        background: #f8f9fa;
        border-radius: 6px;
    }
    
    .performance-stats {
        display: flex;
        gap: 15px;
        justify-content: center;
        margin-top: 10px;
    }
    
    .performance-stats span {
        background: #f8f9fa;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.9rem;
    }
    
    .recommendations-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }
    
    .modal-content {
        background: white;
        border-radius: 12px;
        max-width: 800px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid #eee;
    }
    
    .close-btn {
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
        color: #666;
    }
    
    .modal-body {
        padding: 20px;
    }
    
    .songs-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin-top: 20px;
    }
    
    .song-card {
        border: 1px solid #eee;
        border-radius: 8px;
        overflow: hidden;
        transition: transform 0.2s ease;
    }
    
    .song-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
    
    .song-cover img {
        width: 100%;
        height: 150px;
        object-fit: cover;
    }
    
    .song-info {
        padding: 15px;
    }
    
    .song-info h4 {
        margin: 0 0 5px 0;
        font-size: 1rem;
    }
    
    .song-info p {
        margin: 0 0 10px 0;
        color: #666;
        font-size: 0.9rem;
    }
    
    .mood-tag {
        background: #007bff;
        color: white;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 0.8rem;
    }
    
    .song-actions {
        padding: 0 15px 15px;
    }
    
    .play-btn {
        background: #007bff;
        color: white;
        padding: 8px 16px;
        border-radius: 6px;
        text-decoration: none;
        display: inline-block;
        transition: background 0.2s ease;
    }
    
    .play-btn:hover {
        background: #0056b3;
    }
    
    .error-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: #dc3545;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 1001;
        animation: slideIn 0.3s ease;
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }
`;
document.head.appendChild(style);
