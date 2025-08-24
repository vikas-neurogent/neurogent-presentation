// Presentation Script for neurogent.ai
class PresentationController {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 15;
        this.slides = document.querySelectorAll('.slide');
        this.navDots = document.querySelector('.nav-dots');
        this.slideCounter = document.querySelector('.slide-counter');
        this.isTransitioning = false;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.updateSlideCounter();
        this.preloadNextSlide();
        
        // Auto-advance slides every 30 seconds (optional)
        // this.startAutoAdvance();
    }
    
    /* Navigation dots removed to prevent content overlap */
    
    bindEvents() {
        // Navigation buttons
        document.getElementById('prevBtn').addEventListener('click', () => this.previousSlide());
        document.getElementById('nextBtn').addEventListener('click', () => this.nextSlide());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Touch/swipe support
        this.bindTouchEvents();
        
        // Prevent context menu on right click
        document.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Handle visibility change (pause/resume auto-advance)
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
    }
    
    bindTouchEvents() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            this.handleSwipe(startX, startY, endX, endY);
        });
    }
    
    handleSwipe(startX, startY, endX, endY) {
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const minSwipeDistance = 50;
        
        // Only handle horizontal swipes
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) {
                this.previousSlide();
            } else {
                this.nextSlide();
            }
        }
    }
    
    handleKeyboard(e) {
        switch (e.key) {
            case 'ArrowRight':
            case ' ':
            case 'Enter':
                e.preventDefault();
                this.nextSlide();
                break;
            case 'ArrowLeft':
            case 'Backspace':
                e.preventDefault();
                this.previousSlide();
                break;
            case 'Home':
                e.preventDefault();
                this.goToSlide(0);
                break;
            case 'End':
                e.preventDefault();
                this.goToSlide(this.totalSlides - 1);
                break;
            case 'Escape':
                e.preventDefault();
                this.toggleFullscreen();
                break;
        }
        
        // Number keys for direct slide navigation
        if (e.key >= '1' && e.key <= '9') {
            const slideNum = parseInt(e.key) - 1;
            if (slideNum < this.totalSlides) {
                this.goToSlide(slideNum);
            }
        }
    }
    
    nextSlide() {
        if (this.isTransitioning) return;
        
        const nextSlide = (this.currentSlide + 1) % this.totalSlides;
        this.goToSlide(nextSlide);
    }
    
    previousSlide() {
        if (this.isTransitioning) return;
        
        const prevSlide = this.currentSlide === 0 ? this.totalSlides - 1 : this.currentSlide - 1;
        this.goToSlide(prevSlide);
    }
    
    goToSlide(slideIndex) {
        if (this.isTransitioning || slideIndex === this.currentSlide) return;
        
        this.isTransitioning = true;
        
        // Remove active class from current slide
        this.slides[this.currentSlide].classList.remove('active');
        if (slideIndex > this.currentSlide) {
            this.slides[this.currentSlide].classList.add('prev');
        }
        
        // Add active class to new slide
        setTimeout(() => {
            this.slides[slideIndex].classList.add('active');
            this.slides[slideIndex].classList.remove('prev');
        }, 50);
        
        // Clean up previous slide classes
        setTimeout(() => {
            this.slides.forEach(slide => slide.classList.remove('prev'));
            this.isTransitioning = false;
        }, 600);
        
        this.currentSlide = slideIndex;
        this.updateSlideCounter();
        this.preloadNextSlide();
        this.triggerSlideAnimations();
        
        // Track slide views (for analytics if needed)
        this.trackSlideView(slideIndex);
    }
    
    /* Navigation dots functionality removed */
    
    updateSlideCounter() {
        this.slideCounter.textContent = `${this.currentSlide + 1} / ${this.totalSlides}`;
    }
    
    preloadNextSlide() {
        // Preload images or content for the next slide (if any)
        const nextSlideIndex = (this.currentSlide + 1) % this.totalSlides;
        const nextSlide = this.slides[nextSlideIndex];
        
        // Trigger any lazy-loaded content
        const lazyElements = nextSlide.querySelectorAll('[data-src]');
        lazyElements.forEach(element => {
            if (element.dataset.src) {
                element.src = element.dataset.src;
                element.removeAttribute('data-src');
            }
        });
    }
    
    triggerSlideAnimations() {
        const currentSlideElement = this.slides[this.currentSlide];
        
        // Reset animations
        const animatedElements = currentSlideElement.querySelectorAll('[class*="slide-in"], [class*="fade-in"]');
        animatedElements.forEach(element => {
            element.style.animation = 'none';
            element.offsetHeight; // Trigger reflow
            element.style.animation = null;
        });
        
        // Trigger any specific slide animations
        this.handleSlideSpecificAnimations(this.currentSlide);
    }
    
    handleSlideSpecificAnimations(slideIndex) {
        switch (slideIndex) {
            case 0: // Title slide
                this.animateTitleSlide();
                break;
            case 6: // Case studies preview
                this.animatePreviewItems();
                break;
            case 10: // Impact table
                this.animateImpactTable();
                break;
            case 11: // Technology stack
                this.animateTechStack();
                break;
        }
    }
    
    animateTitleSlide() {
        const logo = document.querySelector('.logo-image');
        if (logo) {
            logo.style.animation = 'pulse 2s ease-in-out infinite';
        }
        
        const aiIcons = document.querySelectorAll('.ai-icons i');
        aiIcons.forEach((icon, index) => {
            icon.style.animationDelay = `${index * 0.2}s`;
        });
    }
    
    animatePreviewItems() {
        const previewItems = document.querySelectorAll('.preview-item');
        previewItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    item.style.transform = 'translateY(0)';
                }, 200);
            }, index * 100);
        });
    }
    
    animateImpactTable() {
        const tableRows = document.querySelectorAll('.table-row:not(.header)');
        tableRows.forEach((row, index) => {
            setTimeout(() => {
                row.style.transform = 'translateX(0)';
                row.style.opacity = '1';
            }, index * 100);
        });
    }
    
    animateTechStack() {
        const techItems = document.querySelectorAll('.tech-item');
        techItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    item.style.transform = 'scale(1)';
                }, 150);
            }, index * 50);
        });
    }
    
    startAutoAdvance(interval = 30000) {
        this.autoAdvanceInterval = setInterval(() => {
            if (!document.hidden && !this.isTransitioning) {
                this.nextSlide();
            }
        }, interval);
    }
    
    stopAutoAdvance() {
        if (this.autoAdvanceInterval) {
            clearInterval(this.autoAdvanceInterval);
            this.autoAdvanceInterval = null;
        }
    }
    
    handleVisibilityChange() {
        if (document.hidden) {
            this.stopAutoAdvance();
        } else {
            // Optionally restart auto-advance when tab becomes visible
            // this.startAutoAdvance();
        }
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Could not enter fullscreen:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }
    
    trackSlideView(slideIndex) {
        // Analytics tracking (implement with your preferred analytics service)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'slide_view', {
                slide_number: slideIndex + 1,
                slide_title: this.getSlideTitle(slideIndex)
            });
        }
        
        // Console log for development
        console.log(`Viewing slide ${slideIndex + 1}: ${this.getSlideTitle(slideIndex)}`);
    }
    
    getSlideTitle(slideIndex) {
        const slideTitles = [
            'Title Slide',
            'The Problem',
            'The Solution',
            'Why neurogent.ai?',
            'Our Core Capabilities',
            'Our Work Transition',
            'Healthcare Claims Automation',
            'AI-Powered Loan Advisor',
            'Voice AI Driver Onboarding',
            'Insurance Eligibility Verification',
            'Proven Impact',
            'Technology Stack',
            'Engagement Process',
            'Call to Action',
            'Thank You & Contact'
        ];
        
        return slideTitles[slideIndex] || `Slide ${slideIndex + 1}`;
    }
    
    // Public API methods
    getCurrentSlide() {
        return this.currentSlide;
    }
    
    getTotalSlides() {
        return this.totalSlides;
    }
    
    isCurrentlyTransitioning() {
        return this.isTransitioning;
    }
}

