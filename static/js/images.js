// Images JavaScript for SWARA - Multi-Round Visual Selection
class MultiRoundImageSelection {
    constructor() {
        this.currentRound = 1;
        this.totalRounds = 4;
        this.selections = {};
        this.finalMood = null;
        this.confidence = 0;
        
        // DOM elements
        this.instructionsSection = document.getElementById('instructionsSection');
        this.selectionRounds = document.getElementById('selectionRounds');
        this.resultsSection = document.getElementById('resultsSection');
        this.imageGrid = document.getElementById('imageGrid');
        this.currentRoundSpan = document.getElementById('currentRound');
        this.roundNumberSpan = document.getElementById('roundNumber');
        this.roundProgress = document.getElementById('roundProgress');
        this.previousRoundBtn = document.getElementById('previousRound');
        this.nextRoundBtn = document.getElementById('nextRound');
        this.startSelectionBtn = document.getElementById('startSelection');
        this.getRecommendationsBtn = document.getElementById('getRecommendations');
        this.restartSelectionBtn = document.getElementById('restartSelection');
        this.finalMoodSpan = document.getElementById('finalMood');
        this.confidenceLevelSpan = document.getElementById('confidenceLevel');
        this.roundSelectionsDiv = document.getElementById('roundSelections');
        this.loading = document.getElementById('loading');
        this.recommendationsModal = document.getElementById('recommendationsModal');
        this.recommendationsContent = document.getElementById('recommendationsContent');
        
        // Round configurations
        this.roundConfigs = {
            1: {
                title: "Basic Mood Indicators",
                description: "Choose the image that best represents your primary emotional state",
                images: [
                    { mood: "Happy", icon: "fa-sun", title: "Bright Sunshine", description: "Energetic and positive", color: "#FFD700" },
                    { mood: "Sad", icon: "fa-cloud-rain", title: "Rainy Day", description: "Melancholic and reflective", color: "#778899" },
                    { mood: "Angry", icon: "fa-bolt", title: "Storm Lightning", description: "Intense and powerful", color: "#DC143C" },
                    { mood: "Calm", icon: "fa-water", title: "Calm Ocean", description: "Peaceful and serene", color: "#87CEEB" }
                ]
            },
            2: {
                title: "Energy Levels",
                description: "Select the image that matches your current energy level",
                images: [
                    { mood: "Happy", icon: "fa-fire", title: "Burning Fire", description: "High energy and passion", color: "#FF4500" },
                    { mood: "Sad", icon: "fa-leaf", title: "Falling Leaves", description: "Low energy and quiet", color: "#8FBC8F" },
                    { mood: "Angry", icon: "fa-volcano", title: "Volcanic Eruption", description: "Explosive energy", color: "#8B0000" },
                    { mood: "Calm", icon: "fa-mountain", title: "Mountain Peak", description: "Steady and grounded", color: "#708090" }
                ]
            },
            3: {
                title: "Social Context",
                description: "Choose the image that reflects your social emotional state",
                images: [
                    { mood: "Happy", icon: "fa-users", title: "Group Celebration", description: "Social and connected", color: "#32CD32" },
                    { mood: "Sad", icon: "fa-user", title: "Lonely Figure", description: "Isolated and alone", color: "#696969" },
                    { mood: "Angry", icon: "fa-exclamation-triangle", title: "Conflict Zone", description: "Tense and confrontational", color: "#FF6347" },
                    { mood: "Calm", icon: "fa-home", title: "Peaceful Home", description: "Comfortable and safe", color: "#DEB887" }
                ]
            },
            4: {
                title: "Overall Emotional State",
                description: "Select the image that best captures your complete emotional state",
                images: [
                    { mood: "Happy", icon: "fa-star", title: "Shining Star", description: "Radiant and joyful", color: "#FFD700" },
                    { mood: "Sad", icon: "fa-cloud", title: "Gray Cloud", description: "Heavy and burdened", color: "#808080" },
                    { mood: "Angry", icon: "fa-bomb", title: "Explosion", description: "Volatile and intense", color: "#FF0000" },
                    { mood: "Calm", icon: "fa-dove", title: "Peaceful Dove", description: "Tranquil and balanced", color: "#F0F8FF" }
                ]
            }
        };
        
        this.initializeMultiRoundSelection();
    }
    
