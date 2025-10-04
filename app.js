// Initialize KeyAuth with your provided credentials
const KeyAuthApp = new KeyAuth({
    name: "Newaccbroken6's Application", // App name 
    ownerid: "WiHSkheI6x", // Account ID
    version: "1.0" // Application version
});

// DOM Elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const toggleRegister = document.getElementById('toggleRegister');
const toggleLogin = document.getElementById('toggleLogin');
const statusMessage = document.getElementById('statusMessage');
const licenseGroup = document.querySelector('.license-group');

// Toggle between login and register forms
toggleRegister.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
});

toggleLogin.addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.style.display = 'none';
    loginForm.style.display = 'block';
    licenseGroup.style.display = 'none';
});

// Handle login form submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Show loading state
    showStatus('Authenticating...', 'success');
    const loginButton = document.querySelector('.btn-login');
    const originalText = loginButton.innerHTML;
    loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating...';
    loginButton.disabled = true;
    
    try {
        const result = await KeyAuthApp.login(username, password);
        
        if (result.success) {
            // Save user data to localStorage with additional fields
            const userData = {
                username: username,
                lastLogin: Math.floor(Date.now() / 1000), // Current timestamp
                ...result.data
            };
            
            // Check if user is admin (demo: username 'admin' or role 'admin')
            if (username === 'admin' || result.data.role === 'admin') {
                userData.role = 'admin';
            }
            
            console.log('Saving user data:', userData); // For debugging
            localStorage.setItem('keyauth_user', JSON.stringify(userData));
            
            // Play welcome sound
            playWelcomeSound();
            
            showStatus('Login successful! Redirecting...', 'success');
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            showStatus(result.message, 'error');
        }
    } catch (error) {
        console.error('Login error:', error); // For debugging
        showStatus('An error occurred. Please try again.', 'error');
    } finally {
        // Reset button state
        loginButton.innerHTML = originalText;
        loginButton.disabled = false;
    }
});

// Handle register form submission
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;
    const license = document.getElementById('regLicense').value;
    
    // Show loading state
    showStatus('Registering...', 'success');
    const registerButton = registerForm.querySelector('.btn-login');
    const originalText = registerButton.innerHTML;
    registerButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registering...';
    registerButton.disabled = true;
    
    try {
        const result = await KeyAuthApp.register(username, password, license);
        
        if (result.success) {
            // Save user data to localStorage with additional fields
            const userData = {
                username: username,
                registrationDate: Math.floor(Date.now() / 1000), // Current timestamp
                ...result.data
            };
            
            // Check if user is admin (demo: username 'admin')
            if (username === 'admin') {
                userData.role = 'admin';
            }
            
            console.log('Saving user data:', userData); // For debugging
            localStorage.setItem('keyauth_user', JSON.stringify(userData));
            
            // Play welcome sound
            playWelcomeSound();
            
            showStatus('Registration successful! Redirecting...', 'success');
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            showStatus(result.message, 'error');
        }
    } catch (error) {
        console.error('Registration error:', error); // For debugging
        showStatus('An error occurred. Please try again.', 'error');
    } finally {
        // Reset button state
        registerButton.innerHTML = originalText;
        registerButton.disabled = false;
    }
});

// Function to play welcome sound
function playWelcomeSound() {
    try {
        const audio = new Audio('WELCOMEINSUPERNOVA.MP3.mp3');
        audio.play().catch(e => {
            console.log('Sound playback failed:', e);
        });
    } catch (e) {
        console.log('Sound playback failed:', e);
    }
}

// Function to display status messages
function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = 'status-message ' + type;
}

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    showStatus('Initializing application...', 'success');
    
    try {
        const result = await KeyAuthApp.initialize();
        console.log('Initialization result:', result); // For debugging
        
        if (result.success) {
            showStatus('Application ready. Please login or register.', 'success');
        } else {
            showStatus('Failed to initialize application: ' + result.message, 'error');
        }
    } catch (error) {
        console.error('Initialization error:', error); // For debugging
        showStatus('Failed to connect to authentication server.', 'error');
    }
});