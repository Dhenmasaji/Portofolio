const menuToggle = document.querySelector("#menuToggle");
const navLinks = document.querySelector("#navLinks");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

document.querySelectorAll("[data-placeholder]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const channel = link.dataset.placeholder;
    const labels = {
      email: "Add your email address in index.html",
      linkedin: "Add your LinkedIn profile URL in index.html",
      github: "Add your GitHub profile URL in index.html"
    };
    window.alert(labels[channel] || "Update this contact link in index.html.");
  });
});

const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

/* enhance.js — letakkan SETELAH script.js (atau di <head> dengan defer) */
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const nav = document.querySelector('.nav-links');
  const toggle = document.getElementById('menuToggle');

  /* 1. Menu mobile — menggantikan handler lama agar tidak bentrok */
  if (toggle && nav) {
    document.addEventListener('click', e => {
      if (e.target.closest('#menuToggle')) {
        e.stopPropagation();
        const open = nav.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', open);
      } else if (e.target.closest('.nav-links a')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    }, true);
  }

  /* 2. Indikator geser di navbar */
  const links = [...document.querySelectorAll('.nav-links a:not(.nav-contact)')];
  const ind = document.createElement('span');
  ind.className = 'nav-indicator';
  nav.prepend(ind);
  const moveTo = a => {
    if (!a) { ind.style.opacity = 0; return; }
    ind.style.opacity = 1;
    ind.style.width = a.offsetWidth + 'px';
    ind.style.transform = `translateX(${a.offsetLeft}px)`;
  };
  let current = null;
  links.forEach(a => {
    a.addEventListener('mouseenter', () => moveTo(a));
    a.addEventListener('mouseleave', () => moveTo(current));
  });
  const sections = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const spy = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    current = links.find(a => a.getAttribute('href') === '#' + e.target.id);
    links.forEach(a => a.classList.toggle('active', a === current));
    moveTo(current);
  }), { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => spy.observe(s));
  window.addEventListener('resize', () => moveTo(current));

  /* 3. Progress bar, navbar berubah saat scroll, sembunyi saat scroll turun */
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.appendChild(bar);
  let lastY = 0;
  addEventListener('scroll', () => {
    const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    header.classList.toggle('scrolled', y > 30);
    header.classList.toggle('hide', y > lastY && y > 400 && !nav.classList.contains('is-open'));
    lastY = y;
  }, { passive: true });

  /* 4. Scroll reveal */
  const targets = [
    ['.section-heading', ''], ['.about-copy', 'from-left'], ['.principle-card', 'from-right'],
    ['.skill-panel', ''], ['.timeline-item', 'from-left'], ['.project-card', ''],
    ['.education-card', ''], ['.achievement-strip', ''], ['.contact-grid > *', ''],
    ['.section-intro', ''], ['.marquee', '']
  ];
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .15 });
  targets.forEach(([sel, dir]) => document.querySelectorAll(sel).forEach((el, i) => {
    el.classList.add('reveal');
    if (dir) el.classList.add(dir);
    el.style.setProperty('--d', (i % 4) * 0.09 + 's');
    io.observe(el);
  }));

  /* 5. Marquee: gandakan isi agar loop mulus */
  document.querySelectorAll('.marquee').forEach(m => {
    const track = m.querySelector('.marquee-track');
    const clone = track.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    m.appendChild(clone);
    if (m.dataset.speed) m.style.setProperty('--speed', m.dataset.speed + 's');
  });

  /* 6. Spotlight mengikuti kursor pada kartu */
  document.querySelectorAll('.skill-panel,.project-card,.principle-card,.education-card').forEach(c => {
    c.classList.add('card-glow');
    c.addEventListener('pointermove', e => {
      const r = c.getBoundingClientRect();
      c.style.setProperty('--mx', e.clientX - r.left + 'px');
      c.style.setProperty('--my', e.clientY - r.top + 'px');
    });
  });

  /* 7. Tilt halus pada kartu proyek (desktop saja) */
  if (matchMedia('(hover:hover)').matches && !matchMedia('(prefers-reduced-motion:reduce)').matches) {
    document.querySelectorAll('.project-card').forEach(c => {
      c.addEventListener('pointermove', e => {
        const r = c.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        c.style.transform = `perspective(900px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-6px)`;
      });
      c.addEventListener('pointerleave', () => c.style.transform = '');
    });
  }

  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();
});

  /* 8. Tombol dummy: tampilkan notifikasi, jangan lompat ke atas */
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  document.body.appendChild(toast);
  let toastTimer;
  document.addEventListener('click', e => {
    const btn = e.target.closest('.is-dummy');
    if (!btn) return;
    e.preventDefault();
    toast.textContent = 'Link belum tersedia, segera hadir.';
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
    
  });


  
const carousel = document.querySelector(".carousel");

if (carousel) {
  const slides = carousel.querySelectorAll(".slide");
  const dots = carousel.querySelectorAll(".dot");
  const prevBtn = carousel.querySelector(".prev");
  const nextBtn = carousel.querySelector(".next");

  let currentIndex = 0;
  let touchStartX = 0;

  function showSlide(index) {
    currentIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === currentIndex);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentIndex);
    });
  }

  prevBtn.addEventListener("click", () => {
    showSlide(currentIndex - 1);
  });

  nextBtn.addEventListener("click", () => {
    showSlide(currentIndex + 1);
  });

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => showSlide(i));
  });

  carousel.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].screenX;
  }, { passive: true });

  carousel.addEventListener("touchend", (event) => {
    const touchEndX = event.changedTouches[0].screenX;
    const distance = touchEndX - touchStartX;

    if (Math.abs(distance) > 50) {
      showSlide(currentIndex + (distance < 0 ? 1 : -1));
    }
  }, { passive: true });

  showSlide(0);
}

  
let currentDesignSlide = 0;

const designPreviewModal =
  document.getElementById("designPreviewModal");

const designPreviewTrack =
  document.getElementById("designPreviewTrack");

const designPreviewCounter =
  document.getElementById("designPreviewCounter");

const designPreviewDots =
  document.querySelectorAll(".design-preview-dot");

const totalDesignSlides = 4;

function openDesignPreview(event) {
  event.preventDefault();

  designPreviewModal.classList.add("active");
  document.body.style.overflow = "hidden";

  goToDesignSlide(0);
}

function closeDesignPreview() {
  designPreviewModal.classList.remove("active");
  document.body.style.overflow = "";
}

function changeDesignSlide(direction) {
  currentDesignSlide =
    (currentDesignSlide + direction + totalDesignSlides)
    % totalDesignSlides;

  updateDesignPreview();
}

function goToDesignSlide(index) {
  currentDesignSlide = index;
  updateDesignPreview();
}

function updateDesignPreview() {
  designPreviewTrack.style.transform =
    `translateX(-${currentDesignSlide * 100}%)`;

  designPreviewCounter.textContent =
    `${String(currentDesignSlide + 1).padStart(2, "0")} / ${String(totalDesignSlides).padStart(2, "0")}`;

  designPreviewDots.forEach((dot, index) => {
    dot.classList.toggle(
      "active",
      index === currentDesignSlide
    );
  });
}

// Close when clicking outside the card
designPreviewModal.addEventListener("click", function(event) {
  if (event.target === designPreviewModal) {
    closeDesignPreview();
  }
});

// Close using Escape key
document.addEventListener("keydown", function(event) {
  if (
    event.key === "Escape" &&
    designPreviewModal.classList.contains("active")
  ) {
    closeDesignPreview();
  }
});
