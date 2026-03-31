// Dashboard JavaScript for SWARA
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard functionality
    initializeDashboard();
});

function initializeDashboard() {
    // Add hover effects to method cards
    const methodCards = document.querySelectorAll('.method-card');
    methodCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.querySelector('.card-glow').style.opacity = '1';
        });
        
        card.addEventListener('mouseleave', function() {
            this.querySelector('.card-glow').style.opacity = '0';
        });
    });

    // Initialize user menu functionality
    initializeUserMenu();
    
    // Add floating animation to music notes
    animateMusicNotes();
}

function selectMethod(method) {
    // Show loading state
    const selectedCard = document.querySelector(`.${method}-card`);
    const button = selectedCard.querySelector('.method-btn');
    const originalText = button.innerHTML;
    
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    button.disabled = true;
    
    // Simulate loading delay
    setTimeout(() => {
        // Redirect to the appropriate method page
        switch(method) {
            case 'quiz':
                window.location.href = '/quiz';
                break;
            case 'images':
                window.location.href = '/images';
                break;
            case 'puzzle':
                window.location.href = '/puzzle';
                break;
            default:
                console.error('Unknown method:', method);
                button.innerHTML = originalText;
                button.disabled = false;
        }
    }, 1000);
}

function initializeUserMenu() {
    const userBtn = document.querySelector('.user-btn');
    const userDropdown = document.getElementById('userDropdown');
    
    if (userBtn && userDropdown) {
        userBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            userDropdown.classList.toggle('hidden');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            userDropdown.classList.add('hidden');
        });
        
        // Prevent dropdown from closing when clicking inside it
        userDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
}

function toggleUserMenu() {
    const userDropdown = document.getElementById('userDropdown');
    if (userDropdown) {
        userDropdown.classList.toggle('hidden');
    }
}

function animateMusicNotes() {
    const musicNotes = document.querySelectorAll('.music-note');
    
    musicNotes.forEach((note, index) => {
        // Add staggered animation delay
        note.style.animationDelay = `${index * 0.5}s`;
        
        // Add random movement
        setInterval(() => {
            const randomX = Math.random() * 20 - 10;
            const randomY = Math.random() * 20 - 10;
            note.style.transform = `translate(${randomX}px, ${randomY}px)`;
        }, 3000 + index * 1000);
    });
}

// Add smooth scrolling for better UX
function smoothScrollTo(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Handle method card interactions
document.addEventListener('DOMContentLoaded', function() {
    const methodCards = document.querySelectorAll('.method-card');
    
    methodCards.forEach(card => {
        // Add click sound effect (optional)
        card.addEventListener('click', function() {
            // You can add a subtle sound effect here
            console.log('Method selected:', this.classList.contains('quiz-card') ? 'quiz' : 
                       this.classList.contains('images-card') ? 'images' : 'puzzle');
        });
        
        // Add keyboard navigation
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        // Make cards focusable
        card.setAttribute('tabindex', '0');
    });
});

// Add loading states for better UX
function showLoading(element) {
    element.classList.add('loading');
}

function hideLoading(element) {
    element.classList.remove('loading');
}

// Handle logout confirmation
function confirmLogout() {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = '/logout';
    }
}

// Add analytics tracking (optional)
function trackMethodSelection(method) {
    // You can integrate with Google Analytics or other tracking services here
    console.log('User selected method:', method);
    
    // Example: Send to your analytics endpoint
    fetch('/api/analytics/method-selection', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            method: method,
            timestamp: new Date().toISOString()
        })
    }).catch(error => {
        console.error('Analytics error:', error);
    });
}
