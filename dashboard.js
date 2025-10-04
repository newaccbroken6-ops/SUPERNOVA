// Dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const userData = localStorage.getItem('keyauth_user');
    
    if (!userData) {
        // Redirect to login if no user data
        window.location.href = 'index.html';
        return;
    }
    
    const user = JSON.parse(userData);
    console.log('User data:', user); // For debugging
    
    // Display user information
    const username = user.username || 'User';
    document.getElementById('usernameDisplay').textContent = username;
    document.getElementById('welcomeUsername').textContent = username;
    
    // Display last access information
    let lastAccessText = 'First login';
    if (user.lastLogin) {
        const lastAccessDate = new Date(user.lastLogin * 1000);
        if (!isNaN(lastAccessDate.getTime())) {
            lastAccessText = lastAccessDate.toLocaleString();
        }
    } else if (user.createdate) {
        const createdDate = new Date(user.createdate * 1000);
        if (!isNaN(createdDate.getTime())) {
            lastAccessText = createdDate.toLocaleString();
        }
    }
    document.getElementById('lastAccess').textContent = lastAccessText;
    
    // Display registration date
    let regDateText = 'Not available';
    // Try multiple possible fields for registration date
    const possibleDateFields = ['createdate', 'registrationDate', 'regdate', 'created_at'];
    for (const field of possibleDateFields) {
        if (user[field]) {
            const regDate = new Date(user[field] * 1000);
            if (!isNaN(regDate.getTime())) {
                regDateText = regDate.toLocaleString();
                break;
            }
        }
    }
    
    // If still not available, show a more user-friendly message
    if (regDateText === 'Not available') {
        regDateText = 'Account created recently';
    }
    
    document.getElementById('registrationDate').textContent = regDateText;
    
    // Display license status
    const licenseStatus = user.role || user.subscription || user.license || user.status || 'Active';
    document.getElementById('licenseStatus').textContent = licenseStatus;
    
    // Display account type
    const accountType = user.role || user.accountType || user.type || 'Standard';
    document.getElementById('accountType').textContent = accountType;
    
    // Admin login functionality
    const adminLoginBtn = document.getElementById('adminLoginBtn');
    const adminLoginForm = document.getElementById('adminLoginForm');
    const cancelAdminAccess = document.getElementById('cancelAdminAccess');
    const confirmAdminAccess = document.getElementById('confirmAdminAccess');
    
    // Show admin access button for all users
    adminLoginBtn.style.display = 'flex';
    
    adminLoginBtn.addEventListener('click', function() {
        adminLoginForm.style.display = 'block';
    });
    
    cancelAdminAccess.addEventListener('click', function() {
        adminLoginForm.style.display = 'none';
        document.getElementById('adminPassword').value = '';
    });
    
    confirmAdminAccess.addEventListener('click', function() {
        const adminPassword = document.getElementById('adminPassword').value;
        // In a real application, you would validate this against a secure backend
        // For demo purposes, we'll use a simple check
        if (adminPassword === 'admin123') {
            // Redirect to admin dashboard
            window.location.href = 'admin.html';
        } else {
            alert('Invalid admin password!');
        }
    });
    
    // Allow Enter key to submit admin password
    document.getElementById('adminPassword').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            confirmAdminAccess.click();
        }
    });
    
    // Close admin form when clicking outside
    document.addEventListener('click', function(event) {
        if (!adminLoginBtn.contains(event.target) && 
            !adminLoginForm.contains(event.target) && 
            adminLoginForm.style.display === 'block') {
            adminLoginForm.style.display = 'none';
            document.getElementById('adminPassword').value = '';
        }
    });
    
    // Load recent activities
    loadRecentActivities();
});

function loadRecentActivities() {
    const activityList = document.getElementById('activityList');
    
    // Sample activities (in a real app, this would come from the server)
    const activities = [
        {
            id: 1,
            action: 'Login',
            description: 'Successful login to the application',
            time: new Date(Date.now() - 1000 * 60 * 5).toLocaleString(), // 5 minutes ago
            ip: '192.168.1.100'
        },
        {
            id: 2,
            action: 'Profile Update',
            description: 'Updated profile information',
            time: new Date(Date.now() - 1000 * 60 * 60 * 2).toLocaleString(), // 2 hours ago
            ip: '192.168.1.100'
        },
        {
            id: 3,
            action: 'License Check',
            description: 'License validation successful',
            time: new Date(Date.now() - 1000 * 60 * 60 * 24).toLocaleString(), // 1 day ago
            ip: '192.168.1.100'
        }
    ];
    
    // Clear existing activities
    activityList.innerHTML = '';
    
    // Add activities to the list
    activities.forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        activityItem.innerHTML = `
            <div class="activity-icon">
                <i class="fas fa-${getActivityIcon(activity.action)}"></i>
            </div>
            <div class="activity-details">
                <h4>${activity.action}</h4>
                <p>${activity.description}</p>
                <div class="activity-meta">
                    <span><i class="fas fa-clock"></i> ${activity.time}</span>
                    <span><i class="fas fa-network-wired"></i> ${activity.ip}</span>
                </div>
            </div>
        `;
        activityList.appendChild(activityItem);
    });
}

function getActivityIcon(action) {
    switch(action.toLowerCase()) {
        case 'login':
            return 'sign-in-alt';
        case 'profile update':
            return 'user-edit';
        case 'license check':
            return 'key';
        default:
            return 'info-circle';
    }
}