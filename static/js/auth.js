// Authentication JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeAuthForms();
    initializePasswordToggle();
    initializeFormValidation();
});

// Initialize authentication forms
function initializeAuthForms() {
    // Bind signup form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignupSubmit);
    }
    
    // Bind signin form
    const signinForm = document.getElementById('signinForm');
    if (signinForm) {
        signinForm.addEventListener('submit', handleSigninSubmit);
    }
    
    // Add input focus animations
    const inputs = document.querySelectorAll('.form-group input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });
}

// Handle signup submit -> POST /register (JSON)
async function handleSignupSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const username = form.querySelector('#username')?.value.trim();
    const email = form.querySelector('#email')?.value.trim();
    const password = form.querySelector('#password')?.value;
    const confirmPassword = form.querySelector('#confirmPassword')?.value;
    const termsAccepted = form.querySelector('#terms')?.checked;
    const submitBtn = form.querySelector('#submitBtn');
    const spinner = form.querySelector('#loadingSpinner');
    const btnText = form.querySelector('.btn-text');

    // Client-side validation
    if (!username || !email || !password || !confirmPassword) {
        showMessage('Please fill in all required fields', 'error');
        return;
    }
    if (password.length < 6) {
        showMessage('Password must be at least 6 characters', 'error');
        return;
    }
    if (password !== confirmPassword) {
        showMessage('Passwords do not match', 'error');
        return;
    }
    if (!termsAccepted) {
        showMessage('Please accept the Terms and Privacy Policy', 'error');
        return;
    }

    // Loading state
    if (spinner) spinner.classList.remove('hidden');
    if (btnText) btnText.textContent = 'Creating...';
    if (submitBtn) submitBtn.disabled = true;

    try {
        const res = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        const data = await res.json().catch(() => ({ success: false, message: 'Invalid server response' }));

        if (data.success) {
            showMessage('Registration successful! Redirecting to sign in...', 'success');
            setTimeout(() => { window.location.href = '/signin'; }, 800);
        } else {
            showMessage(data.message || 'Registration failed. Please try again.', 'error');
        }
    } catch (err) {
        console.error('Signup error:', err);
        showMessage('Network error. Please try again.', 'error');
    } finally {
        if (spinner) spinner.classList.add('hidden');
        if (btnText) btnText.textContent = 'Create Account';
        if (submitBtn) submitBtn.disabled = false;
    }
}

// Handle signin submit -> POST /login (JSON)
async function handleSigninSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const email = form.querySelector('#email')?.value.trim();
    const password = form.querySelector('#password')?.value;
    const submitBtn = form.querySelector('#submitBtn');
    const spinner = form.querySelector('#loadingSpinner');
    const btnText = form.querySelector('.btn-text');

    if (!email || !password) {
        showMessage('Email and password are required', 'error');
        return;
    }

    if (spinner) spinner.classList.remove('hidden');
    if (btnText) btnText.textContent = 'Signing in...';
    if (submitBtn) submitBtn.disabled = true;

    try {
        const res = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json().catch(() => ({ success: false, message: 'Invalid server response' }));

        if (data.success) {
            window.location.href = '/dashboard';
        } else {
            showMessage(data.message || 'Invalid email or password', 'error');
        }
    } catch (err) {
        console.error('Signin error:', err);
        showMessage('Network error. Please try again.', 'error');
    } finally {
        if (spinner) spinner.classList.add('hidden');
        if (btnText) btnText.textContent = 'Sign In';
        if (submitBtn) submitBtn.disabled = false;
    }
}

// Initialize password toggle functionality
function initializePasswordToggle() {
    const passwordToggles = document.querySelectorAll('.password-toggle');
    
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            // If there is an icon inside the button, toggle classes if needed
            const icon = this.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-eye');
                icon.classList.toggle('fa-eye-slash');
            }
        });
    });
}

// Form validation
function initializeFormValidation() {
    const forms = document.querySelectorAll('form.auth-form, .auth-form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', validateInput);
            input.addEventListener('input', clearValidationError);
        });
    });
}

