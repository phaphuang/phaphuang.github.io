// Enhanced Neural Network Animation with better performance
class NeuralNetwork {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.nodes = [];
        this.connections = [];
        this.animationId = null;
        this.isRunning = false;
        this.lastTime = 0;
        this.fps = 60;
        this.frameInterval = 1000 / this.fps;
        
        this.initializeNetwork();
        this.setupCanvas();
    }
    
    setupCanvas() {
        // Set canvas size with device pixel ratio for crisp rendering
        const rect = this.canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        
        this.ctx.scale(dpr, dpr);
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
    }
    
    initializeNetwork() {
        const layers = [4, 6, 6, 3];
        const layerSpacing = 400 / (layers.length + 1);
        
        let nodeId = 0;
        for (let layer = 0; layer < layers.length; layer++) {
            const nodesInLayer = layers[layer];
            const nodeSpacing = 300 / (nodesInLayer + 1);
            
            for (let node = 0; node < nodesInLayer; node++) {
                this.nodes.push({
                    id: nodeId++,
                    x: layerSpacing * (layer + 1),
                    y: nodeSpacing * (node + 1),
                    layer: layer,
                    activation: Math.random(),
                    targetActivation: Math.random(),
                    radius: 15,
                    pulsePhase: Math.random() * Math.PI * 2
                });
            }
        }
        
        // Create connections with optimized structure
        for (let layer = 0; layer < layers.length - 1; layer++) {
            const currentLayerNodes = this.nodes.filter(n => n.layer === layer);
            const nextLayerNodes = this.nodes.filter(n => n.layer === layer + 1);
            
            currentLayerNodes.forEach(fromNode => {
                nextLayerNodes.forEach(toNode => {
                    this.connections.push({
                        from: fromNode,
                        to: toNode,
                        weight: (Math.random() - 0.5) * 2,
                        activity: 0,
                        animationPhase: Math.random() * Math.PI * 2
                    });
                });
            });
        }
    }
    
    animate(currentTime = 0) {
        if (currentTime - this.lastTime < this.frameInterval) {
            if (this.isRunning) {
                this.animationId = requestAnimationFrame((time) => this.animate(time));
            }
            return;
        }
        
        this.lastTime = currentTime;
        this.ctx.clearRect(0, 0, 400, 300);
        
        const time = currentTime * 0.001;
        
        // Update node activations with smoother animation
        this.nodes.forEach(node => {
            node.pulsePhase += 0.02;
            node.targetActivation = Math.sin(time + node.pulsePhase) * 0.5 + 0.5;
            node.activation += (node.targetActivation - node.activation) * 0.08;
        });
        
        // Update connection activities
        this.connections.forEach(connection => {
            connection.animationPhase += 0.03;
            const pulse = Math.sin(time + connection.animationPhase) * 0.3 + 0.7;
            connection.activity = connection.from.activation * Math.abs(connection.weight) * pulse;
        });
        
        // Draw connections with gradient effects
        this.connections.forEach(connection => {
            const opacity = Math.max(0.1, connection.activity);
            const gradient = this.ctx.createLinearGradient(
                connection.from.x, connection.from.y,
                connection.to.x, connection.to.y
            );
            
            const color = connection.weight > 0 ? '52, 152, 219' : '231, 76, 60';
            gradient.addColorStop(0, `rgba(${color}, ${opacity})`);
            gradient.addColorStop(1, `rgba(${color}, ${opacity * 0.3})`);
            
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = Math.abs(connection.weight) * 2 + 1;
            this.ctx.beginPath();
            this.ctx.moveTo(connection.from.x, connection.from.y);
            this.ctx.lineTo(connection.to.x, connection.to.y);
            this.ctx.stroke();
        });
        
        // Draw nodes with enhanced effects
        this.nodes.forEach(node => {
            const intensity = node.activation;
            const hue = 200 + intensity * 60;
            const saturation = 70;
            const lightness = 50 + intensity * 30;
            
            // Draw glow effect
            const glowRadius = node.radius + intensity * 10;
            const glowGradient = this.ctx.createRadialGradient(
                node.x, node.y, 0,
                node.x, node.y, glowRadius
            );
            glowGradient.addColorStop(0, `hsla(${hue}, ${saturation}%, ${lightness}%, ${intensity * 0.8})`);
            glowGradient.addColorStop(1, `hsla(${hue}, ${saturation}%, ${lightness}%, 0)`);
            
            this.ctx.fillStyle = glowGradient;
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, glowRadius, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw main node
            this.ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw border
            this.ctx.strokeStyle = '#2c3e50';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        });
        
        if (this.isRunning) {
            this.animationId = requestAnimationFrame((time) => this.animate(time));
        }
    }
    
    start() {
        this.isRunning = true;
        this.animate();
    }
    
    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Enhanced Navigation with mobile support
