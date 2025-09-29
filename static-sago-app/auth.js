// Authentication Logic
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    if (localStorage.getItem('sagoAppLoggedIn') === 'true') {
        window.location.href = 'dashboard.html';
        return;
    }

    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Mock authentication - In real app, this would be API call
        if (email === 'demo@sago.com' && password === 'demo123') {
            // Set login status
            localStorage.setItem('sagoAppLoggedIn', 'true');
            localStorage.setItem('sagoAppUser', JSON.stringify({
                email: email,
                name: 'Researcher',
                loginTime: new Date().toISOString()
            }));
            
            // Show success animation
            showLoginSuccess();
            
            // Redirect to dashboard after brief delay
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            showLoginError('Invalid credentials. Use demo@sago.com / demo123');
        }
    });
    
    // Demo credentials auto-fill
    const demoCredentials = document.querySelector('.demo-credentials');
    demoCredentials.addEventListener('click', function() {
        document.getElementById('email').value = 'demo@sago.com';
        document.getElementById('password').value = 'demo123';
    });
});

function showLoginSuccess() {
    const loginBtn = document.querySelector('.login-btn');
    const originalText = loginBtn.textContent;
    
    loginBtn.textContent = '✓ Login Successful!';
    loginBtn.style.background = 'linear-gradient(135deg, #27ae60, #229954)';
    loginBtn.disabled = true;
}

function showLoginError(message) {
    // Remove existing error if any
    const existingError = document.querySelector('.login-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'login-error';
    errorDiv.style.cssText = `
        background: #e74c3c;
        color: white;
        padding: 10px;
        border-radius: 6px;
        margin-top: 15px;
        text-align: center;
        font-size: 14px;
        animation: shake 0.5s ease-in-out;
    `;
    errorDiv.textContent = message;
    
    // Add shake animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);
    
    // Insert error message
    const loginForm = document.getElementById('loginForm');
    loginForm.appendChild(errorDiv);
    
    // Remove error after 3 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 3000);
}