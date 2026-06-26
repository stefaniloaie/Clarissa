// ===== Preloader =====
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  setTimeout(() => {
    preloader.classList.add('hidden');
  }, 800);
});

// ===== Navbar Scroll =====
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('.section, .hero');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  // Navbar background
  if (scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active link tracking
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (scrollY >= sectionTop) {
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

// ===== Mobile Menu =====
const hamburger = document.getElementById('hamburger');
const navLinksContainer = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinksContainer.classList.toggle('active');
});

navLinksContainer.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinksContainer.classList.remove('active');
  });
});

// ===== Hero Slider =====
const heroSlides = document.querySelectorAll('.hero-slide');
const heroDots = document.querySelectorAll('.hero-dot');
let currentSlide = 0;
let slideInterval;

function goToSlide(index) {
  heroSlides.forEach(slide => slide.classList.remove('active'));
  heroDots.forEach(dot => dot.classList.remove('active'));
  currentSlide = index;
  heroSlides[currentSlide].classList.add('active');
  heroDots[currentSlide].classList.add('active');
}

function nextSlide() {
  const next = (currentSlide + 1) % heroSlides.length;
  goToSlide(next);
}

function startSlider() {
  slideInterval = setInterval(nextSlide, 6000);
}

function resetSlider() {
  clearInterval(slideInterval);
  startSlider();
}

heroDots.forEach(dot => {
  dot.addEventListener('click', () => {
    const slideIndex = parseInt(dot.dataset.slide);
    goToSlide(slideIndex);
    resetSlider();
  });
});

startSlider();

// ===== Gallery Filtering =====
const filterBtns = document.querySelectorAll('.gallery-filters button');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    galleryItems.forEach(item => {
      if (filter === 'all' || item.dataset.category === filter) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

// ===== Lightbox =====
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
let lightboxIndex = 0;
const galleryImages = [];

galleryItems.forEach((item, index) => {
  const img = item.querySelector('img');
  galleryImages.push(img.src);

  item.addEventListener('click', () => {
    lightboxIndex = index;
    openLightbox();
  });
});

function openLightbox() {
  lightboxImg.src = galleryImages[lightboxIndex];
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

function prevLightbox() {
  lightboxIndex = (lightboxIndex - 1 + galleryImages.length) % galleryImages.length;
  lightboxImg.src = galleryImages[lightboxIndex];
}

function nextLightbox() {
  lightboxIndex = (lightboxIndex + 1) % galleryImages.length;
  lightboxImg.src = galleryImages[lightboxIndex];
}

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', prevLightbox);
lightboxNext.addEventListener('click', nextLightbox);

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') prevLightbox();
  if (e.key === 'ArrowRight') nextLightbox();
});

// ===== Testimonials Carousel =====
const track = document.getElementById('testimonialsTrack');
const testimonialPrev = document.getElementById('testimonialPrev');
const testimonialNext = document.getElementById('testimonialNext');
let testimonialIndex = 0;
const totalTestimonials = document.querySelectorAll('.testimonial-card').length;

function updateTestimonial() {
  track.style.transform = `translateX(-${testimonialIndex * 100}%)`;
}

testimonialPrev.addEventListener('click', () => {
  testimonialIndex = (testimonialIndex - 1 + totalTestimonials) % totalTestimonials;
  updateTestimonial();
});

testimonialNext.addEventListener('click', () => {
  testimonialIndex = (testimonialIndex + 1) % totalTestimonials;
  updateTestimonial();
});

// ===== Scroll Reveal =====
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// ===== Stats Counter Animation =====
const statNumbers = document.querySelectorAll('.stat-number');
let statsAnimated = false;

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !statsAnimated) {
      statsAnimated = true;
      animateStats();
    }
  });
}, { threshold: 0.5 });

const statsSection = document.getElementById('stats');
if (statsSection) statsObserver.observe(statsSection);

function animateStats() {
  statNumbers.forEach(stat => {
    const target = parseFloat(stat.dataset.target);
    const isDecimal = stat.dataset.decimal === 'true';
    const suffix = stat.dataset.suffix || '';
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (target - start) * eased;

      if (isDecimal) {
        stat.textContent = current.toFixed(1);
      } else {
        stat.textContent = Math.floor(current) + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        if (isDecimal) {
          stat.textContent = target.toFixed(1);
        } else {
          stat.textContent = target + suffix;
        }
      }
    }

    requestAnimationFrame(update);
  });
}

// ===== Contact Form =====
const reservationForm = document.getElementById('reservationForm');
const formSuccess = document.getElementById('formSuccess');

reservationForm.addEventListener('submit', (e) => {
  e.preventDefault();

  reservationForm.style.display = 'none';
  formSuccess.classList.add('show');

  setTimeout(() => {
    formSuccess.classList.remove('show');
    reservationForm.style.display = 'block';
    reservationForm.reset();
  }, 3000);
});
