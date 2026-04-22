// ===================================
// DARK THEME TOGGLER
// ===================================

function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;
    const savedTheme = localStorage.getItem('theme') || 'light';

    // Set initial theme
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        updateThemeIcon(true);
    }

    // Theme toggle button
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = document.body.classList.toggle('dark-theme');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateThemeIcon(isDark);
        });
    }
}

function updateThemeIcon(isDark) {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (isDark) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }
}

// ===================================
// NAVBAR SCROLL BEHAVIOR
// ===================================

const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===================================
// SMOOTH SCROLL NAVIGATION
// ===================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===================================
// SCROLL TO TOP BUTTON
// ===================================

const scrollTopBtn = document.getElementById('scrollTopBtn');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollTopBtn.classList.add('show');
    } else {
        scrollTopBtn.classList.remove('show');
    }
});

scrollTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===================================
// ANIMATED COUNTERS
// ===================================

class CounterAnimator {
    constructor() {
        this.counters = document.querySelectorAll('.counter');
        this.animated = new Set();
        this.observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };
        this.setupObserver();
    }

    setupObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animated.has(entry.target)) {
                    this.animateCounter(entry.target);
                    this.animated.add(entry.target);
                }
            });
        }, this.observerOptions);

        this.counters.forEach(counter => {
            observer.observe(counter);
        });
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'), 10);
        const duration = 2000; // 2 seconds
        const start = Date.now();

        const updateCounter = () => {
            const now = Date.now();
            const progress = Math.min((now - start) / duration, 1);
            
            // Easing function (easeOutQuad)
            const easeProgress = 1 - Math.pow(1 - progress, 2);
            
            const current = Math.floor(target * easeProgress);
            element.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
            }
        };

        updateCounter();
    }
}

// Initialize counter animator when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new CounterAnimator();
});

// ===================================
// SCROLL ANIMATIONS (Intersection Observer)
// ===================================

class ScrollAnimator {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        this.setupObserver();
    }

    setupObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, this.observerOptions);

        // Observe section content
        const elementsToAnimate = document.querySelectorAll(
            '.service-col, .project-col, .about-image, .about-content, ' +
            '.contact-info-card, .stat-item'
        );

        elementsToAnimate.forEach(element => {
            observer.observe(element);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ScrollAnimator();
});

// ===================================
// ACTIVE NAV LINK ON SCROLL
// ===================================

class ActiveNavLink {
    constructor() {
        this.navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        this.sections = document.querySelectorAll('section[id]');
        this.setupScroll();
    }

    setupScroll() {
        window.addEventListener('scroll', () => {
            this.updateActiveLink();
        });
        
        // Set initial active link
        this.updateActiveLink();
    }

    updateActiveLink() {
        let current = '';

        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ActiveNavLink();
});

// ===================================
// FORM SUBMISSION
// ===================================

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        
        // Simple validation
        const inputs = contactForm.querySelectorAll('input, textarea');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('is-invalid');
            } else {
                input.classList.remove('is-invalid');
            }
        });

        if (isValid) {
            // Show success message
            showNotification('Message sent successfully! We will contact you soon.', 'success');
            
            // Reset form
            contactForm.reset();
            
            // Remove focus states
            inputs.forEach(input => {
                input.blur();
            });
        } else {
            showNotification('Please fill in all fields.', 'error');
        }
    });
}

// Notification function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        max-width: 400px;
        box-shadow: var(--shadow-lg);
        animation: slideInRight 0.3s ease-out;
    `;
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// ===================================
// LAZY LOADING IMAGES
// ===================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===================================
// PARALLAX EFFECT (Hero Section)
// ===================================

class ParallaxEffect {
    constructor() {
        this.heroImage = document.querySelector('.hero-image img');
        if (this.heroImage) {
            this.setupParallax();
        }
    }

    setupParallax() {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            const parallaxStrength = 0.5;
            this.heroImage.style.transform = `translateY(${scrollPosition * parallaxStrength}px)`;
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ParallaxEffect();
});

// ===================================
// CAROUSEL AUTO-PLAY
// ===================================

const carousel = document.getElementById('testimonialsCarousel');
if (carousel) {
    const bsCarousel = new bootstrap.Carousel(carousel, {
        interval: 5000,
        wrap: true,
        keyboard: true,
        pause: 'hover',
        touch: true
    });
}

// ===================================
// MOBILE MENU CLOSE ON LINK CLICK
// ===================================

document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    link.addEventListener('click', () => {
        const navbar = document.querySelector('.navbar-collapse');
        if (navbar.classList.contains('show')) {
            document.querySelector('.navbar-toggler').click();
        }
    });
});

// ===================================
// FORM INPUT FOCUS STYLES
// ===================================

document.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });

    input.addEventListener('blur', function() {
        if (!this.value) {
            this.parentElement.classList.remove('focused');
        }
    });

    // Check on page load if input has value
    if (input.value) {
        input.parentElement.classList.add('focused');
    }
});

// ===================================
// KEYBOARD NAVIGATION
// ===================================

// Close navbar on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            document.querySelector('.navbar-toggler').click();
        }
    }
});

// ===================================
// PERFORMANCE OPTIMIZATION
// ===================================

// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===================================
// PRELOAD CRITICAL IMAGES
// ===================================

function preloadImages(urls) {
    urls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Preload hero image
    preloadImages([
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=600&fit=crop'
    ]);
});

// ===================================
// UTILITY FUNCTIONS
// ===================================

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ===================================
// ENHANCE ACCESSIBILITY
// ===================================

// Add ARIA labels to buttons
document.querySelectorAll('.btn').forEach(btn => {
    if (!btn.getAttribute('aria-label')) {
        btn.setAttribute('aria-label', btn.textContent.trim());
    }
});

// ===================================
// ERROR HANDLING
// ===================================

window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

// ===================================
// INITIALIZATION
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('SecureGuard website loaded successfully');
    
    // Add loading complete class
    document.body.classList.add('loaded');
});

// ===================================
// REQUEST ANIMATION FRAME POLYFILL
// ===================================

window.requestAnimationFrame = window.requestAnimationFrame || 
    window.webkitRequestAnimationFrame || 
    window.mozRequestAnimationFrame || 
    function(callback) {
        return setTimeout(callback, 16);
    };
