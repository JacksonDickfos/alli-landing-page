// Initialize Supabase client
const supabase = window.supabase.createClient(
    window.SUPABASE_CONFIG.url, 
    window.SUPABASE_CONFIG.anonKey
);

// Smooth scrolling for navigation links
function scrollToWaitlist() {
    document.getElementById('waitlist').scrollIntoView({
        behavior: 'smooth'
    });
}

function scrollToAppPreview() {
    document.getElementById('app-preview').scrollIntoView({
        behavior: 'smooth'
    });
}

function scrollToFeatures() {
    document.getElementById('features').scrollIntoView({
        behavior: 'smooth'
    });
}

// Waitlist form handling
document.addEventListener('DOMContentLoaded', function() {
    const waitlistForm = document.getElementById('waitlist-form');
    const heroEmailInput = document.getElementById('hero-email');
    const heroSubmitBtn = document.querySelector('.hero-submit-btn');
    
    // Hero form submission
    if (heroSubmitBtn && heroEmailInput) {
        heroSubmitBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            
            const email = heroEmailInput.value.trim();
            
            // Validate email
            if (!email) {
                showNotification('Please enter your email address.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Save to Supabase
            try {
                const { data, error } = await supabase
                    .from('waitlist')
                    .insert([
                        { 
                            email: email,
                            source: 'hero_section'
                        }
                    ]);

                if (error) {
                    if (error.code === '23505') { // Unique constraint violation
                        showNotification('This email is already on our waitlist!', 'info');
                    } else {
                        console.error('Supabase error:', error);
                        showNotification('There was an error. Please try again.', 'error');
                    }
                } else {
                    showNotification('Thank you! You\'ve been added to our waitlist.', 'success');
                    heroEmailInput.value = '';
                }
            } catch (err) {
                console.error('Error saving to database:', err);
                showNotification('There was an error. Please try again.', 'error');
            }
        });
    }
    
    // Waitlist form submission
    if (waitlistForm) {
        waitlistForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(waitlistForm);
            const email = formData.get('email');
            
            // Validate form
            if (!email) {
                showNotification('Please enter your email address.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Save to Supabase
            try {
                const { data, error } = await supabase
                    .from('waitlist')
                    .insert([
                        { 
                            email: email,
                            source: 'waitlist_section'
                        }
                    ]);

                if (error) {
                    if (error.code === '23505') { // Unique constraint violation
                        showNotification('This email is already on our waitlist!', 'info');
                    } else {
                        console.error('Supabase error:', error);
                        showNotification('There was an error. Please try again.', 'error');
                    }
                } else {
                    showNotification('Thank you! You\'ve been added to our waitlist.', 'success');
                    waitlistForm.reset();
                }
            } catch (err) {
                console.error('Error saving to database:', err);
                showNotification('There was an error. Please try again.', 'error');
            }
        });
    }
    
    // Add smooth scrolling to all navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add scroll effect to navbar
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(247, 244, 237, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(12, 34, 64, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
    
    // Add animation to feature cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe feature cards, steps, and app screens
    const animatedElements = document.querySelectorAll('.feature-card, .step, .screen-container');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Initialize chat demo
    initializeChatDemo();
});

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    const bgColor = type === 'success' ? '#78C6A3' : type === 'error' ? '#FF6B6B' : '#BDD7EF';
    const textColor = type === 'success' || type === 'error' ? '#F7F4ED' : '#0C2240';
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: ${textColor};
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        max-width: 400px;
        animation: slideIn 0.3s ease;
        border: 1px solid ${type === 'success' ? '#6BB890' : type === 'error' ? '#E55A5A' : '#A8C5E0'};
    `;
    
    // Add animation keyframes
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            .notification-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1rem;
            }
            .notification-close {
                background: none;
                border: none;
                color: inherit;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0;
                line-height: 1;
            }
            .notification-close:hover {
                opacity: 0.8;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Add close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Add slideOut animation
if (!document.querySelector('#slideout-styles')) {
    const style = document.createElement('style');
    style.id = 'slideout-styles';
    style.textContent = `
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Chat demo functionality
function initializeChatDemo() {
    const chatInput = document.querySelector('.input-container input');
    const chatMessages = document.querySelector('.chat-messages');
    
    if (chatInput && chatMessages) {
        // Add typing animation to existing messages
        const messages = document.querySelectorAll('.message p');
        let delay = 1000;
        
        messages.forEach((message, index) => {
            const text = message.textContent;
            setTimeout(() => {
                typeMessage(message, text);
            }, delay);
            delay += 2000;
        });
        
        // Handle new message input
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && this.value.trim()) {
                addUserMessage(this.value.trim());
                this.value = '';
                
                // Simulate AI response
                setTimeout(() => {
                    const responses = [
                        "That's a great question! Let me help you with that.",
                        "I'd be happy to provide guidance on that topic.",
                        "Here's what I recommend based on your goals.",
                        "That's an important consideration for your nutrition journey."
                    ];
                    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                    addAIMessage(randomResponse);
                }, 1000);
            }
        });
    }
}

function addUserMessage(text) {
    const chatMessages = document.querySelector('.chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user-message';
    messageDiv.innerHTML = `<p>${text}</p>`;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addAIMessage(text) {
    const chatMessages = document.querySelector('.chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ai-message';
    messageDiv.innerHTML = `<p>${text}</p>`;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Add typing animation
    const messageP = messageDiv.querySelector('p');
    typeMessage(messageP, text);
}

// Add typing animation to chat demo
function typeMessage(element, text, speed = 50) {
    element.textContent = '';
    let i = 0;
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Add hover effects to buttons
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}); 