class Navigation {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('.section, .hero-section');
        this.sidebar = document.querySelector('.nav-sidebar');
        this.mobileToggle = null;
        
        this.initializeNavigation();
        this.initializeScrollSpy();
        this.initializeMobileNavigation();
        this.initializeScrollEffects();
    }
    
    initializeNavigation() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    // Close mobile nav if open
                    if (this.sidebar.classList.contains('open')) {
                        this.closeMobileNav();
                    }
                    
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
                
                this.updateActiveLink(link);
            });
        });
    }
    
    initializeMobileNavigation() {
        // Create mobile toggle button
        this.mobileToggle = document.createElement('button');
        this.mobileToggle.className = 'mobile-nav-toggle';
        this.mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
        this.mobileToggle.setAttribute('aria-label', 'Toggle navigation');
        document.body.appendChild(this.mobileToggle);
        
        this.mobileToggle.addEventListener('click', () => {
            this.toggleMobileNav();
        });
        
        // Close nav when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.sidebar.contains(e.target) && !this.mobileToggle.contains(e.target)) {
                this.closeMobileNav();
            }
        });
        
        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMobileNav();
            }
        });
    }
    
    toggleMobileNav() {
        this.sidebar.classList.toggle('open');
        const isOpen = this.sidebar.classList.contains('open');
        this.mobileToggle.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        this.mobileToggle.setAttribute('aria-expanded', isOpen);
    }
    
    closeMobileNav() {
        this.sidebar.classList.remove('open');
        this.mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
        this.mobileToggle.setAttribute('aria-expanded', 'false');
    }
    
    updateActiveLink(activeLink) {
        this.navLinks.forEach(l => l.classList.remove('active'));
        activeLink.classList.add('active');
    }
    
    initializeScrollSpy() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    const correspondingLink = document.querySelector(`.nav-link[href="#${id}"]`);
                    if (correspondingLink) {
                        this.updateActiveLink(correspondingLink);
                    }
                }
            });
        }, { 
            threshold: 0.3,
            rootMargin: '-20% 0px -20% 0px'
        });
        
        this.sections.forEach(section => {
            if (section.id) {
                observer.observe(section);
            }
        });
    }
    
    initializeScrollEffects() {
        let ticking = false;
        
        const updateScrollEffects = () => {
            const scrolled = window.pageYOffset;
            const heroSection = document.querySelector('.hero-section');
            
            if (heroSection) {
                // Parallax effect with performance optimization
                heroSection.style.transform = `translateY(${scrolled * 0.3}px)`;
            }
            
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        });
    }
}

// Enhanced Publication filtering with smooth animations
class PublicationFilter {
    constructor() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.publications = document.querySelectorAll('.publication-item');
        
