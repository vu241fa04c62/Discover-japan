/* =============================================
   DISCOVER JAPAN — Advanced Scroll Effects
   + Cherry Blossom Particles + Real Map
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ===== CHERRY BLOSSOM PARTICLE SYSTEM =====
  const canvas = document.getElementById('sakuraCanvas');
  const ctx = canvas.getContext('2d');
  let petals = [];
  let animFrameId;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Petal {
    constructor() {
      this.reset();
      this.y = Math.random() * canvas.height * -1;
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = -20;
      this.size = Math.random() * 8 + 4;
      this.speedY = Math.random() * 1.2 + 0.4;
      this.speedX = Math.random() * 0.8 - 0.4;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.03;
      this.opacity = Math.random() * 0.4 + 0.15;
      this.swingAmplitude = Math.random() * 2 + 1;
      this.swingSpeed = Math.random() * 0.02 + 0.01;
      this.time = Math.random() * 100;
    }

    update() {
      this.time += this.swingSpeed;
      this.y += this.speedY;
      this.x += this.speedX + Math.sin(this.time) * this.swingAmplitude * 0.3;
      this.rotation += this.rotationSpeed;

      if (this.y > canvas.height + 20) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.opacity;

      // Draw petal shape
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(
        this.size * 0.3, -this.size * 0.5,
        this.size, -this.size * 0.3,
        this.size, 0
      );
      ctx.bezierCurveTo(
        this.size, this.size * 0.3,
        this.size * 0.3, this.size * 0.5,
        0, 0
      );

      const gradient = ctx.createRadialGradient(this.size * 0.5, 0, 0, this.size * 0.5, 0, this.size);
      gradient.addColorStop(0, 'rgba(255, 183, 197, 0.9)');
      gradient.addColorStop(1, 'rgba(255, 145, 164, 0.6)');
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.restore();
    }
  }

  // Create petals
  const PETAL_COUNT = 25;
  for (let i = 0; i < PETAL_COUNT; i++) {
    petals.push(new Petal());
  }

  function animatePetals() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach(petal => {
      petal.update();
      petal.draw();
    });
    animFrameId = requestAnimationFrame(animatePetals);
  }

  animatePetals();

  // ===== STICKY NAV =====
  const nav = document.getElementById('nav');

  function handleNavScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 80);
  }

  // ===== PARALLAX EFFECTS =====
  const heroBgImg = document.getElementById('heroBgImg');
  const heroHinomaru = document.getElementById('heroHinomaru');
  const heroContent = document.getElementById('heroContent');
  const festivalBg = document.getElementById('festivalBg');

  function handleParallax() {
    const scrollY = window.scrollY;
    const vh = window.innerHeight;

    // Hero parallax
    if (scrollY < vh * 1.5) {
      if (heroBgImg) heroBgImg.style.transform = `translateY(${scrollY * 0.35}px) scale(1.15)`;
      if (heroHinomaru) {
        heroHinomaru.style.transform = `translateX(-50%) translateY(${scrollY * 0.25}px) scale(${1 + scrollY * 0.0004})`;
        heroHinomaru.style.opacity = Math.max(0, 0.2 - (scrollY / vh) * 0.25);
      }
      if (heroContent) {
        heroContent.style.transform = `translateY(${scrollY * 0.15}px)`;
        heroContent.style.opacity = Math.max(0, 1 - (scrollY / vh) * 1.2);
      }
    }

    // Festival parallax
    if (festivalBg) {
      const section = document.getElementById('festivals');
      if (section) {
        const rect = section.getBoundingClientRect();
        if (rect.top < vh && rect.bottom > 0) {
          const progress = (vh - rect.top) / (vh + rect.height);
          festivalBg.style.transform = `translateY(${-progress * 100}px)`;
        }
      }
    }
  }

  // ===== SCROLL REVEAL OBSERVER =====
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ===== SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const navH = nav.offsetHeight;
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - navH,
          behavior: 'smooth'
        });
      }
    });
  });

  // ===== REAL INTERACTIVE MAP (Leaflet) =====
  const mapContainer = document.getElementById('japanMap');
  if (mapContainer && typeof L !== 'undefined') {
    const map = L.map('japanMap', {
      center: [36.2, 138.2],
      zoom: 6,
      scrollWheelZoom: false,
      zoomControl: true
    });

    // Use a beautiful map tile
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
      maxZoom: 19
    }).addTo(map);

    // Custom red marker
    const redIcon = L.divIcon({
      html: '<div style="width:14px;height:14px;background:#c53d3d;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 8px rgba(197,61,61,0.5);"></div>',
      className: '',
      iconSize: [14, 14],
      iconAnchor: [7, 7],
      popupAnchor: [0, -12]
    });

    const goldIcon = L.divIcon({
      html: '<div style="width:12px;height:12px;background:#d4a843;border-radius:50%;border:2px solid #fff;box-shadow:0 2px 8px rgba(212,168,67,0.5);"></div>',
      className: '',
      iconSize: [12, 12],
      iconAnchor: [6, 6],
      popupAnchor: [0, -10]
    });

    // Major city markers
    const locations = [
      { lat: 35.6762, lng: 139.6503, name: 'Tokyo', desc: 'The world\'s largest metropolis — neon lights, Michelin stars, and ancient shrines.', icon: redIcon },
      { lat: 35.0116, lng: 135.7681, name: 'Kyoto', desc: '2,000+ temples and shrines. Japan\'s ancient cultural capital.', icon: redIcon },
      { lat: 34.6937, lng: 135.5023, name: 'Osaka', desc: 'Japan\'s Kitchen — the ultimate street food destination.', icon: redIcon },
      { lat: 34.8394, lng: 134.6939, name: 'Himeji', desc: 'Home to Japan\'s most spectacular feudal castle.', icon: goldIcon },
      { lat: 35.3606, lng: 138.7274, name: 'Mt. Fuji', desc: 'Japan\'s sacred 3,776m icon — visible from Tokyo on clear days.', icon: goldIcon },
      { lat: 43.0618, lng: 141.3545, name: 'Sapporo', desc: 'Hokkaido\'s capital — famous for its Snow Festival and ramen.', icon: goldIcon },
      { lat: 34.3963, lng: 132.4596, name: 'Hiroshima', desc: 'A city of peace, resilience, and the iconic Itsukushima Shrine.', icon: goldIcon },
      { lat: 35.1815, lng: 136.9066, name: 'Nagoya', desc: 'Central Japan hub — home to Toyota and Nagoya Castle.', icon: goldIcon },
      { lat: 26.3344, lng: 127.8056, name: 'Okinawa', desc: 'Subtropical paradise — crystal waters, coral reefs, and unique Ryukyu culture.', icon: goldIcon }
    ];

    locations.forEach(loc => {
      L.marker([loc.lat, loc.lng], { icon: loc.icon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family:'Inter',sans-serif;min-width:180px;padding:4px">
            <h4 style="font-family:'Playfair Display',serif;font-size:1.1rem;margin:0 0 6px;color:#1a1a2e">${loc.name}</h4>
            <p style="font-size:0.78rem;margin:0;color:#555;line-height:1.5">${loc.desc}</p>
          </div>
        `);
    });
  }

  // ===== CONTACT FORM =====
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('.btn-submit');
      const original = btn.innerHTML;
      btn.innerHTML = '<span>Message Sent! ✓</span>';
      btn.style.background = 'linear-gradient(135deg, #2d8a4e, #1e6b38)';
      setTimeout(() => {
        btn.innerHTML = original;
        btn.style.background = '';
        contactForm.reset();
      }, 2500);
    });
  }

  // ===== OPTIMIZED SCROLL HANDLER =====
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        handleNavScroll();
        handleParallax();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // ===== INITIAL STATE =====
  handleNavScroll();
  handleParallax();

  // Hero entrance
  if (heroContent) {
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateY(40px)';
    heroContent.style.transition = 'opacity 1.4s cubic-bezier(0.4,0,0.2,1), transform 1.4s cubic-bezier(0.4,0,0.2,1)';
    setTimeout(() => {
      heroContent.style.opacity = '1';
      heroContent.style.transform = 'translateY(0)';
    }, 300);
  }
});
