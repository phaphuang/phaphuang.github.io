// =============================================
// Professor Academic Portfolio — Interactive JS
// =============================================

document.addEventListener('DOMContentLoaded', () => {

    // =============================================
    // Scroll Progress Bar
    // =============================================
    const scrollProgress = document.getElementById('scrollProgress');

    const updateScrollProgress = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollProgress.style.width = progress + '%';
    };

    // =============================================
    // Navigation
    // =============================================
    const nav = document.getElementById('mainNav');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    const mobileNavLinks = mobileNav ? mobileNav.querySelectorAll('a') : [];

    // Scroll spy & nav shadow
    const sections = document.querySelectorAll('section[id]');

    const onScroll = () => {
        updateScrollProgress();

        // Nav shadow on scroll
        if (window.scrollY > 10) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        // Scroll spy
        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - 120;
            if (window.scrollY >= top) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    // Smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Mobile menu
    let mobileOpen = false;
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileOpen = !mobileOpen;
            mobileNav.classList.toggle('open', mobileOpen);
            mobileMenuBtn.innerHTML = mobileOpen
                ? '<i class="fas fa-times"></i>'
                : '<i class="fas fa-bars"></i>';
            document.body.style.overflow = mobileOpen ? 'hidden' : '';
        });
    }

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            mobileOpen = false;
            mobileNav.classList.remove('open');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.style.overflow = '';
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                setTimeout(() => {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 200);
            }
        });
    });

    // Escape key closes mobile nav
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileOpen) {
            mobileOpen = false;
            mobileNav.classList.remove('open');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.style.overflow = '';
        }
    });

    // =============================================
    // Animated Counters
    // =============================================
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    let countersAnimated = false;

    const animateCounters = () => {
        if (countersAnimated) return;
        const heroSection = document.getElementById('home');
        if (!heroSection) return;

        const rect = heroSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            countersAnimated = true;

            statNumbers.forEach(el => {
                const target = parseInt(el.getAttribute('data-target'), 10);
                const duration = 1500;
                const start = performance.now();

                const step = (now) => {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease out cubic
                    const eased = 1 - Math.pow(1 - progress, 3);
                    el.textContent = Math.round(eased * target);
                    if (progress < 1) {
                        requestAnimationFrame(step);
                    } else {
                        el.textContent = target;
                    }
                };
                requestAnimationFrame(step);
            });
        }
    };

    window.addEventListener('scroll', animateCounters, { passive: true });
    animateCounters(); // check on load

    // =============================================
    // Intersection Observer — Scroll Animations
    // =============================================
    const animateObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                animateObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
    });

    // Observe all elements with data-animate
    document.querySelectorAll('[data-animate]').forEach(el => {
        animateObserver.observe(el);
    });

    // Observe timeline items
    document.querySelectorAll('.timeline-item').forEach(el => {
        animateObserver.observe(el);
    });

    // Observe research cards
    document.querySelectorAll('.research-card').forEach(el => {
        animateObserver.observe(el);
    });

    // Observe publication items
    document.querySelectorAll('.pub-item').forEach(el => {
        animateObserver.observe(el);
    });

    // Observe course cards
    document.querySelectorAll('.course-card').forEach(el => {
        animateObserver.observe(el);
    });

    // Observe demo cards
    document.querySelectorAll('.demo-card').forEach(el => {
        animateObserver.observe(el);
    });

    // Observe stagger-children containers
    document.querySelectorAll('.stagger-children').forEach(el => {
        animateObserver.observe(el);
    });

    // =============================================
    // Publication Chart — Animated Bars
    // =============================================
    const chartObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bars = entry.target.querySelectorAll('.chart-bar');
                bars.forEach((bar, i) => {
                    setTimeout(() => {
                        bar.style.height = bar.getAttribute('data-height');
                    }, i * 120);
                });
                chartObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const pubChart = document.querySelector('.pub-chart');
    if (pubChart) {
        chartObserver.observe(pubChart);
    }

    // =============================================
    // Publication Filters
    // =============================================
    const filterBtns = document.querySelectorAll('.pub-filter-btn');
    const pubItems = document.querySelectorAll('.pub-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const year = btn.getAttribute('data-year');

            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter items with staggered animation
            let visibleIndex = 0;
            pubItems.forEach(item => {
                const itemYear = item.getAttribute('data-year');
                if (year === 'all' || itemYear === year) {
                    item.classList.remove('hidden');
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(15px)';
                    setTimeout(() => {
                        item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, visibleIndex * 60);
                    visibleIndex++;
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(15px)';
                    setTimeout(() => {
                        item.classList.add('hidden');
                    }, 300);
                }
            });
        });
    });

    // =============================================
    // AI Demos
    // =============================================

    // --- Image Analysis Demo ---
    const imageInput = document.getElementById('imageInput');
    const imageCanvas = document.getElementById('imageCanvas');
    const analysisOutput = document.getElementById('analysisOutput');

    if (imageInput) {
        imageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file || !file.type.startsWith('image/')) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    // Show canvas
                    const uploadArea = imageInput.closest('.demo-input-area').querySelector('.demo-upload');
                    if (uploadArea) uploadArea.style.display = 'none';

                    imageCanvas.style.display = 'block';
                    const ctx = imageCanvas.getContext('2d');
                    const maxW = 400, maxH = 300;
                    let w = img.width, h = img.height;
                    if (w > maxW) { h = (h * maxW) / w; w = maxW; }
                    if (h > maxH) { w = (w * maxH) / h; h = maxH; }
                    imageCanvas.width = w;
                    imageCanvas.height = h;
                    ctx.drawImage(img, 0, 0, w, h);

                    // Simulate analysis
                    analysisOutput.innerHTML = '<p><span class="loading-spinner"></span> Analyzing image...</p>';

                    setTimeout(() => {
                        const analyses = [
                            { name: 'Object Detection', score: 94.2 },
                            { name: 'Scene Classification', score: 87.6 },
                            { name: 'Color Analysis', score: 99.1 },
                            { name: 'Edge Detection', score: 91.8 }
                        ];

                        let html = '';
                        analyses.forEach(a => {
                            html += `
                                <div style="margin-bottom: 0.75rem;">
                                    <div style="display:flex;justify-content:space-between;font-size:0.85rem;margin-bottom:0.3rem;">
                                        <span>${a.name}</span>
                                        <span style="font-family:var(--mono);color:var(--accent-light)">${a.score}%</span>
                                    </div>
                                    <div class="confidence-bar">
                                        <div class="confidence-fill" style="width:${a.score}%"></div>
                                    </div>
                                </div>
                            `;
                        });
                        html += '<p style="font-size:0.75rem;opacity:0.5;margin-top:1rem;margin-bottom:0">Demo only — connect a real model for actual analysis.</p>';
                        analysisOutput.innerHTML = html;
                    }, 1800);
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    // --- Text Generation Demo ---
    const generateBtn = document.getElementById('generateText');
    const promptInput = document.getElementById('promptInput');
    const textOutput = document.getElementById('textOutput');

    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            const prompt = promptInput.value.trim();
            if (!prompt) {
                textOutput.innerHTML = '<p style="color:#e8a24e">Please enter a research topic or question.</p>';
                return;
            }

            generateBtn.disabled = true;
            generateBtn.innerHTML = '<span class="loading-spinner"></span> Generating...';
            textOutput.innerHTML = '<p><span class="loading-spinner"></span> Generating academic response...</p>';

            setTimeout(() => {
                const responses = {
                    'computer vision': 'Computer vision is a multidisciplinary field of AI that enables machines to interpret visual information from the world. Recent advances in transformer architectures (e.g., ViT, DaViT) have significantly improved performance on tasks such as object detection, image segmentation, and visual question answering. Key challenges remain in domain adaptation, few-shot visual recognition, and real-time processing for edge devices.',
                    'machine learning': 'Machine learning encompasses algorithms that improve through experience. Modern approaches span supervised, unsupervised, and reinforcement paradigms. Current frontiers include self-supervised pre-training, foundation models, federated learning for privacy preservation, and efficient fine-tuning strategies that reduce computational costs while maintaining high accuracy.',
                    'deep learning': 'Deep learning leverages multi-layered neural architectures to learn hierarchical representations. Innovations such as attention mechanisms, residual connections, and normalization techniques have enabled training of increasingly deep models. Applications extend from natural language processing to drug discovery and autonomous systems.',
                    'few-shot learning': 'Few-shot learning addresses the challenge of training models with minimal labeled examples. Approaches include metric-based methods (prototypical networks, siamese networks), optimization-based methods (MAML, Reptile), and augmentation strategies using generative models. This research area is critical for domains where labeled data is scarce or expensive to obtain.'
                };

                const key = Object.keys(responses).find(k => prompt.toLowerCase().includes(k));
                const response = key
                    ? responses[key]
                    : `Regarding "${prompt}": This represents an active area in AI research. Current work focuses on improving model accuracy, computational efficiency, and real-world deployment. Key considerations include data quality, ethical implications, and interdisciplinary collaboration to bridge theoretical advances with practical applications.`;

                const confidence = Math.floor(Math.random() * 10) + 88;
                textOutput.innerHTML = `
                    <p style="margin-bottom:1rem;line-height:1.8;">${response}</p>
                    <div style="display:flex;gap:1rem;font-size:0.75rem;opacity:0.6;font-family:var(--mono)">
                        <span>Confidence: ${confidence}%</span>
                        <span>${Math.floor(response.length / 4)} tokens</span>
                    </div>
                    <p style="font-size:0.75rem;opacity:0.4;margin-top:0.75rem;margin-bottom:0">Demo only — simulated response.</p>
                `;

                generateBtn.disabled = false;
                generateBtn.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> Generate Response';
            }, 1500);
        });

        // Ctrl+Enter to generate
        promptInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                generateBtn.click();
            }
        });
    }

    // --- Paper Similarity Demo ---
    const findBtn = document.getElementById('findSimilar');
    const paperInput = document.getElementById('paperTitle');
    const simOutput = document.getElementById('similarityOutput');

    if (findBtn) {
        findBtn.addEventListener('click', () => {
            const title = paperInput.value.trim();
            if (!title) {
                simOutput.innerHTML = '<p style="color:#e8a24e">Please enter a paper title.</p>';
                return;
            }

            findBtn.disabled = true;
            findBtn.innerHTML = '<span class="loading-spinner"></span> Searching...';
            simOutput.innerHTML = '<p><span class="loading-spinner"></span> Searching academic databases...</p>';

            setTimeout(() => {
                const papers = [
                    { title: 'Advanced Neural Networks for Computer Vision Applications', authors: 'Smith, J.; Johnson, A.; Brown, K.', venue: 'IEEE Trans. Pattern Analysis', year: 2023, score: 92.4 },
                    { title: 'Deep Learning Approaches in Image Recognition', authors: 'Chen, L.; Wang, M.; Liu, X.', venue: 'Computer Vision and Image Understanding', year: 2023, score: 87.1 },
                    { title: 'Meta-Learning for Few-Shot Classification Tasks', authors: 'Garcia, R.; Martinez, S.; Lopez, C.', venue: 'ICML 2022', year: 2022, score: 84.6 }
                ];

                let html = '';
                papers.forEach(p => {
                    html += `
                        <div class="similar-paper">
                            <h5><span class="similarity-score">${p.score}%</span>${p.title}</h5>
                            <p class="paper-meta">${p.authors} — ${p.venue} (${p.year})</p>
                        </div>
                    `;
                });
                html += '<p style="font-size:0.75rem;opacity:0.4;margin-top:1rem;margin-bottom:0">Demo only — simulated similarity scores.</p>';
                simOutput.innerHTML = html;

                findBtn.disabled = false;
                findBtn.innerHTML = '<i class="fas fa-search"></i> Find Similar Papers';
            }, 1800);
        });

        paperInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') findBtn.click();
        });
    }

    // =============================================
    // Research Tag Hover Interaction
    // =============================================
    const researchTags = document.querySelectorAll('.research-tag');
    const researchCards = document.querySelectorAll('.research-card');
    const tagToCardMap = {
        'Computer Vision': 0,
        'Complex Networks': 1,
        'Knowledge Discovery': 2,
        'Generative Models': 3,
        'Few-Shot Learning': 4
    };

    researchTags.forEach(tag => {
        tag.addEventListener('mouseenter', () => {
            const text = tag.textContent.trim();
            const cardIndex = tagToCardMap[text];
            if (cardIndex !== undefined && researchCards[cardIndex]) {
                researchCards[cardIndex].style.borderColor = 'var(--accent)';
                researchCards[cardIndex].style.boxShadow = 'var(--shadow-lg)';
            }
        });

        tag.addEventListener('mouseleave', () => {
            researchCards.forEach(card => {
                card.style.borderColor = '';
                card.style.boxShadow = '';
            });
        });
    });

    // =============================================
    // Keyboard Navigation (Arrow keys between sections)
    // =============================================
    document.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
        if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;

        const allSections = Array.from(document.querySelectorAll('section[id]'));
        let currentIdx = -1;

        allSections.forEach((sec, i) => {
            const rect = sec.getBoundingClientRect();
            if (rect.top >= -50 && rect.top < window.innerHeight / 2 && currentIdx === -1) {
                currentIdx = i;
            }
        });

        if (currentIdx === -1) currentIdx = 0;

        let nextIdx;
        if (e.key === 'ArrowDown') {
            nextIdx = Math.min(currentIdx + 1, allSections.length - 1);
        } else {
            nextIdx = Math.max(currentIdx - 1, 0);
        }

        allSections[nextIdx].scrollIntoView({ behavior: 'smooth' });
        e.preventDefault();
    });

    // =============================================
    // Init complete
    // =============================================
    onScroll();
});