// Additional utility functions
class PresentationUtils {
    static addProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.className = 'presentation-progress';
        progressBar.innerHTML = '<div class="progress-fill"></div>';
        document.body.appendChild(progressBar);
        
        // Update progress bar
        window.addEventListener('slidechange', (e) => {
            const progress = ((e.detail.currentSlide + 1) / e.detail.totalSlides) * 100;
            document.querySelector('.progress-fill').style.width = `${progress}%`;
        });
    }
    
    static addSlideNotes() {
        // Add speaker notes functionality
        const notesContainer = document.createElement('div');
        notesContainer.className = 'speaker-notes';
        notesContainer.style.display = 'none';
        document.body.appendChild(notesContainer);
        
        // Toggle notes with 'N' key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'n' || e.key === 'N') {
                const notes = document.querySelector('.speaker-notes');
                notes.style.display = notes.style.display === 'none' ? 'block' : 'none';
            }
        });
    }
    
    static addPrintStyles() {
        const printStyles = document.createElement('style');
        printStyles.textContent = `
            @media print {
                .slide-nav, .nav-dots, .nav-controls {
                    display: none !important;
                }
                
                .slide {
                    position: relative !important;
                    opacity: 1 !important;
                    transform: none !important;
                    page-break-after: always;
                    height: 100vh;
                }
                
                .slide:last-child {
                    page-break-after: auto;
                }
            }
        `;
        document.head.appendChild(printStyles);
    }
    
    static enableAccessibility() {
        // Add ARIA labels and improve accessibility
        document.querySelectorAll('.slide').forEach((slide, index) => {
            slide.setAttribute('role', 'tabpanel');
            slide.setAttribute('aria-label', `Slide ${index + 1}`);
            slide.setAttribute('aria-hidden', index !== 0 ? 'true' : 'false');
        });
        
        // Update aria-hidden when slides change
        window.addEventListener('slidechange', (e) => {
            document.querySelectorAll('.slide').forEach((slide, index) => {
                slide.setAttribute('aria-hidden', index !== e.detail.currentSlide ? 'true' : 'false');
            });
        });
    }
}