        this.initializeFilters();
    }
    
    initializeFilters() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const year = button.getAttribute('data-year');
                
                // Update active button with smooth transition
                this.filterButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.style.transform = 'scale(1)';
                });
                button.classList.add('active');
                button.style.transform = 'scale(1.05)';
                
                // Filter publications with staggered animation
                this.publications.forEach((pub, index) => {
                    const pubYear = pub.getAttribute('data-year');
                    
                    if (year === 'all' || pubYear === year) {
                        setTimeout(() => {
                            pub.classList.remove('filtered-out');
                            pub.style.display = 'flex';
                            pub.style.animation = 'slideInUp 0.5s ease-out forwards';
                        }, index * 50);
                    } else {
                        pub.classList.add('filtered-out');
                        setTimeout(() => {
                            pub.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
}

// Enhanced AI Demos with better UX
class AIDemo {
    constructor() {
        this.initializeImageDemo();
        this.initializeTextDemo();
        this.initializePaperDemo();
    }
    
    initializeImageDemo() {
        const imageInput = document.getElementById('imageInput');
        const canvas = document.getElementById('imageCanvas');
        const analysisOutput = document.getElementById('analysisOutput');
        const uploadPlaceholder = document.querySelector('.upload-placeholder');
        
        if (!imageInput || !canvas || !analysisOutput || !uploadPlaceholder) return;
        
        const ctx = canvas.getContext('2d');
        
        // Add drag and drop functionality
        uploadPlaceholder.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadPlaceholder.style.background = '#e3f2fd';
            uploadPlaceholder.style.transform = 'scale(1.02)';
        });
        
        uploadPlaceholder.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadPlaceholder.style.background = '';
            uploadPlaceholder.style.transform = 'scale(1)';
        });
        
        uploadPlaceholder.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadPlaceholder.style.background = '';
            uploadPlaceholder.style.transform = 'scale(1)';
            
            const files = e.dataTransfer.files;
            if (files.length > 0 && files[0].type.startsWith('image/')) {
                this.processImage(files[0], canvas, ctx, analysisOutput, uploadPlaceholder);
            }
        });
        
        imageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                this.processImage(file, canvas, ctx, analysisOutput, uploadPlaceholder);
            }
        });
    }
    
    processImage(file, canvas, ctx, analysisOutput, uploadPlaceholder) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                // Smooth transition to show canvas
                uploadPlaceholder.style.opacity = '0';
                setTimeout(() => {
                    uploadPlaceholder.style.display = 'none';
                    canvas.style.display = 'block';
                    canvas.style.opacity = '0';
                    
                    // Draw image with proper scaling
                    const maxWidth = 400;
                    const maxHeight = 300;
                    let { width, height } = img;
                    
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                    if (height > maxHeight) {
                        width = (width * maxHeight) / height;
                        height = maxHeight;
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // Fade in canvas
                    canvas.style.transition = 'opacity 0.5s ease';
                    canvas.style.opacity = '1';
                    
                    this.simulateImageAnalysis(analysisOutput);
                }, 300);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
    
    simulateImageAnalysis(outputElement) {
        outputElement.innerHTML = '<div class="loading">🔍 Analyzing image...</div>';
        
        // Simulate progressive analysis
        const steps = [
            { delay: 500, text: '🔍 Preprocessing image...' },
            { delay: 1000, text: '🧠 Running neural network...' },
            { delay: 1500, text: '📊 Generating results...' }
        ];
        
        steps.forEach(step => {
            setTimeout(() => {
                outputElement.innerHTML = `<div class="loading">${step.text}</div>`;
            }, step.delay);
        });
        
        setTimeout(() => {
            const analyses = [
                { category: 'Object Detection', confidence: 94.2, description: 'Detected multiple objects with high confidence' },
                { category: 'Scene Classification', confidence: 87.6, description: 'Indoor/outdoor scene classification completed' },
                { category: 'Color Analysis', confidence: 99.1, description: 'Dominant colors and palette extracted' },
                { category: 'Edge Detection', confidence: 91.8, description: 'Edge features and contours identified' }
            ];
            
            let html = '<div class="analysis-grid">';
            analyses.forEach((analysis, index) => {
                html += `
                    <div class="analysis-item" style="animation-delay: ${index * 0.1}s">
                        <h5>${analysis.category}</h5>
                        <div class="confidence-bar">
                            <div class="confidence-fill" style="width: ${analysis.confidence}%"></div>
                        </div>
                        <p class="confidence-text">${analysis.confidence}%</p>
                        <p class="analysis-desc">${analysis.description}</p>
                    </div>
                `;
            });
            html += '</div>';
            
            outputElement.innerHTML = html;
        }, 2000);
    }
    
    initializeTextDemo() {
        const generateBtn = document.getElementById('generateText');
        const promptInput = document.getElementById('promptInput');
        const textOutput = document.getElementById('textOutput');
        
        if (!generateBtn || !promptInput || !textOutput) return;
        
        // Add real-time character count
        const charCount = document.createElement('div');
        charCount.className = 'char-count';
        charCount.style.cssText = 'font-size: 0.8rem; color: #7f8c8d; margin-top: 0.5rem;';
        promptInput.parentNode.appendChild(charCount);
        
        promptInput.addEventListener('input', () => {
            const count = promptInput.value.length;
            charCount.textContent = `${count}/500 characters`;
            charCount.style.color = count > 450 ? '#e74c3c' : '#7f8c8d';
        });
        
        generateBtn.addEventListener('click', () => {
            const prompt = promptInput.value.trim();
            if (prompt) {
                generateBtn.disabled = true;
                generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
                this.simulateTextGeneration(prompt, textOutput, generateBtn);
            }
        });
        
        // Enable enter key to generate
        promptInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                generateBtn.click();
            }
        });
    }
    
    simulateTextGeneration(prompt, outputElement, button) {
        outputElement.innerHTML = '<div class="loading">🤖 Generating AI response...</div>';
        
        setTimeout(() => {
            const responses = {
                'computer vision': 'Computer vision is a field of artificial intelligence that trains computers to interpret and understand the visual world. Using digital images from cameras and videos and deep learning models, machines can accurately identify and classify objects — and then react to what they "see."',
                'machine learning': 'Machine learning is a method of data analysis that automates analytical model building. It is a branch of artificial intelligence based on the idea that systems can learn from data, identify patterns and make decisions with minimal human intervention.',
                'neural networks': 'Neural networks are computing systems inspired by biological neural networks. They are comprised of layers of interconnected nodes (neurons) that process information using a connectionist approach to computation.',
                'deep learning': 'Deep learning is part of a broader family of machine learning methods based on artificial neural networks with representation learning. Learning can be supervised, semi-supervised or unsupervised.'
            };
            
            let response = responses[prompt.toLowerCase()] || 
                `Based on your query about "${prompt}", this represents an important area in AI research. Current developments focus on improving accuracy, efficiency, and real-world applications. Key challenges include data quality, computational requirements, and ethical considerations in deployment.`;
            
            const confidence = Math.floor(Math.random() * 15) + 85;
            
            response = `
                <div class="ai-response">
                    <h5>🤖 AI-Generated Academic Response:</h5>
                    <p>${response}</p>
                    <div class="response-meta">
                        <span class="confidence">Confidence: ${confidence}%</span>
                        <span class="model">Model: GPT-Academic-v2</span>
                        <span class="tokens">${Math.floor(response.length / 4)} tokens</span>
                    </div>
                </div>
            `;
            
            outputElement.innerHTML = response;
            
            // Reset button
            button.disabled = false;
            button.innerHTML = 'Generate AI Response';
        }, 1500);
    }
    
    initializePaperDemo() {
        const findBtn = document.getElementById('findSimilar');
        const paperInput = document.getElementById('paperTitle');
        const similarityOutput = document.getElementById('similarityOutput');
        
        if (!findBtn || !paperInput || !similarityOutput) return;
        
        findBtn.addEventListener('click', () => {
            const title = paperInput.value.trim();
            if (title) {
                findBtn.disabled = true;
                findBtn.innerHTML = '<i class="fas fa-search fa-spin"></i> Searching...';
                this.simulatePaperSimilarity(title, similarityOutput, findBtn);
            }
        });
        
        paperInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                findBtn.click();
            }
        });
    }
    
    simulatePaperSimilarity(title, outputElement, button) {
        outputElement.innerHTML = '<div class="loading">🔍 Searching academic databases...</div>';
        
        setTimeout(() => {
            const similarPapers = [
                {
                    title: 'Advanced Neural Networks for Computer Vision Applications',
                    authors: 'Smith, J., Johnson, A., Brown, K.',
                    year: '2023',
                    similarity: 92.4,
                    venue: 'IEEE Transactions on Pattern Analysis',
                    citations: 156
                },
                {
                    title: 'Deep Learning Approaches in Image Recognition',
                    authors: 'Chen, L., Wang, M., Liu, X.',
                    year: '2023',
                    similarity: 87.1,
                    venue: 'Computer Vision and Image Understanding',
                    citations: 89
                },
                {
                    title: 'Meta-Learning for Few-Shot Classification',
                    authors: 'Garcia, R., Martinez, S., Lopez, C.',
                    year: '2022',
                    similarity: 84.6,
                    venue: 'International Conference on Machine Learning',
                    citations: 234
                }
            ];
            
            let html = '<div class="similar-papers">';
            similarPapers.forEach((paper, index) => {
                html += `
                    <div class="paper-item" style="animation-delay: ${index * 0.1}s">
                        <div class="paper-similarity">${paper.similarity}%</div>
                        <div class="paper-details">
                            <h5>${paper.title}</h5>
                            <p class="paper-authors">${paper.authors}</p>
                            <p class="paper-venue">${paper.venue} (${paper.year})</p>
                            <p class="paper-citations">📚 ${paper.citations} citations</p>
                        </div>
                    </div>
                `;
            });
            html += '</div>';
            
            outputElement.innerHTML = html;
            
            // Reset button
            button.disabled = false;
            button.innerHTML = 'Find Similar Papers';
        }, 2000);
    }
}

