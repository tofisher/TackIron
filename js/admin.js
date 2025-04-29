/**
 * Admin functionality for Tack Iron website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu toggle
    initMobileMenu();
    
    // Initialize login functionality if on login page
    if (document.querySelector('#login-form')) {
        initLoginForm();
    }
    
    // Initialize logout functionality if logout button exists
    const logoutBtn = document.querySelector('#logout-btn');
    if (logoutBtn) {
        initLogout(logoutBtn);
    }
    
    // Check authentication for protected pages
    if (document.querySelector('.admin-dashboard')) {
        checkAuthentication();
    }
    
    // Initialize tabs if they exist
    const tabBtns = document.querySelectorAll('.tab-btn');
    if (tabBtns.length > 0) {
        initTabs(tabBtns);
    }
    
    // Initialize date range filter if it exists
    const dateRangeSelect = document.querySelector('#date-range');
    if (dateRangeSelect) {
        initDateRangeFilter(dateRangeSelect);
    }
});

/**
 * Initialize mobile menu toggle
 */
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
}

/**
 * Initialize login form functionality
 */
function initLoginForm() {
    const loginForm = document.querySelector('#login-form');
    const loginError = document.querySelector('#login-error');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.querySelector('#username').value;
        const password = document.querySelector('#password').value;
        const remember = document.querySelector('#remember').checked;
        
        // Simple authentication - in a real application, this would be a server request
        if (authenticate(username, password)) {
            // Store authentication in session storage or local storage based on remember me
            if (remember) {
                localStorage.setItem('tackiron_auth', JSON.stringify({
                    username: username,
                    authenticated: true,
                    timestamp: new Date().getTime()
                }));
            } else {
                sessionStorage.setItem('tackiron_auth', JSON.stringify({
                    username: username,
                    authenticated: true,
                    timestamp: new Date().getTime()
                }));
            }
            
            // Redirect to admin dashboard
            window.location.href = 'user-stats.html';
        } else {
            // Show error message
            loginError.style.display = 'flex';
            
            // Clear password field
            document.querySelector('#password').value = '';
        }
    });
}

/**
 * Authenticate user credentials
 * In a real application, this would be a server request
 * @param {string} username - The username to authenticate
 * @param {string} password - The password to authenticate
 * @returns {boolean} - Whether authentication was successful
 */
function authenticate(username, password) {
    // For demo purposes, hardcoded credentials
    // In a real application, this would be a server request
    const validCredentials = {
        'admin': 'admin123',
        'tackiron': 'password123'
    };
    
    return validCredentials[username] === password;
}

/**
 * Initialize logout functionality
 * @param {HTMLElement} logoutBtn - The logout button element
 */
function initLogout(logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Clear authentication
        localStorage.removeItem('tackiron_auth');
        sessionStorage.removeItem('tackiron_auth');
        
        // Redirect to login page
        window.location.href = 'login.html';
    });
}

/**
 * Check if user is authenticated for protected pages
 * If not, redirect to login page
 */
function checkAuthentication() {
    const sessionAuth = sessionStorage.getItem('tackiron_auth');
    const localAuth = localStorage.getItem('tackiron_auth');
    
    let isAuthenticated = false;
    
    if (sessionAuth) {
        const authData = JSON.parse(sessionAuth);
        isAuthenticated = authData.authenticated;
    } else if (localAuth) {
        const authData = JSON.parse(localAuth);
        isAuthenticated = authData.authenticated;
        
        // Check if authentication has expired (24 hours)
        const now = new Date().getTime();
        const authTime = authData.timestamp;
        const authAge = now - authTime;
        const authExpiry = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        
        if (authAge > authExpiry) {
            isAuthenticated = false;
            localStorage.removeItem('tackiron_auth');
        }
    }
    
    if (!isAuthenticated) {
        window.location.href = 'login.html';
    }
}

/**
 * Initialize tabs functionality
 * @param {NodeList} tabBtns - The tab buttons
 */
function initTabs(tabBtns) {
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all tabs
            tabBtns.forEach(tab => tab.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Hide all tab content
            const tabContents = document.querySelectorAll('.tab-content');
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Show selected tab content
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

/**
 * Initialize date range filter
 * @param {HTMLElement} dateRangeSelect - The date range select element
 */
function initDateRangeFilter(dateRangeSelect) {
    const customDateRange = document.querySelector('#custom-date-range');
    
    dateRangeSelect.addEventListener('change', function() {
        if (this.value === 'custom') {
            customDateRange.style.display = 'flex';
        } else {
            customDateRange.style.display = 'none';
            
            // In a real application, this would trigger a data refresh
            // For demo purposes, we'll just log the selected date range
            console.log('Date range changed to:', this.value);
            
            // Simulate data refresh
            if (typeof refreshDashboardData === 'function') {
                refreshDashboardData(this.value);
            }
        }
    });
    
    // Initialize apply button for custom date range
    const applyDateRangeBtn = document.querySelector('#apply-date-range');
    if (applyDateRangeBtn) {
        applyDateRangeBtn.addEventListener('click', function() {
            const startDate = document.querySelector('#start-date').value;
            const endDate = document.querySelector('#end-date').value;
            
            if (startDate && endDate) {
                // In a real application, this would trigger a data refresh
                // For demo purposes, we'll just log the selected date range
                console.log('Custom date range applied:', startDate, 'to', endDate);
                
                // Simulate data refresh
                if (typeof refreshDashboardData === 'function') {
                    refreshDashboardData('custom', startDate, endDate);
                }
            }
        });
    }
}