// Initialize presentation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main presentation controller
    const presentation = new PresentationController();
    
    // Add utility features
    PresentationUtils.addProgressBar();
    PresentationUtils.addSlideNotes();
    PresentationUtils.addPrintStyles();
    PresentationUtils.enableAccessibility();
    
    // Make presentation controller globally available
    window.presentation = presentation;
    
    // Dispatch custom event for slide changes
    const originalGoToSlide = presentation.goToSlide.bind(presentation);
    presentation.goToSlide = function(slideIndex) {
        originalGoToSlide(slideIndex);
        
        window.dispatchEvent(new CustomEvent('slidechange', {
            detail: {
                currentSlide: slideIndex,
                totalSlides: this.totalSlides,
                slideTitle: this.getSlideTitle(slideIndex)
            }
        }));
    };
    
    // Add some interactive elements
    addInteractiveElements();
    
    // Log presentation ready
    console.log('neurogent.ai Presentation Ready! 🚀');
    console.log('Navigation: Arrow keys, Space, Enter, or click the navigation dots');
    console.log('Fullscreen: Press Escape to toggle');
    console.log('Direct navigation: Press 1-9 to jump to slides');
});

// Add interactive elements and effects
function addInteractiveElements() {
    // Add hover effects to metrics
    document.querySelectorAll('.metric').forEach(metric => {
        metric.addEventListener('mouseenter', () => {
            metric.style.transform = 'scale(1.05)';
            metric.style.transition = 'transform 0.3s ease';
        });
        
        metric.addEventListener('mouseleave', () => {
            metric.style.transform = 'scale(1)';
        });
    });
    
    // Add click effects to case study items
    document.querySelectorAll('.problem-item, .diff-item, .capability-section').forEach(item => {
        item.addEventListener('click', () => {
            item.style.transform = 'scale(0.98)';
            setTimeout(() => {
                item.style.transform = 'scale(1)';
            }, 150);
        });
    });
    
    // Add floating animation to AI icons
    document.querySelectorAll('.ai-icons i').forEach((icon, index) => {
        icon.style.animation = `bounce 2s ease-in-out infinite ${index * 0.2}s`;
    });
    
    // Add typewriter effect to main title (optional)
    const mainTitle = document.querySelector('.main-title');
    if (mainTitle && mainTitle.textContent) {
        // Uncomment to enable typewriter effect
        // typewriterEffect(mainTitle, mainTitle.textContent, 100);
    }
}

// Typewriter effect function
function typewriterEffect(element, text, speed = 100) {
    element.textContent = '';
    let i = 0;
    
    function typeWriter() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, speed);
        }
    }
    
    typeWriter();
}

// Add CSS for progress bar
const progressBarStyles = document.createElement('style');
progressBarStyles.textContent = `
    .presentation-progress {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: rgba(0, 0, 0, 0.3);
        z-index: 1001;
    }
    
    .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #2563eb, #7c3aed);
        width: 6.67%; /* 1/15 for first slide */
        transition: width 0.6s ease;
    }
    
    .speaker-notes {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 1rem;
        font-size: 0.9rem;
        z-index: 1002;
        backdrop-filter: blur(10px);
    }
`;
document.head.appendChild(progressBarStyles);

// Performance optimization
function optimizePerformance() {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Optimize animations
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
        document.body.classList.add('reduce-motion');
    }
}

// Call performance optimization
optimizePerformance();

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PresentationController, PresentationUtils };
}