// Enhanced Research card interactions
class ResearchInteractions {
    constructor() {
        this.researchCards = document.querySelectorAll('.research-card');
        this.initializeCardEffects();
        this.initializeIntersectionObserver();
    }
    
    initializeCardEffects() {
        this.researchCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const field = card.getAttribute('data-research');
                this.highlightRelatedTags(field);
                
                // Add ripple effect
                this.createRippleEffect(card);
            });
            
            card.addEventListener('mouseleave', () => {
                this.resetTagHighlights();
            });
            
            // Add click handler for mobile
            card.addEventListener('click', () => {
                card.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    card.style.transform = '';
                }, 150);
            });
        });
    }
    
    createRippleEffect(element) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255,255,255,0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (rect.width / 2 - size / 2) + 'px';
        ripple.style.top = (rect.height / 2 - size / 2) + 'px';
        
        element.style.position = 'relative';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    initializeIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationDelay = '0s';
                    entry.target.style.animation = 'slideInUp 0.6s ease-out forwards';
                }
            });
        }, { threshold: 0.1 });
        
        this.researchCards.forEach(card => {
            observer.observe(card);
        });
    }
    
    highlightRelatedTags(field) {
        const tags = document.querySelectorAll('.ai-tag');
        tags.forEach(tag => {
            const tagField = tag.getAttribute('data-field');
            if (tagField === field) {
                tag.style.background = 'rgba(255,255,255,0.4)';
                tag.style.transform = 'scale(1.1) translateY(-2px)';
                tag.style.boxShadow = '0 4px 15px rgba(255,255,255,0.3)';
            } else {
                tag.style.opacity = '0.6';
                tag.style.transform = 'scale(0.95)';
            }
        });
    }
    
    resetTagHighlights() {
        const tags = document.querySelectorAll('.ai-tag');
        tags.forEach(tag => {
            tag.style.background = '';
            tag.style.transform = '';
            tag.style.opacity = '';
            tag.style.boxShadow = '';
        });
    }
}

