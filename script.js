/* ========================================
   PENSIUNEA CLARISIA - Premium Scripts
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ========================================
    // LOADER
    // ========================================
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.style.overflow = '';
            initHeroAnimations();
        }, 2200);
    });

    // Fallback hide loader after 4s
    setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
    }, 4000);

    // ========================================
    // (cursor effects removed)
    // ========================================

    // ========================================
    // HEADER & TOP BAR
    // ========================================
    const header = document.getElementById('header');
    const topBar = document.getElementById('topBar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        // Header background
        if (scrollY > 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Hide top bar on scroll
        if (scrollY > 50) {
            topBar.classList.add('hidden');
        } else {
            topBar.classList.remove('hidden');
        }

        lastScroll = scrollY;
    });

    // ========================================
    // MOBILE DRAWER
    // ========================================
    const hamburger = document.getElementById('hamburger');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const drawerClose = document.getElementById('drawerClose');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    function openDrawer() {
        hamburger.classList.add('active');
        mobileDrawer.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
        hamburger.classList.remove('active');
        mobileDrawer.classList.remove('active');
        document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', () => {
        if (mobileDrawer.classList.contains('active')) {
            closeDrawer();
        } else {
            openDrawer();
        }
    });

    drawerClose.addEventListener('click', closeDrawer);
    mobileDrawer.querySelector('.mobile-drawer-overlay').addEventListener('click', closeDrawer);
    mobileLinks.forEach(link => link.addEventListener('click', closeDrawer));

    // ========================================
    // HERO SLIDER
    // ========================================
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    let currentSlide = 0;
    let slideInterval;

    function goToSlide(index) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        currentSlide = index;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        goToSlide((currentSlide + 1) % slides.length);
    }

    function startSlider() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            clearInterval(slideInterval);
            goToSlide(parseInt(dot.dataset.slide));
            startSlider();
        });
    });

    startSlider();

    // ========================================
    // HERO ANIMATIONS
    // ========================================
    function initHeroAnimations() {
        const reveals = document.querySelectorAll('.hero-content .animate-reveal');
        reveals.forEach((el, i) => {
            setTimeout(() => {
                el.classList.add('visible');
            }, i * 200 + 300);
        });
    }

    // ========================================
    // SCROLL ANIMATIONS
    // ========================================
    const animatedElements = document.querySelectorAll('[data-animate]');

    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animation for grid items
                const parent = entry.target.parentElement;
                const siblings = parent ? Array.from(parent.querySelectorAll('[data-animate]')) : [];
                const idx = siblings.indexOf(entry.target);
                const delay = idx >= 0 ? idx * 100 : 0;

                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, Math.min(delay, 600));

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));

    // ========================================
    // COUNTER ANIMATION
    // ========================================
    const counters = document.querySelectorAll('.stat-number');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseFloat(el.dataset.count);
                const isDecimal = el.dataset.decimal === 'true';
                const duration = 2000;
                const start = performance.now();

                function update(now) {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 4); // easeOutQuart

                    if (isDecimal) {
                        el.textContent = (target * eased).toFixed(1);
                    } else {
                        el.textContent = Math.floor(target * eased);
                    }

                    if (progress < 1) {
                        requestAnimationFrame(update);
                    } else {
                        el.textContent = isDecimal ? target.toFixed(1) : target;
                    }
                }

                requestAnimationFrame(update);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    // ========================================
    // GALLERY
    // ========================================
    const galleryItems = document.querySelectorAll('.gallery-item');

    // ========================================
    // LIGHTBOX
    // ========================================
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCounter = document.getElementById('lightboxCounter');
    let lightboxIndex = 0;
    let visibleImages = [];

    function getVisibleImages() {
        return Array.from(document.querySelectorAll('.gallery-item:not(.hidden) img'));
    }

    function openLightbox(index) {
        visibleImages = getVisibleImages();
        lightboxIndex = index;
        lightboxImg.src = visibleImages[lightboxIndex].src;
        lightboxCounter.textContent = `${lightboxIndex + 1} / ${visibleImages.length}`;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function lightboxPrev() {
        lightboxIndex = (lightboxIndex - 1 + visibleImages.length) % visibleImages.length;
        lightboxImg.src = visibleImages[lightboxIndex].src;
        lightboxCounter.textContent = `${lightboxIndex + 1} / ${visibleImages.length}`;
    }

    function lightboxNext() {
        lightboxIndex = (lightboxIndex + 1) % visibleImages.length;
        lightboxImg.src = visibleImages[lightboxIndex].src;
        lightboxCounter.textContent = `${lightboxIndex + 1} / ${visibleImages.length}`;
    }

    galleryItems.forEach((item) => {
        item.addEventListener('click', () => {
            const imgs = getVisibleImages();
            const img = item.querySelector('img');
            const idx = imgs.indexOf(img);
            if (idx >= 0) openLightbox(idx);
        });
    });

    document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    document.querySelector('.lightbox-prev').addEventListener('click', lightboxPrev);
    document.querySelector('.lightbox-next').addEventListener('click', lightboxNext);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-img-wrapper')) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') lightboxPrev();
        if (e.key === 'ArrowRight') lightboxNext();
    });

    // Touch swipe for lightbox
    let touchStartX = 0;
    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    lightbox.addEventListener('touchend', (e) => {
        const diff = e.changedTouches[0].screenX - touchStartX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) lightboxPrev();
            else lightboxNext();
        }
    });

    // ========================================
    // TILT EFFECT ON ROOM CARDS
    // ========================================
    // ========================================
    // ROOM CARDS HOVER LIFT
    // ========================================
    if (window.innerWidth > 992) {
        const tiltCards = document.querySelectorAll('[data-tilt]');
        tiltCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px)';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // ========================================
    // PARALLAX EFFECT
    // ========================================
    const parallaxImages = document.querySelectorAll('.parallax-img');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        parallaxImages.forEach(img => {
            const rect = img.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const speed = 0.05;
                const yPos = (rect.top - window.innerHeight / 2) * speed;
                img.style.transform = `translateY(${yPos}px)`;
            }
        });
    });

    // ========================================
    // TESTIMONIALS AUTO-SCROLL (duplicate cards for infinite loop)
    // ========================================
    const track = document.getElementById('testimonialTrack');
    if (track) {
        const cards = track.innerHTML;
        track.innerHTML = cards + cards; // Duplicate for seamless loop
    }

    // ========================================
    // SMOOTH SCROLL FOR NAV LINKS
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ========================================
    // CONTACT FORM
    // ========================================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalHTML = btn.innerHTML;
            const reservationEmail = 'danemilian.strugar@gmail.com';
            const roomTypeLabels = {
                matrimoniala: 'Matrimonială - 250 RON',
                familie: 'Cameră de familie - 300 RON'
            };
            const name = contactForm.querySelector('#name').value.trim();
            const email = contactForm.querySelector('#email').value.trim();
            const phone = contactForm.querySelector('#phone').value.trim();
            const roomType = contactForm.querySelector('#roomType').value;
            const checkin = contactForm.querySelector('#checkin').value;
            const checkout = contactForm.querySelector('#checkout').value;
            const message = contactForm.querySelector('#message').value.trim();
            const roomLabel = roomTypeLabels[roomType] || roomType;
            const subject = encodeURIComponent(`Cerere rezervare - ${name}`);
            const body = encodeURIComponent(
                [
                    'Bună ziua,',
                    '',
                    'Doresc o rezervare la Pensiunea Clarisia:',
                    `- Nume: ${name}`,
                    `- Email: ${email}`,
                    `- Telefon: ${phone}`,
                    `- Tip cameră: ${roomLabel}`,
                    `- Check-in: ${checkin}`,
                    `- Check-out: ${checkout}`,
                    `- Mesaj: ${message || '-'}`,
                    '',
                    'Mulțumesc!'
                ].join('\n')
            );
            const mailtoUrl = `mailto:${reservationEmail}?subject=${subject}&body=${body}`;
            btn.innerHTML = '<span>Se deschide emailul... ✓</span>';
            btn.style.background = '#1a3a1a';
            btn.disabled = true;
            window.location.href = mailtoUrl;

            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.background = '';
                btn.disabled = false;
            }, 3000);
        });
    }

});

// ===== GDPR Cookie Consent =====
(function() {
    const banner = document.getElementById('gdprBanner');
    const acceptBtn = document.getElementById('gdprAccept');
    const rejectBtn = document.getElementById('gdprReject');
    const privacyModal = document.getElementById('privacyModal');
    const privacyClose = document.getElementById('privacyClose');
    const openPrivacyLinks = [document.getElementById('openPrivacy'), document.getElementById('footerPrivacy')];

    if (!localStorage.getItem('gdpr_consent')) {
        setTimeout(() => banner.classList.add('show'), 1500);
    }

    acceptBtn.addEventListener('click', () => {
        localStorage.setItem('gdpr_consent', 'accepted');
        banner.classList.remove('show');
    });

    rejectBtn.addEventListener('click', () => {
        localStorage.setItem('gdpr_consent', 'rejected');
        banner.classList.remove('show');
    });

    openPrivacyLinks.forEach(link => {
        if (link) link.addEventListener('click', (e) => {
            e.preventDefault();
            privacyModal.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    });

    privacyClose.addEventListener('click', () => {
        privacyModal.classList.remove('show');
        document.body.style.overflow = '';
    });

    privacyModal.addEventListener('click', (e) => {
        if (e.target === privacyModal) {
            privacyModal.classList.remove('show');
            document.body.style.overflow = '';
        }
    });
})();