    initializeMultiRoundSelection() {
        this.setupEventListeners();
        this.showInstructions();
    }
    
    setupEventListeners() {
        // Start button
        this.startSelectionBtn.addEventListener('click', () => this.startSelection());
        
        // Navigation buttons
        this.previousRoundBtn.addEventListener('click', () => this.previousRound());
        this.nextRoundBtn.addEventListener('click', () => this.nextRound());
        
        // Action buttons
        this.getRecommendationsBtn.addEventListener('click', () => this.getRecommendations());
        this.restartSelectionBtn.addEventListener('click', () => this.restartSelection());
        
        // Modal close
        document.addEventListener('click', (e) => {
            if (e.target === this.recommendationsModal) {
                this.closeRecommendationsModal();
            }
        });
    }
    
    showInstructions() {
        this.instructionsSection.classList.remove('hidden');
        this.selectionRounds.classList.add('hidden');
        this.resultsSection.classList.add('hidden');
    }
    
    startSelection() {
        this.instructionsSection.classList.add('hidden');
        this.selectionRounds.classList.remove('hidden');
        this.loadRound(1);
    }
    
    loadRound(roundNumber) {
        this.currentRound = roundNumber;
        this.currentRoundSpan.textContent = roundNumber;
        this.roundNumberSpan.textContent = roundNumber;
        
        // Update progress
        const progress = (roundNumber / this.totalRounds) * 100;
        this.roundProgress.style.width = `${progress}%`;
        
        // Update navigation buttons
        this.previousRoundBtn.disabled = roundNumber === 1;
        this.nextRoundBtn.disabled = !this.selections[roundNumber];
        
        // Load images for this round
        this.loadRoundImages(roundNumber);
    }
    
    loadRoundImages(roundNumber) {
        const config = this.roundConfigs[roundNumber];
        this.imageGrid.innerHTML = '';
        
        config.images.forEach((image, index) => {
            const imageCard = document.createElement('div');
            imageCard.className = 'image-card';
            imageCard.dataset.mood = image.mood;
            imageCard.dataset.round = roundNumber;
            
            // Check if this image was already selected in this round
            if (this.selections[roundNumber] === image.mood) {
                imageCard.classList.add('selected');
            }
            
            imageCard.innerHTML = `
                <div class="image-wrapper">
                    <div class="image-placeholder" style="background: linear-gradient(135deg, ${image.color}, ${this.adjustColor(image.color, -20)})">
                        <i class="fas ${image.icon}"></i>
                    </div>
                    <div class="image-overlay">
                        <i class="fas ${image.icon}"></i>
                        <h3>${image.title}</h3>
                        <p>${image.description}</p>
                    </div>
                </div>
            `;
            
            imageCard.addEventListener('click', () => this.selectImage(imageCard, image.mood));
            this.imageGrid.appendChild(imageCard);
        });
    }
    
    adjustColor(color, amount) {
        // Simple color adjustment for gradients
        const colors = {
            '#FFD700': '#FFA500',
            '#778899': '#4A5568',
            '#DC143C': '#8B0000',
            '#87CEEB': '#4A90E2',
            '#FF4500': '#FF6347',
            '#8FBC8F': '#556B2F',
            '#8B0000': '#4A0000',
            '#708090': '#2F4F4F',
            '#32CD32': '#228B22',
            '#696969': '#2F2F2F',
            '#FF6347': '#DC143C',
            '#DEB887': '#CD853F',
            '#FF0000': '#8B0000',
            '#F0F8FF': '#E6E6FA',
            '#808080': '#404040'
        };
        return colors[color] || color;
    }
    
    selectImage(imageCard, mood) {
        const roundNumber = parseInt(imageCard.dataset.round);
        
        // Remove selection from other cards in this round
        this.imageGrid.querySelectorAll('.image-card').forEach(card => {
            if (parseInt(card.dataset.round) === roundNumber) {
                card.classList.remove('selected');
            }
        });
        
        // Select this card
        imageCard.classList.add('selected');
        this.selections[roundNumber] = mood;
        
        // Enable next button
        this.nextRoundBtn.disabled = false;
        
        // Show selection feedback
        this.showSelectionFeedback(mood, roundNumber);
    }
    
