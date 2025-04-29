/**
 * Main JavaScript functionality for Tack Iron website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu toggle
    initMobileMenu();
    
    // Initialize smooth scrolling for anchor links
    initSmoothScroll();
    
    // Initialize contact form validation
    initContactForm();
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
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Close mobile menu if open
                const navLinks = document.querySelector('.nav-links');
                const hamburger = document.querySelector('.hamburger');
                
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    hamburger.classList.remove('active');
                }
                
                // Scroll to target
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for header height
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Initialize contact form validation and submission
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form fields
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const company = document.getElementById('company').value.trim();
            const message = document.getElementById('message').value.trim();
            
            // Validate form
            if (!name) {
                showFormError('Please enter your name');
                return;
            }
            
            if (!email || !isValidEmail(email)) {
                showFormError('Please enter a valid email address');
                return;
            }
            
            if (!message) {
                showFormError('Please enter a message');
                return;
            }
            
            // In a real application, this would submit the form data to a server
            // For demo purposes, we'll just show a success message
            showFormSuccess();
            
            // Reset form
            contactForm.reset();
        });
    }
}

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} - Whether the email is valid
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Show form error message
 * @param {string} message - Error message to display
 */
function showFormError(message) {
    // Check if error element already exists
    let errorElement = document.querySelector('.form-error');
    
    if (!errorElement) {
        // Create error element
        errorElement = document.createElement('div');
        errorElement.className = 'form-error';
        
        // Insert after form
        const contactForm = document.getElementById('contactForm');
        contactForm.parentNode.insertBefore(errorElement, contactForm.nextSibling);
    }
    
    // Set error message
    errorElement.textContent = message;
    
    // Remove error after 5 seconds
    setTimeout(() => {
        errorElement.remove();
    }, 5000);
}

/**
 * Show form success message
 */
function showFormSuccess() {
    // Check if success element already exists
    let successElement = document.querySelector('.form-success');
    
    if (!successElement) {
        // Create success element
        successElement = document.createElement('div');
        successElement.className = 'form-success';
        
        // Insert after form
        const contactForm = document.getElementById('contactForm');
        contactForm.parentNode.insertBefore(successElement, contactForm.nextSibling);
    }
    
    // Set success message
    successElement.textContent = 'Thank you for your message! We will get back to you soon.';
    
    // Remove success message after 5 seconds
    setTimeout(() => {
        successElement.remove();
    }, 5000);
}
