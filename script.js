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
    
    // Initialize animated counters
    initializeCounters();
    
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

// Animated counters for hero stats
function initializeCounters() {
    // Set start dates for calculations (adjust these as needed)
    const waitlistStartDate = new Date('2025-07-01T00:00:00Z');
    const membersStartDate = new Date('2025-07-01T00:00:00Z');
    
    // Initial animation values
    const initialWaitlist = 800;
    const initialMembers = 180;
    
    // Waitlist counter: starts at 800, increases by 3 every 10 minutes
    const waitlistCounter = document.getElementById('waitlist-counter');
    if (waitlistCounter) {
        const currentWaitlist = calculateCurrentWaitlist(waitlistStartDate, initialWaitlist);
        animateCounter(waitlistCounter, initialWaitlist, currentWaitlist, 2000);
        startLiveWaitlistCounter(waitlistCounter, waitlistStartDate, initialWaitlist);
    }
    
    // Launch date counter: starts at Dec 31, goes to Oct 1
    const launchCounter = document.getElementById('launch-counter');
    if (launchCounter) {
        animateDateCounter(launchCounter, 'Dec 31', 'Oct 1', 2000);
    }
    
    // Members counter: starts at 180, increases by 1 every 7 minutes
    const membersCounter = document.getElementById('members-counter');
    if (membersCounter) {
        const currentMembers = calculateCurrentMembers(membersStartDate, initialMembers);
        animateCounter(membersCounter, initialMembers, currentMembers, 2000);
        startLiveMembersCounter(membersCounter, membersStartDate, initialMembers);
    }
}

function animateCounter(element, start, end, duration) {
    const startTime = performance.now();
    const difference = end - start;
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(start + (difference * easeOutQuart));
        
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

function animateDateCounter(element, startDate, endDate, duration) {
    const startTime = performance.now();
    const dates = ['Dec 31', 'Dec 30', 'Dec 29', 'Dec 28', 'Dec 27', 'Dec 26', 'Dec 25', 
                   'Dec 24', 'Dec 23', 'Dec 22', 'Dec 21', 'Dec 20', 'Dec 19', 'Dec 18',
                   'Dec 17', 'Dec 16', 'Dec 15', 'Dec 14', 'Dec 13', 'Dec 12', 'Dec 11',
                   'Dec 10', 'Dec 9', 'Dec 8', 'Dec 7', 'Dec 6', 'Dec 5', 'Dec 4', 'Dec 3',
                   'Dec 2', 'Dec 1', 'Nov 30', 'Nov 29', 'Nov 28', 'Nov 27', 'Nov 26',
                   'Nov 25', 'Nov 24', 'Nov 23', 'Nov 22', 'Nov 21', 'Nov 20', 'Nov 19',
                   'Nov 18', 'Nov 17', 'Nov 16', 'Nov 15', 'Nov 14', 'Nov 13', 'Nov 12',
                   'Nov 11', 'Nov 10', 'Nov 9', 'Nov 8', 'Nov 7', 'Nov 6', 'Nov 5', 'Nov 4',
                   'Nov 3', 'Nov 2', 'Nov 1', 'Oct 31', 'Oct 30', 'Oct 29', 'Oct 28',
                   'Oct 27', 'Oct 26', 'Oct 25', 'Oct 24', 'Oct 23', 'Oct 22', 'Oct 21',
                   'Oct 20', 'Oct 19', 'Oct 18', 'Oct 17', 'Oct 16', 'Oct 15', 'Oct 14',
                   'Oct 13', 'Oct 12', 'Oct 11', 'Oct 10', 'Oct 9', 'Oct 8', 'Oct 7',
                   'Oct 6', 'Oct 5', 'Oct 4', 'Oct 3', 'Oct 2', 'Oct 1'];
    
    function updateDate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const index = Math.floor(easeOutQuart * (dates.length - 1));
        
        element.textContent = dates[index];
        
        if (progress < 1) {
            requestAnimationFrame(updateDate);
        }
    }
    
    requestAnimationFrame(updateDate);
}

// Calculate current waitlist based on elapsed time
function calculateCurrentWaitlist(startDate, initialValue) {
    const now = new Date();
    const minutesElapsed = Math.floor((now - startDate) / (1000 * 60));
    const increments = Math.floor(minutesElapsed / 10); // +3 every 10 minutes
    return initialValue + (increments * 3);
}

// Calculate current members based on elapsed time
function calculateCurrentMembers(startDate, initialValue) {
    const now = new Date();
    const minutesElapsed = Math.floor((now - startDate) / (1000 * 60));
    const increments = Math.floor(minutesElapsed / 7); // +1 every 7 minutes
    return initialValue + increments;
}

// Start live waitlist counter updates
function startLiveWaitlistCounter(element, startDate, initialValue) {
    // Update every minute
    setInterval(() => {
        const currentValue = calculateCurrentWaitlist(startDate, initialValue);
        element.textContent = currentValue.toLocaleString();
    }, 60000); // 60 seconds
}

// Start live members counter updates
function startLiveMembersCounter(element, startDate, initialValue) {
    // Update every minute
    setInterval(() => {
        const currentValue = calculateCurrentMembers(startDate, initialValue);
        element.textContent = currentValue.toLocaleString();
    }, 60000); // 60 seconds
}