// Performance optimization utilities
class PerformanceOptimizer {
    constructor() {
        this.initializeLazyLoading();
        this.initializePreloadCriticalResources();
        this.optimizeAnimations();
    }
    
    initializeLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
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
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    initializePreloadCriticalResources() {
        // Preload critical fonts
        const fontLink = document.createElement('link');
        fontLink.rel = 'preload';
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
        fontLink.as = 'style';
        document.head.appendChild(fontLink);
    }
    
    optimizeAnimations() {
        // Reduce animations on low-end devices
        if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
            document.documentElement.style.setProperty('--animation-duration', '0.1s');
        }
        
        // Pause animations when tab is not visible
        document.addEventListener('visibilitychange', () => {
            const animations = document.getAnimations();
            if (document.hidden) {
                animations.forEach(anim => anim.pause());
            } else {
                animations.forEach(anim => anim.play());
            }
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize neural network if canvas exists
    const canvas = document.getElementById('neuralCanvas');
    let neuralNetwork = null;
    
    if (canvas) {
        neuralNetwork = new NeuralNetwork(canvas);
        
        // Neural network controls
        const startBtn = document.getElementById('startAnimation');
        const stopBtn = document.getElementById('stopAnimation');
        
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                neuralNetwork.start();
                startBtn.style.opacity = '0.5';
                stopBtn.style.opacity = '1';
            });
        }
        