function validateInput(e) {
    const input = e.target;
    const value = input.value.trim();
    const type = input.type;
    const name = input.name;
    
    clearValidationError(e);
    
    // Required field validation
    if (!value) {
        showInputError(input, `${getFieldLabel(name)} is required`);
        return false;
    }
    
    // Email validation
    if (type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showInputError(input, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Password validation (only on signup where confirmPassword exists)
    if (name === 'password' && input.form && input.form.querySelector('input[name="confirmPassword"]')) {
        if (value.length < 6) {
            showInputError(input, 'Password must be at least 6 characters long');
            return false;
        }
    }
    
    // Confirm password validation
    if (name === 'confirmPassword') {
        const password = input.form.querySelector('input[name="password"]').value;
        if (value !== password) {
            showInputError(input, 'Passwords do not match');
            return false;
        }
    }
    
    // Username validation
    if (name === 'username') {
        const usernameRegex = /^[a-zA-Z0-9_\s]{3,30}$/;
        if (!usernameRegex.test(value)) {
            showInputError(input, 'Username must be 3-30 characters');
            return false;
        }
    }
    
    return true;
}

function showInputError(input, message) {
    const formGroup = input.closest('.form-group');
    if (!formGroup) return;
    
    // Find or create error element
    let errorElement = formGroup.querySelector('.input-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'input-error';
        formGroup.appendChild(errorElement);
    }
    
    // Add error class to input
    input.classList.add('error');
    
    // Update error message
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function clearValidationError(e) {
    const input = e.target;
    const formGroup = input.closest('.form-group');
    if (!formGroup) return;
    
    const errorElement = formGroup.querySelector('.input-error');
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
    
    input.classList.remove('error');
}

function getFieldLabel(name) {
    const labels = {
        'username': 'Username',
        'email': 'Email',
        'password': 'Password',
        'confirmPassword': 'Confirm Password',
        'full_name': 'Full Name'
    };
    return labels[name] || name;
}

// Show success/error messages
function showMessage(message, type = 'error') {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}-message`;
    messageElement.textContent = message;
    
    // Insert message (prefer current visible auth form)
    const form = document.querySelector('form#signupForm, form#signinForm, .auth-form');
    if (form) {
        form.insertBefore(messageElement, form.firstChild);
    }
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.remove();
        }
    }, 5000);
}

// Password strength indicator (for signup page)
function initializePasswordStrength() {
    const passwordInput = document.querySelector('form#signupForm input[name="password"]');
    
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const strength = calculatePasswordStrength(this.value);
            showPasswordStrength(this, strength);
        });
    }
}

function calculatePasswordStrength(password) {
    let score = 0;
    
    // Length
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    
    // Character types
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    return Math.min(score, 4);
}

function showPasswordStrength(input, strength) {
    const formGroup = input.parentElement;
    let strengthIndicator = formGroup.querySelector('.password-strength');
    
    if (!strengthIndicator) {
        strengthIndicator = document.createElement('div');
        strengthIndicator.className = 'password-strength';
        strengthIndicator.style.cssText = `
            display: flex;
            gap: 3px;
            margin-top: 5px;
        `;
        formGroup.appendChild(strengthIndicator);
    }
    
    const colors = ['#dc3545', '#fd7e14', '#ffc107', '#28a745'];
    const labels = ['Weak', 'Fair', 'Good', 'Strong'];
    
    strengthIndicator.innerHTML = '';
    
    for (let i = 0; i < 4; i++) {
        const bar = document.createElement('div');
        bar.style.cssText = `
            height: 4px;
            flex: 1;
            border-radius: 2px;
            background-color: ${i < strength ? colors[strength - 1] : '#e9ecef'};
            transition: all 0.3s ease;
        `;
        strengthIndicator.appendChild(bar);
    }
    
    let existingLabel = formGroup.querySelector('.password-strength-label');
    if (!existingLabel) {
        existingLabel = document.createElement('div');
        existingLabel.className = 'password-strength-label';
        formGroup.appendChild(existingLabel);
    }
    existingLabel.textContent = strength > 0 ? labels[strength - 1] : '';
    existingLabel.style.color = strength > 0 ? colors[strength - 1] : '#666';
}

// Initialize password strength on signup page
if (window.location.pathname.includes('signup')) {
    document.addEventListener('DOMContentLoaded', initializePasswordStrength);
}

// Forgot password functionality
function initializeForgotPassword() {
    const forgotForm = document.querySelector('#forgot-password-form');
    
    if (forgotForm) {
        forgotForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[name="email"]').value;
            const submitBtn = this.querySelector('#submitBtn');
            
            if (submitBtn) {
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
            }
            
            try {
                const response = await fetch('/reset_password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });
                
                const data = await response.json().catch(() => ({ success: false }));
                
                if (data.success) {
                    showMessage('Password reset instructions sent to your email!', 'success');
                    this.reset();
                } else {
                    showMessage(data.message || 'Failed to send reset email.', 'error');
                }
            } catch (error) {
                console.error('Forgot password error:', error);
                showMessage('Network error. Please try again.', 'error');
            } finally {
                if (submitBtn) {
                    submitBtn.textContent = 'Send Reset Link';
                    submitBtn.disabled = false;
                }
            }
        });
    }
}

// Initialize forgot password on the appropriate page
if (window.location.pathname.includes('forgot')) {
    document.addEventListener('DOMContentLoaded', initializeForgotPassword);
}