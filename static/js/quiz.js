// Quiz JavaScript for SWARA
class QuizGame {
    constructor() {
        this.currentQuestion = 0;
        this.totalQuestions = 5;
        this.answers = {};
        this.mood = null;
        this.confidence = 0;
        
        this.questions = document.querySelectorAll('.question');
        this.options = document.querySelectorAll('.option');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.progressFill = document.getElementById('progressFill');
        this.currentQuestionSpan = document.getElementById('currentQuestion');
        this.totalQuestionsSpan = document.getElementById('totalQuestions');
        this.resultsSection = document.getElementById('resultsSection');
        this.detectedMood = document.getElementById('detectedMood');
        this.confidenceLevel = document.getElementById('confidenceLevel');
        this.getRecommendationsBtn = document.getElementById('getRecommendations');
        this.retakeQuizBtn = document.getElementById('retakeQuiz');
        this.loading = document.getElementById('loading');
        
        this.initializeQuiz();
    }
    
    initializeQuiz() {
        this.totalQuestionsSpan.textContent = this.totalQuestions;
        this.updateProgress();
        this.setupEventListeners();
        this.showQuestion(0);
    }
    
    setupEventListeners() {
        // Option selection
        this.options.forEach(option => {
            option.addEventListener('click', (e) => this.selectOption(e));
        });
        
        // Navigation buttons
        this.prevBtn.addEventListener('click', () => this.previousQuestion());
        this.nextBtn.addEventListener('click', () => this.nextQuestion());
        
        // Action buttons
        this.getRecommendationsBtn.addEventListener('click', () => this.getRecommendations());
        this.retakeQuizBtn.addEventListener('click', () => this.retakeQuiz());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }
    
    selectOption(event) {
        const option = event.currentTarget;
        const questionId = option.closest('.question').id;
        const mood = option.dataset.mood;
        
        // Remove selection from other options in this question
        option.closest('.question').querySelectorAll('.option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // Select this option
        option.classList.add('selected');
        
        // Store answer
        this.answers[questionId] = mood;
        
        // Enable next button if we have an answer
        this.nextBtn.disabled = false;
        
        // Auto-advance after a short delay
        setTimeout(() => {
            if (this.currentQuestion < this.totalQuestions - 1) {
                this.nextQuestion();
            } else {
                this.showResults();
            }
        }, 800);
    }
    
    showQuestion(questionIndex) {
        // Hide all questions
        this.questions.forEach(q => q.classList.remove('active'));
        
        // Show current question
        if (this.questions[questionIndex]) {
            this.questions[questionIndex].classList.add('active');
        }
        
        // Update navigation buttons
        this.prevBtn.disabled = questionIndex === 0;
        this.nextBtn.disabled = !this.answers[`question${questionIndex + 1}`];
        
        // Update progress
        this.currentQuestion = questionIndex;
        this.currentQuestionSpan.textContent = questionIndex + 1;
        this.updateProgress();
    }
    
    previousQuestion() {
        if (this.currentQuestion > 0) {
            this.showQuestion(this.currentQuestion - 1);
        }
    }
    
    nextQuestion() {
        if (this.currentQuestion < this.totalQuestions - 1) {
            this.showQuestion(this.currentQuestion + 1);
        } else {
            this.showResults();
        }
    }
    
    updateProgress() {
        const progress = ((this.currentQuestion + 1) / this.totalQuestions) * 100;
        this.progressFill.style.width = `${progress}%`;
    }
    
    showResults() {
        // Hide quiz questions
        document.getElementById('quizQuestions').classList.add('hidden');
        document.querySelector('.quiz-navigation').classList.add('hidden');
        
        // Calculate mood and confidence
        this.calculateMood();
        
        // Show results
        this.resultsSection.classList.remove('hidden');
        
        // Update result display
        this.detectedMood.textContent = this.mood;
        this.confidenceLevel.textContent = `${this.confidence}%`;
        
        // Add mood-specific styling
        this.detectedMood.className = `mood-value ${this.mood.toLowerCase()}`;
    }
    
    calculateMood() {
        const moodCounts = {};
        let totalAnswers = 0;
        
        // Count mood occurrences
        Object.values(this.answers).forEach(mood => {
            if (mood) {
                moodCounts[mood] = (moodCounts[mood] || 0) + 1;
                totalAnswers++;
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
        
        this.mood = dominantMood;
        this.confidence = Math.round((maxCount / totalAnswers) * 100);
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
                    module_type: 'quiz',
                    confidence: this.confidence
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Redirect to results page or show results
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
        // Create a modal or redirect to show recommendations
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
                        <p>Confidence: ${this.confidence}%</p>
                    </div>
                    <div class="songs-list">
                        ${data.songs.map(song => `
                            <div class="song-item">
                                <img src="${song.cover_url}" alt="${song.title}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'60\' height=\'60\'%3E%3Crect width=\'60\' height=\'60\' fill=\'%23ddd\'/%3E%3Ctext x=\'30\' y=\'35\' text-anchor=\'middle\' fill=\'%23666\'%3E🎵%3C/text%3E%3C/svg%3E'">
                                <div class="song-info">
                                    <h4>${song.title}</h4>
                                    <p>${song.artist}</p>
                                </div>
                                <a href="${song.youtube_link}" target="_blank" class="play-btn">
                                    <i class="fas fa-play"></i>
                                </a>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
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
    
    retakeQuiz() {
        // Reset quiz state
        this.currentQuestion = 0;
        this.answers = {};
        this.mood = null;
        this.confidence = 0;
        
        // Clear selections
        this.options.forEach(option => option.classList.remove('selected'));
        
        // Show first question
        this.showQuestion(0);
        
        // Hide results, show quiz
        this.resultsSection.classList.add('hidden');
        document.getElementById('quizQuestions').classList.remove('hidden');
        document.querySelector('.quiz-navigation').classList.remove('hidden');
        
        // Reset buttons
        this.nextBtn.disabled = true;
        this.prevBtn.disabled = true;
    }
    
    handleKeyboard(event) {
        switch(event.key) {
            case 'ArrowLeft':
                if (!this.prevBtn.disabled) {
                    event.preventDefault();
                    this.previousQuestion();
                }
                break;
            case 'ArrowRight':
            case ' ':
                if (!this.nextBtn.disabled) {
                    event.preventDefault();
                    this.nextQuestion();
                }
                break;
            case '1':
            case '2':
            case '3':
            case '4':
                event.preventDefault();
                const currentQuestion = this.questions[this.currentQuestion];
                const options = currentQuestion.querySelectorAll('.option');
                const optionIndex = parseInt(event.key) - 1;
                if (options[optionIndex]) {
                    options[optionIndex].click();
                }
                break;
        }
    }
}

// Initialize quiz when page loads
document.addEventListener('DOMContentLoaded', function() {
    new QuizGame();
});

// Add CSS for modal
const style = document.createElement('style');
style.textContent = `
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
        max-width: 600px;
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
    
    .songs-list {
        margin-top: 20px;
    }
    
    .song-item {
        display: flex;
        align-items: center;
        padding: 10px;
        border: 1px solid #eee;
        border-radius: 8px;
        margin-bottom: 10px;
    }
    
    .song-item img {
        width: 60px;
        height: 60px;
        border-radius: 8px;
        margin-right: 15px;
    }
    
    .song-info {
        flex: 1;
    }
    
    .play-btn {
        background: #007bff;
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        text-decoration: none;
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
