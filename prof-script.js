// Simple Academic CV — Minimal JS
document.addEventListener('DOMContentLoaded', () => {

    // Navigation
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    const mobileNavLinks = mobileNav ? mobileNav.querySelectorAll('a') : [];

    // Scroll spy
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 100) {
                current = sec.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + current);
        });
    }, { passive: true });

    // Smooth scroll
    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Mobile menu
    let mobileOpen = false;
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileOpen = !mobileOpen;
            mobileNav.classList.toggle('open', mobileOpen);
            mobileMenuBtn.innerHTML = mobileOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
            document.body.style.overflow = mobileOpen ? 'hidden' : '';
        });
    }

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            mobileOpen = false;
            mobileNav.classList.remove('open');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.style.overflow = '';
            const target = document.querySelector(link.getAttribute('href'));
            if (target) setTimeout(() => target.scrollIntoView({ behavior: 'smooth' }), 150);
        });
    });

    // Publication filters
    const filterBtns = document.querySelectorAll('.pub-filter-btn');
    const pubItems = document.querySelectorAll('.pub-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const year = btn.getAttribute('data-year');
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            pubItems.forEach(item => {
                const match = year === 'all' || item.getAttribute('data-year') === year;
                item.classList.toggle('hidden', !match);
            });
        });
    });
});
