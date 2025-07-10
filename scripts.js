// ===== LOADING SCREEN =====
window.addEventListener('load', () => {
    const loading = document.getElementById('loading');
    if (loading) {
        setTimeout(() => {
            loading.classList.add('fade-out');
            setTimeout(() => {
                loading.style.display = 'none';
            }, 500);
        }, 1000);
    }
});

// ===== ENHANCED MOBILE NAVIGATION =====
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav__link');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        navMenu.classList.toggle('show');
        
        // Change hamburger icon
        const icon = navToggle.querySelector('i');
        if (navMenu.classList.contains('show')) {
            icon.className = 'bx bx-x';
        } else {
            icon.className = 'bx bx-menu';
        }
    });

    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('show');
            const icon = navToggle.querySelector('i');
            icon.className = 'bx bx-menu';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navMenu.classList.remove('show');
            const icon = navToggle.querySelector('i');
            icon.className = 'bx bx-menu';
        }
    });

    // Prevent menu close when clicking inside menu
    navMenu.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

// ===== HEADER SCROLL EFFECT =====
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (header) {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
});

// ===== SMOOTH SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// ===== ACTIVE NAVIGATION HIGHLIGHTING =====
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav__link');

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ===== ENHANCED PARALLAX EFFECT =====
let ticking = false;