    showSelectionFeedback(mood, roundNumber) {
        const feedback = document.createElement('div');
        feedback.className = 'selection-feedback';
        feedback.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>Round ${roundNumber}: ${mood}</span>
        `;
        
        feedback.classList.add(`mood-${mood.toLowerCase()}`);
        document.body.appendChild(feedback);
        
        setTimeout(() => feedback.classList.add('show'), 100);
        setTimeout(() => {
            feedback.classList.remove('show');
            setTimeout(() => feedback.remove(), 300);
        }, 2000);
    }
    
    previousRound() {
        if (this.currentRound > 1) {
            this.loadRound(this.currentRound - 1);
        }
    }
    
    nextRound() {
        if (this.currentRound < this.totalRounds) {
            this.loadRound(this.currentRound + 1);
        } else {
            this.completeSelection();
        }
    }
    
    completeSelection() {
        this.loading.classList.remove('hidden');
        
        setTimeout(() => {
            this.calculateFinalMood();
            this.showResults();
            this.loading.classList.add('hidden');
        }, 1500);
    }
    
    calculateFinalMood() {
        const moodCounts = {};
        let totalSelections = 0;
        
        // Count mood occurrences across all rounds
        Object.values(this.selections).forEach(mood => {
            if (mood) {
                moodCounts[mood] = (moodCounts[mood] || 0) + 1;
                totalSelections++;
            }
        });
        
        // Find dominant mood
        let maxCount = 0;
        let dominantMood = 'Happy';
        
        Object.entries(moodCounts).forEach(([mood, count]) => {
            if (count > maxCount) {
                maxCount = count;
                dominantMood = mood;
            }
        });
        
        this.finalMood = dominantMood;
        this.confidence = Math.round((maxCount / totalSelections) * 100);
    }
    
    showResults() {
        this.selectionRounds.classList.add('hidden');
        this.resultsSection.classList.remove('hidden');
        
        // Update final mood display
        this.finalMoodSpan.textContent = this.finalMood;
        this.finalMoodSpan.className = `mood-display mood-${this.finalMood.toLowerCase()}`;
        this.confidenceLevelSpan.textContent = `${this.confidence}%`;
        
        // Show round breakdown
        this.showRoundBreakdown();
    }
    
    showRoundBreakdown() {
        this.roundSelectionsDiv.innerHTML = '';
        
        for (let round = 1; round <= this.totalRounds; round++) {
            const selection = this.selections[round];
            const config = this.roundConfigs[round];
            
            const roundDiv = document.createElement('div');
            roundDiv.className = 'round-selection';
            roundDiv.innerHTML = `
                <div class="round-info">
                    <h5>Round ${round}: ${config.title}</h5>
                    <span class="selection-mood mood-${selection.toLowerCase()}">${selection}</span>
                </div>
            `;
            
            this.roundSelectionsDiv.appendChild(roundDiv);
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
                    mood: this.finalMood,
                    module_type: 'images',
                    confidence: this.confidence,
                    selections: this.selections
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.showRecommendationsModal(data);
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
    
    showRecommendationsModal(data) {
        this.recommendationsContent.innerHTML = `
            <div class="mood-summary">
                <h3>Detected Mood: <span class="mood-${this.finalMood.toLowerCase()}">${this.finalMood}</span></h3>
                <p>Confidence: ${this.confidence}%</p>
                <p>Based on your 4 rounds of selections</p>
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
        `;
        
        this.recommendationsModal.classList.remove('hidden');
    }
    
    closeRecommendationsModal() {
        this.recommendationsModal.classList.add('hidden');
    }
    
    restartSelection() {
        this.currentRound = 1;
        this.selections = {};
        this.finalMood = null;
        this.confidence = 0;
        this.showInstructions();
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

// Global function for modal close
function closeRecommendationsModal() {
    const modal = document.getElementById('recommendationsModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Initialize multi-round image selection when page loads
document.addEventListener('DOMContentLoaded', function() {
    new MultiRoundImageSelection();
});

// Add CSS for enhanced styling
const style = document.createElement('style');
style.textContent = `
    .instructions-section {
        max-width: 800px;
        margin: 0 auto;
    }
    
    .instructions-content {
        display: grid;
        gap: 20px;
        margin-top: 30px;
    }
    
    .instruction-card {
        background: white;
        border-radius: 12px;
        padding: 25px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        border-left: 4px solid #FF8C00;
    }
    
    .instruction-card h3 {
        color: #FF8C00;
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .instruction-card ul {
        list-style: none;
        padding: 0;
    }
    
    .instruction-card li {
        padding: 8px 0;
        border-bottom: 1px solid #f0f0f0;
        position: relative;
        padding-left: 20px;
    }
    
    .instruction-card li:before {
        content: "•";
        color: #FF8C00;
        font-weight: bold;
        position: absolute;
        left: 0;
    }
    
    .instruction-card li:last-child {
        border-bottom: none;
    }
    
    .btn-large {
        padding: 15px 30px;
        font-size: 1.1em;
        margin-top: 20px;
    }
    
    .round-progress {
        margin: 30px 0;
        text-align: center;
    }
    
    .progress-text {
        margin-top: 10px;
        color: white;
        font-weight: bold;
    }
    
    .round-navigation {
        display: flex;
        justify-content: space-between;
        margin-top: 30px;
        padding: 20px 0;
    }
    
    .image-placeholder {
        width: 100%;
        height: 150px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 3rem;
        color: white;
        margin-bottom: 10px;
    }
    
    .results-content {
        background: white;
        border-radius: 12px;
        padding: 30px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
    
    .mood-summary {
        text-align: center;
        margin-bottom: 30px;
        padding: 20px;
        background: #fff8f0;
        border-radius: 8px;
        border-left: 4px solid #FF8C00;
    }
    
    .round-breakdown {
        margin: 30px 0;
    }
    
    .round-breakdown h4 {
        color: #FF8C00;
        margin-bottom: 15px;
    }
    
    .round-selections {
        display: grid;
        gap: 10px;
    }
    
    .round-selection {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        background: #f8f9fa;
        border-radius: 8px;
        border-left: 3px solid #FF8C00;
    }
    
    .selection-mood {
        padding: 4px 12px;
        border-radius: 20px;
        font-weight: bold;
        font-size: 0.9rem;
    }
    
    .modal {
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
        max-width: 900px;
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
        background: #FF8C00;
        color: white;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 0.8rem;
    }
    
    .song-actions {
        padding: 0 15px 15px;
    }
    
    .play-btn {
        background: #FF8C00;
        color: white;
        padding: 8px 16px;
        border-radius: 6px;
        text-decoration: none;
        display: inline-block;
        transition: background 0.2s ease;
    }
    
    .play-btn:hover {
        background: #E67E00;
    }
    
    .selection-feedback {
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 1001;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .selection-feedback.show {
        transform: translateX(0);
    }
    
    .selection-feedback.mood-happy {
        background: #FF8C00;
    }
    
    .selection-feedback.mood-sad {
        background: #17a2b8;
    }
    
    .selection-feedback.mood-angry {
        background: #dc3545;
    }
    
    .selection-feedback.mood-calm {
        background: #6f42c1;
    }
    
    .mood-display {
        font-weight: bold;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.9rem;
    }
    
    .mood-display.mood-happy {
        background: #FF8C00;
        color: white;
    }
    
    .mood-display.mood-sad {
        background: #17a2b8;
        color: white;
    }
    
    .mood-display.mood-angry {
        background: #dc3545;
        color: white;
    }
    
    .mood-display.mood-calm {
        background: #6f42c1;
        color: white;
    }
    
    .selection-mood.mood-happy {
        background: #FF8C00;
        color: white;
    }
    
    .selection-mood.mood-sad {
        background: #17a2b8;
        color: white;
    }
    
    .selection-mood.mood-angry {
        background: #dc3545;
        color: white;
    }
    
    .selection-mood.mood-calm {
        background: #6f42c1;
        color: white;
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
