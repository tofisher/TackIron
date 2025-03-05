/**
 * Tack Iron Website JavaScript
 * Handles interactive elements and functionality
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const header = document.querySelector('header');
    const contactForm = document.getElementById('contactForm');
    const navItems = document.querySelectorAll('.nav-links a');
    
    // Mobile Navigation Toggle
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            // Toggle hamburger animation
            const bars = hamburger.querySelectorAll('.bar');
            if (hamburger.classList.contains('active')) {
                bars[0].style.transform = 'translateY(8px) rotate(45deg)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'translateY(-8px) rotate(-45deg)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });
    }
    
    // Close mobile menu when clicking a nav link
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (hamburger.classList.contains('active')) {
                hamburger.click();
            }
        });
    });
    
    // Header scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.padding = '0.7rem 0';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        } else {
            header.style.padding = '1rem 0';
            header.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        }
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Contact form handling
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Form validation
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            
            if (!name || !email || !message) {
                showFormMessage('Please fill in all required fields', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showFormMessage('Please enter a valid email address', 'error');
                return;
            }
            
            // In a real implementation, you would send the form data to a server
            // For this demo, we'll just show a success message
            showFormMessage('Thank you for your message! We will get back to you soon.', 'success');
            contactForm.reset();
        });
    }
    
    // Helper function to validate email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Helper function to show form messages
    function showFormMessage(message, type) {
        // Remove any existing message
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message element
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        messageElement.textContent = message;
        
        // Insert message after the form
        contactForm.parentNode.insertBefore(messageElement, contactForm.nextSibling);
        
        // Remove message after 5 seconds
        setTimeout(() => {
            messageElement.remove();
        }, 5000);
    }
    
    // Add CSS for form messages
    const style = document.createElement('style');
    style.textContent = `
        .form-message {
            padding: 12px 15px;
            margin-top: 15px;
            border-radius: 4px;
            font-weight: 500;
        }
        .form-message.success {
            background-color: rgba(46, 204, 113, 0.15);
            color: #27ae60;
            border: 1px solid rgba(46, 204, 113, 0.3);
        }
        .form-message.error {
            background-color: rgba(231, 76, 60, 0.15);
            color: #e74c3c;
            border: 1px solid rgba(231, 76, 60, 0.3);
        }
    `;
    document.head.appendChild(style);
    
    // Reveal animations on scroll (optional enhancement)
    const revealElements = document.querySelectorAll('.service-card, .stat-item');
    
    function checkReveal() {
        const triggerBottom = window.innerHeight * 0.8;
        
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < triggerBottom) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Set initial styles for reveal elements
    revealElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Check elements on load
    window.addEventListener('load', checkReveal);
    
    // Check elements on scroll
    window.addEventListener('scroll', checkReveal);
});
