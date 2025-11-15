// Neobrutalist Portfolio JavaScript

// ============================================
// Smooth Scroll & Navigation
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('.nav-item');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update active state
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });

    // ============================================
    // Scroll Progress Bar
    // ============================================
    
    const createProgressBar = () => {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.prepend(progressBar);
        return progressBar;
    };
    
    const progressBar = createProgressBar();
    
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
        
        // Update nav on scroll
        const nav = document.getElementById('mainNav');
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // ============================================
    // Intersection Observer for Animations
    // ============================================
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                
                // Update active nav item based on visible section
                const sectionId = entry.target.getAttribute('id');
                if (sectionId) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            }
        });
    }, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
    
    // Observe reveal elements
    document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
        el.style.animationPlayState = 'paused';
        observer.observe(el);
    });

    // ============================================
    // Mobile Menu
    // ============================================
    
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    const menuIcon = document.getElementById('menuIcon');
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
    let mobileMenuOpen = false;
    
    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuOpen = !mobileMenuOpen;
            
            if (mobileMenuOpen) {
                // Open menu
                mobileNav.classList.remove('translate-x-full');
                mobileNav.classList.add('translate-x-0');
                menuIcon.classList.remove('fa-bars');
                menuIcon.classList.add('fa-times');
                document.body.style.overflow = 'hidden';
            } else {
                // Close menu
                closeMobileMenu();
            }
        });
    }
    
    function closeMobileMenu() {
        mobileMenuOpen = false;
        if (mobileNav) {
            mobileNav.classList.add('translate-x-full');
            mobileNav.classList.remove('translate-x-0');
        }
        if (menuIcon) {
            menuIcon.classList.add('fa-bars');
            menuIcon.classList.remove('fa-times');
        }
        document.body.style.overflow = '';
    }
    
    // Close mobile menu when nav item is clicked
    mobileNavItems.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            // Close menu first
            closeMobileMenu();
            
            // Then scroll to section
            setTimeout(() => {
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }, 300);
        });
    });

    // ============================================
    // Publication Filters
    // ============================================
    
    const filterButtons = document.querySelectorAll('.filter-btn');
    const publicationItems = document.querySelectorAll('.publication-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filterYear = button.getAttribute('data-year');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter publications
            publicationItems.forEach(item => {
                const itemYear = item.getAttribute('data-year');
                
                if (filterYear === 'all' || itemYear === filterYear) {
                    item.classList.remove('hidden');
                    item.style.display = 'block';
                } else {
                    item.classList.add('hidden');
                    item.style.display = 'none';
                }
            });
        });
    });

    // ============================================
    // AI Demos Functionality
    // ============================================
    
    // Image Upload Demo
    const imageInput = document.getElementById('imageInput');
    const imageCanvas = document.getElementById('imageCanvas');
    const analysisOutput = document.getElementById('analysisOutput');
    
    if (imageInput) {
        imageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const img = new Image();
                    img.onload = () => {
                        imageCanvas.style.display = 'block';
                        const ctx = imageCanvas.getContext('2d');
                        imageCanvas.width = img.width;
                        imageCanvas.height = img.height;
                        ctx.drawImage(img, 0, 0);
                        
                        // Simulate AI analysis
                        analysisOutput.innerHTML = `
                            <div class="loading mb-4"></div>
                            <p class="mb-2">Analyzing image...</p>
                        `;
                        
                        setTimeout(() => {
                            analysisOutput.innerHTML = `
                                <p class="mb-2"><strong>Image Dimensions:</strong> ${img.width}x${img.height}</p>
                                <p class="mb-2"><strong>File Size:</strong> ${(file.size / 1024).toFixed(2)} KB</p>
                                <p class="mb-2"><strong>Format:</strong> ${file.type}</p>
                                <p class="mb-4"><strong>Status:</strong> <span class="text-neo-green">✓ Analysis Complete</span></p>
                                <p class="text-xs opacity-75">Note: This is a demo. Connect to a real AI model for actual analysis.</p>
                            `;
                        }, 2000);
                    };
                    img.src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Text Generation Demo
    const generateTextBtn = document.getElementById('generateText');
    const promptInput = document.getElementById('promptInput');
    const textOutput = document.getElementById('textOutput');
    
    if (generateTextBtn) {
        generateTextBtn.addEventListener('click', () => {
            const prompt = promptInput.value.trim();
            
            if (!prompt) {
                textOutput.innerHTML = '<p class="text-neo-pink">⚠ Please enter a prompt first!</p>';
                return;
            }
            
            textOutput.innerHTML = '<div class="loading mb-4"></div><p>Generating response...</p>';
            
            setTimeout(() => {
                textOutput.innerHTML = `
                    <p class="mb-4"><strong>Prompt:</strong> ${prompt}</p>
                    <p class="mb-4">This is a demonstration of AI text generation. In a production environment, this would connect to a language model API (such as GPT, Claude, or similar) to generate contextually relevant academic content based on your research interests.</p>
                    <p class="mb-4">The system would analyze your prompt and generate detailed responses about topics like computer vision, complex networks, knowledge discovery, generative models, and few-shot learning.</p>
                    <p class="text-xs opacity-75 mt-4">Note: This is a demo interface. Connect to an actual AI API for real text generation.</p>
                `;
            }, 2000);
        });
    }
    
    // Paper Similarity Demo
    const findSimilarBtn = document.getElementById('findSimilar');
    const paperTitleInput = document.getElementById('paperTitle');
    const similarityOutput = document.getElementById('similarityOutput');
    
    if (findSimilarBtn) {
        findSimilarBtn.addEventListener('click', () => {
            const paperTitle = paperTitleInput.value.trim();
            
            if (!paperTitle) {
                similarityOutput.innerHTML = '<p class="text-neo-pink">⚠ Please enter a paper title first!</p>';
                return;
            }
            
            similarityOutput.innerHTML = '<div class="loading mb-4"></div><p>Searching for similar papers...</p>';
            
            setTimeout(() => {
                similarityOutput.innerHTML = `
                    <p class="mb-4"><strong>Query:</strong> ${paperTitle}</p>
                    <div class="space-y-3">
                        <div class="border-t-2 border-white pt-3">
                            <p class="font-bold mb-1">Similar Paper 1</p>
                            <p class="text-xs opacity-75">Similarity: 87%</p>
                        </div>
                        <div class="border-t-2 border-white pt-3">
                            <p class="font-bold mb-1">Similar Paper 2</p>
                            <p class="text-xs opacity-75">Similarity: 82%</p>
                        </div>
                        <div class="border-t-2 border-white pt-3">
                            <p class="font-bold mb-1">Similar Paper 3</p>
                            <p class="text-xs opacity-75">Similarity: 78%</p>
                        </div>
                    </div>
                    <p class="text-xs opacity-75 mt-4">Note: This is a demo. Connect to a research database API for actual paper similarity analysis.</p>
                `;
            }, 2000);
        });
    }

    // ============================================
    // Parallax Effect
    // ============================================
    
    const parallaxElements = document.querySelectorAll('.parallax');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(el => {
            const speed = el.dataset.speed || 0.5;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // ============================================
    // Keyboard Navigation
    // ============================================
    
    document.addEventListener('keydown', (e) => {
        // Navigate sections with arrow keys
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            const sections = Array.from(document.querySelectorAll('section'));
            const currentSection = sections.find(section => {
                const rect = section.getBoundingClientRect();
                return rect.top >= 0 && rect.top < window.innerHeight / 2;
            });
            
            if (currentSection) {
                const currentIndex = sections.indexOf(currentSection);
                let nextIndex;
                
                if (e.key === 'ArrowDown') {
                    nextIndex = Math.min(currentIndex + 1, sections.length - 1);
                } else {
                    nextIndex = Math.max(currentIndex - 1, 0);
                }
                
                sections[nextIndex].scrollIntoView({ behavior: 'smooth' });
                e.preventDefault();
            }
        }
    });

    // ============================================
    // Performance Optimization
    // ============================================
    
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

    // ============================================
    // Console Easter Egg
    // ============================================
    
    console.log('%c🎨 NEOBRUTALIST PORTFOLIO', 'font-size: 24px; font-weight: bold; color: #FF006E;');
    console.log('%cDesigned with bold colors, thick borders, and zero subtlety!', 'font-size: 14px; color: #00F5FF;');
    console.log('%cBuilt with Tailwind CSS & Pure JavaScript', 'font-size: 12px; color: #00FF85;');
    
    // ============================================
    // Initialization Complete
    // ============================================
    
    console.log('✓ Portfolio initialized successfully');
});

// ============================================
// Utility Functions
// ============================================

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
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Random color generator for fun interactions
function getRandomNeoColor() {
    const colors = ['#FFE500', '#FF006E', '#00F5FF', '#00FF85', '#8B5CF6', '#FF6B00'];
    return colors[Math.floor(Math.random() * colors.length)];
}