        if (stopBtn) {
            stopBtn.addEventListener('click', () => {
                neuralNetwork.stop();
                startBtn.style.opacity = '1';
                stopBtn.style.opacity = '0.5';
            });
        }
        
        // Auto-start with delay
        setTimeout(() => {
            neuralNetwork.start();
            if (startBtn) startBtn.style.opacity = '0.5';
            if (stopBtn) stopBtn.style.opacity = '1';
        }, 1000);
    }
    
    // Initialize other components
    new Navigation();
    new PublicationFilter();
    new AIDemo();
    new ResearchInteractions();
    new PerformanceOptimizer();
    
    // Add enhanced CSS animations
    
    // Add dynamic styles for enhanced UX
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .loading {
            text-align: center;
            color: #3498db;
            font-style: italic;
            animation: pulse 1.5s infinite;
        }
        
        .analysis-grid {
            display: grid;
            gap: 1rem;
        }
        
        .analysis-item {
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 8px;
            border-left: 3px solid #3498db;
            animation: slideInUp 0.6s ease-out forwards;
        }
        
        .analysis-item h5 {
            color: #2c3e50;
            margin-bottom: 0.5rem;
        }
        
        .confidence-bar {
            background: #e9ecef;
            height: 8px;
            border-radius: 4px;
            overflow: hidden;
            margin: 0.5rem 0;
        }
        
        .confidence-fill {
            background: linear-gradient(90deg, #3498db, #2ecc71);
            height: 100%;
            border-radius: 4px;
            transition: width 1s ease;
        }
        
        .confidence-text {
            font-weight: 600;
            color: #3498db;
            font-size: 0.9rem;
        }
        
        .analysis-desc {
            color: #7f8c8d;
            font-size: 0.9rem;
            margin-top: 0.5rem;
        }
        
        .ai-response {
            background: #f8f9fa;
            padding: 1.5rem;
            border-radius: 10px;
            border-left: 4px solid #3498db;
            animation: slideInUp 0.6s ease-out;
        }
        
        .ai-response h5 {
            color: #2c3e50;
            margin-bottom: 1rem;
        }
        
        .response-meta {
            display: flex;
            gap: 1rem;
            margin-top: 1rem;
            font-size: 0.9rem;
            flex-wrap: wrap;
        }
        
        .confidence, .model, .tokens {
            background: #3498db;
            color: white;
            padding: 0.3rem 0.6rem;
            border-radius: 12px;
            font-size: 0.8rem;
        }
        
        .similar-papers {
            space-y: 1rem;
        }
        
        .paper-item {
            display: flex;
            gap: 1rem;
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 8px;
            border-left: 3px solid #3498db;
            margin-bottom: 1rem;
            animation: slideInUp 0.6s ease-out forwards;
        }
        
        .paper-similarity {
            background: #3498db;
            color: white;
            padding: 0.5rem;
            border-radius: 8px;
            font-weight: 600;
            min-width: 60px;
            text-align: center;
            height: fit-content;
        }
        
        .paper-details h5 {
            color: #2c3e50;
            margin-bottom: 0.5rem;
            line-height: 1.3;
        }
        
        .paper-authors {
            color: #7f8c8d;
            font-style: italic;
            margin-bottom: 0.3rem;
        }
        
        .paper-venue {
            color: #5d6d7e;
            font-weight: 500;
            margin-bottom: 0.3rem;
        }
        
        .paper-citations {
            color: #3498db;
            font-size: 0.9rem;
        }
        
        .char-count {
            transition: color 0.3s ease;
        }
    `;
    document.head.appendChild(style);
});