function updateParallax() {
    const scrolled = window.pageYOffset;
    const shapes = document.querySelectorAll('.floating-shape');
    
    shapes.forEach((shape, index) => {
        const speed = 0.3 + (index * 0.1); // Reduced speed for better mobile performance
        shape.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.05}deg)`;
    });
    
    ticking = false;
}

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
    }
}

// Only enable parallax on desktop to improve mobile performance
if (window.innerWidth > 768) {
    window.addEventListener('scroll', requestTick);
}

// Re-enable/disable parallax on resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        window.addEventListener('scroll', requestTick);
    } else {
        window.removeEventListener('scroll', requestTick);
    }
});

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.section, .project__card, .interest__card, .skill__item').forEach(el => {
    observer.observe(el);
});

// ===== SKILL PROGRESS BARS ANIMATION =====
const observeProgressBars = () => {
    const progressBars = document.querySelectorAll('.skill-progress__fill');
    
    if (progressBars.length > 0) {
        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const fill = entry.target;
                    const width = fill.getAttribute('data-width');
                    setTimeout(() => {
                        fill.style.width = width + '%';
                    }, 200);
                }
            });
        }, { threshold: 0.5 });

        progressBars.forEach(bar => progressObserver.observe(bar));
    }
};

// ===== PROJECTS CAROUSEL (if exists) =====
const initProjectsCarousel = () => {
    const track = document.getElementById('projects-track');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const dots = document.querySelectorAll('.carousel__dot');
    
    if (!track) return;
    
    let currentSlide = 0;
    const totalSlides = track.children.length;
    let isAutoPlaying = true;
    let autoPlayInterval;

    function updateCarousel() {
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }

    function startAutoPlay() {
        if (isAutoPlaying) {
            autoPlayInterval = setInterval(nextSlide, 5000);
        }
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    // Button event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            stopAutoPlay();
            nextSlide();
            setTimeout(startAutoPlay, 3000);
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            stopAutoPlay();
            prevSlide();
            setTimeout(startAutoPlay, 3000);
        });
    }

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopAutoPlay();
            currentSlide = index;
            updateCarousel();
            setTimeout(startAutoPlay, 3000);
        });
    });

    // Touch/swipe support for mobile
    let startX = 0;
    let endX = 0;
    const carousel = document.querySelector('.projects__carousel');

    if (carousel) {
        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            stopAutoPlay();
        });

        carousel.addEventListener('touchmove', (e) => {
            e.preventDefault(); // Prevent scrolling
        });

        carousel.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diffX = startX - endX;
            
            if (Math.abs(diffX) > 50) { // Minimum swipe distance
                if (diffX > 0) {
                    nextSlide(); // Swipe left - next slide
                } else {
                    prevSlide(); // Swipe right - previous slide
                }
            }
            setTimeout(startAutoPlay, 3000);
        });
    }

    // Pause autoplay when page is not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopAutoPlay();
            isAutoPlaying = false;
        } else {
            isAutoPlaying = true;
            startAutoPlay();
        }
    });

    // Start autoplay
    startAutoPlay();
};

// ===== FAQ ACCORDION =====
const initFAQ = () => {
    const faqQuestions = document.querySelectorAll('.faq__question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const answer = faqItem.querySelector('.faq__answer');
            const icon = this.querySelector('.faq__icon');
            
            // Close other open items
            document.querySelectorAll('.faq__item').forEach(item => {
                if (item !== faqItem) {
                    item.classList.remove('active');
                    const otherAnswer = item.querySelector('.faq__answer');
                    const otherIcon = item.querySelector('.faq__icon');
                    if (otherAnswer) otherAnswer.style.maxHeight = null;
                    if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
                }
            });
            
            // Toggle current item
            faqItem.classList.toggle('active');
            
            if (faqItem.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                icon.style.transform = 'rotate(45deg)';
            } else {
                answer.style.maxHeight = null;
                icon.style.transform = 'rotate(0deg)';
            }
        });
    });
};

// ===== CONTACT FORM =====
const initContactForm = () => {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('.form__submit');
            const submitText = submitBtn.querySelector('.submit__text');
            const submitIcon = submitBtn.querySelector('.submit__icon');
            
            // Show loading state
            submitText.textContent = 'Sending...';
            submitIcon.className = 'bx bx-loader-alt bx-spin submit__icon';
            submitBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                // Success state
                submitText.textContent = 'Message Sent!';
                submitIcon.className = 'bx bx-check submit__icon';
                
                // Show success message
                alert('Thank you for your message! I will get back to you within 24 hours.');
                
                // Reset form
                this.reset();
                
                // Reset button after delay
                setTimeout(() => {
                    submitText.textContent = 'Send Message';
                    submitIcon.className = 'bx bx-send submit__icon';
                    submitBtn.disabled = false;
                }, 2000);
                
            }, 2000);
        });

        // Form input animations
        document.querySelectorAll('.form__input').forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                if (!this.value) {
                    this.parentElement.classList.remove('focused');
                }
            });
        });
    }
};

// ===== VIDEO THUMBNAIL CLICK =====
const initVideoThumbnail = () => {
    const videoThumbnail = document.querySelector('.video__thumbnail');
    
    if (videoThumbnail) {
        videoThumbnail.addEventListener('click', function() {
            // In a real implementation, this would open the actual video
            alert('Video would open here! Connect your actual YouTube video link.');
        });
    }
};

// ===== ACTIVITY CARDS HOVER EFFECTS =====
const initActivityCards = () => {
    const activityCards = document.querySelectorAll('.activity__card');
    
    activityCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
};

// ===== COPY EMAIL TO CLIPBOARD =====
const initEmailCopy = () => {
    const emailElements = document.querySelectorAll('[href^="mailto:"]');
    
    emailElements.forEach(element => {
        element.addEventListener('click', function(e) {
            e.preventDefault();
            const email = this.getAttribute('href').replace('mailto:', '');
            
            // Copy to clipboard
            navigator.clipboard.writeText(email).then(() => {
                // Show feedback
                const originalText = this.textContent;
                this.textContent = 'Email copied!';
                setTimeout(() => {
                    this.textContent = originalText;
                }, 2000);
            }).catch(() => {
                // Fallback for older browsers
                window.location.href = this.getAttribute('href');
            });
        });
    });
};

// ===== INITIALIZE ALL COMPONENTS =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize components based on what exists on the page
    observeProgressBars();
    initProjectsCarousel();
    initFAQ();
    initContactForm();
    initVideoThumbnail();
    initActivityCards();
    initEmailCopy();
    
    // Add smooth entry animations to page elements
    const animatedElements = document.querySelectorAll('.section, .project__card, .interest__card, .activity__card, .certification__card');
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

// ===== UTILITY FUNCTIONS =====

// Debounce function for performance
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

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

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

// ===== PERFORMANCE OPTIMIZATIONS =====

// Lazy load images when they come into view
const lazyImages = document.querySelectorAll('img[data-src]');
if (lazyImages.length > 0) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
}

// Preload critical resources
const preloadLink = document.createElement('link');
preloadLink.rel = 'preload';
preloadLink.href = 'https://cdn.jsdelivr.net/npm/boxicons@2.0.5/css/boxicons.min.css';
preloadLink.as = 'style';
document.head.appendChild(preloadLink);