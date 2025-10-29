// Update copyright year dynamically
function updateCopyrightYear() {
    const currentYear = new Date().getFullYear();
    const yearElement = document.getElementById("current-year");
    if (yearElement) {
        yearElement.textContent = currentYear;
    }
}

// Initialize Supabase client
const supabase = window.supabase.createClient(
    window.SUPABASE_CONFIG.url, 
    window.SUPABASE_CONFIG.anonKey
);

// Smooth scrolling functions
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

function scrollToWaitlist() {
    document.getElementById('waitlist').scrollIntoView({
        behavior: 'smooth'
    });
}

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

// Animated counters for hero stats
function initializeCounters() {
    // Set start dates for calculations (adjust these as needed)
    const waitlistStartDate = new Date('2025-10-17T09:12:00Z');
    const membersStartDate = new Date('2025-10-17T09:12:00Z');
    
    // Initial animation values (reduced to 1/4 to match target numbers)
    const initialWaitlist = 300;
    const initialMembers = 30;
    
    // Waitlist counter: starts at 300, increases by 1 every 10 minutes
    const waitlistCounter = document.getElementById('waitlist-counter');
    if (waitlistCounter) {
        const currentWaitlist = calculateCurrentWaitlist(waitlistStartDate, initialWaitlist);
        animateCounter(waitlistCounter, initialWaitlist, currentWaitlist, 2000);
        startLiveWaitlistCounter(waitlistCounter, waitlistStartDate, initialWaitlist);
    }
    
    // Launch date counter: starts at Dec 31, goes to Dec 1
    const launchCounter = document.getElementById('launch-counter');
    if (launchCounter) {
        animateDateCounter(launchCounter, 'Dec 31', 'Dec 1', 4000);
    }
    
    // Members counter: starts at 30, increases by 1 every 20 minutes
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
                   'Dec 2', 'Dec 1'];
    
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
    const increments = Math.floor(minutesElapsed / 10); // +1 every 10 minutes
    return initialValue + increments;
}

// Calculate current members based on elapsed time
function calculateCurrentMembers(startDate, initialValue) {
    const now = new Date();
    const minutesElapsed = Math.floor((now - startDate) / (1000 * 60));
    const increments = Math.floor(minutesElapsed / 20); // +1 every 20 minutes
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

// Floating Countdown Timer
function initializeCountdownTimer() {
    const launchDate = new Date('2025-12-01T00:00:00Z');
    
    function updateCountdown() {
        const now = new Date();
        const timeLeft = launchDate - now;
        
        if (timeLeft > 0) {
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            // Update the countdown display
            const daysElement = document.getElementById('days');
            const hoursElement = document.getElementById('hours');
            const minutesElement = document.getElementById('minutes');
            const secondsElement = document.getElementById('seconds');
            
            if (daysElement) daysElement.textContent = days.toString().padStart(2, '0');
            if (hoursElement) hoursElement.textContent = hours.toString().padStart(2, '0');
            if (minutesElement) minutesElement.textContent = minutes.toString().padStart(2, '0');
            if (secondsElement) secondsElement.textContent = seconds.toString().padStart(2, '0');
        } else {
            // Launch day has arrived!
            const daysElement = document.getElementById('days');
            const hoursElement = document.getElementById('hours');
            const minutesElement = document.getElementById('minutes');
            const secondsElement = document.getElementById('seconds');
            
            if (daysElement) daysElement.textContent = '00';
            if (hoursElement) hoursElement.textContent = '00';
            if (minutesElement) minutesElement.textContent = '00';
            if (secondsElement) secondsElement.textContent = '00';
            
            // Optional: Hide the countdown or show a different message
            const countdownBubble = document.getElementById('countdown-bubble');
            if (countdownBubble) {
                countdownBubble.innerHTML = `
                    <div class="countdown-content">
                        <div class="countdown-title">🎉 We're Live!</div>
                        <div class="countdown-subtitle">December 1st is here!</div>
                    </div>
                `;
            }
        }
    }
    
    // Update immediately and then every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Add click functionality to countdown bubble
function addCountdownBubbleClick() {
    const countdownBubble = document.getElementById('countdown-bubble');
    if (countdownBubble) {
        countdownBubble.addEventListener('click', function() {
            // Scroll to waitlist section
            const waitlistSection = document.getElementById('waitlist');
            if (waitlistSection) {
                waitlistSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    }
}

// FAQ functionality
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// Spam folder popup
function showSpamFolderPopup() {
    // Remove existing popups
    const existingPopups = document.querySelectorAll('.spam-folder-popup');
    existingPopups.forEach(popup => popup.remove());
    
    // Create popup element
    const popup = document.createElement('div');
    popup.className = 'spam-folder-popup';
    popup.innerHTML = `
        <div class="spam-popup-content">
            <div class="spam-popup-header">
                <i class="fas fa-envelope-open-text"></i>
                <h3>Check Your Email!</h3>
            </div>
            <div class="spam-popup-body">
                <p>Check your email (and spam folder if you don't see it!) for confirmation and add my email to your 'safe senders' or your 'contact list' to ensure you receive my communications.</p>
                <div class="spam-popup-actions">
                    <button class="btn-primary spam-popup-close">Got it!</button>
                </div>
            </div>
        </div>
    `;
    
    // Add styles
    popup.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease;
    `;
    
    // Add popup styles
    if (!document.querySelector('#spam-popup-styles')) {
        const style = document.createElement('style');
        style.id = 'spam-popup-styles';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            .spam-popup-content {
                background: white;
                border-radius: 16px;
                padding: 30px;
                max-width: 500px;
                margin: 20px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                animation: slideUp 0.3s ease;
            }
            @keyframes slideUp {
                from { transform: translateY(30px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            .spam-popup-header {
                text-align: center;
                margin-bottom: 20px;
            }
            .spam-popup-header i {
                font-size: 3rem;
                color: #78C6A3;
                margin-bottom: 10px;
            }
            .spam-popup-header h3 {
                margin: 0;
                color: #0C2240;
                font-size: 1.5rem;
                font-weight: 700;
            }
            .spam-popup-body p {
                color: #0C2240;
                line-height: 1.6;
                margin-bottom: 25px;
                text-align: center;
            }
            .spam-popup-actions {
                text-align: center;
            }
            .spam-popup-close {
                width: 100%;
                max-width: 200px;
                margin: 0 auto;
                display: block;
                background: #78C6A3;
                color: white;
                border: none;
                padding: 12px 30px;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .spam-popup-close:hover {
                background: #6BB890;
                transform: translateY(-2px);
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add to page
    document.body.appendChild(popup);
    
    // Add close functionality
    const closeBtn = popup.querySelector('.spam-popup-close');
    closeBtn.addEventListener('click', () => {
        popup.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => popup.remove(), 300);
    });
    
    // Close on background click
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            popup.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => popup.remove(), 300);
        }
    });
    
    // Add fadeOut animation
    if (!document.querySelector('#fadeout-styles')) {
        const style = document.createElement('style');
        style.id = 'fadeout-styles';
        style.textContent = `
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Function to apply rounded corners to Stripe pricing table after it loads
function applyStripeTableStyling() {
    const stripeTable = document.querySelector('stripe-pricing-table');
    if (stripeTable) {
        // Wait for Stripe table to fully load
        setTimeout(() => {
            // Apply rounded corners to the Stripe table
            stripeTable.style.borderRadius = '16px';
            stripeTable.style.overflow = 'hidden';
            
            // Also try to style any iframe that Stripe might create
            const iframe = stripeTable.querySelector('iframe');
            if (iframe) {
                iframe.style.borderRadius = '16px';
                iframe.style.overflow = 'hidden';
            }
        }, 1000);
    }
}

// MAIN INITIALIZATION - Single DOMContentLoaded listener
document.addEventListener('DOMContentLoaded', function() {
    // Update copyright year
    updateCopyrightYear();
    
    // Show spam folder popup on founding membership page
    if (window.location.pathname.includes("founding-membership")) {
        setTimeout(() => {
            showSpamFolderPopup();
        }, 2000);
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
    
    // Initialize countdown timer
    initializeCountdownTimer();
    
    // Add countdown bubble click functionality
    addCountdownBubbleClick();
    
    // Initialize FAQ
    initializeFAQ();
    
    // Add hover effects to buttons
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Apply Stripe table styling
    applyStripeTableStyling();
});

// Also apply styling when Stripe table loads
document.addEventListener('stripe-pricing-table-loaded', function() {
    applyStripeTableStyling();
});
