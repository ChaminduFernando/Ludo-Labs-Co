// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// --- LENIS SMOOTH SCROLL ---
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  touchMultiplier: 2
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);


// --- CUSTOM CURSOR ---
const cursor = document.getElementById('proj-cursor');
let mouseX = 0, mouseY = 0;
let curX = 0, curY = 0;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

gsap.ticker.add(() => {
  curX += (mouseX - curX) * 0.12;
  curY += (mouseY - curY) * 0.12;
  if (cursor) gsap.set(cursor, { x: curX, y: curY });
});

// Cursor hover rules
document.querySelectorAll('a, button, .rw-item, .proj-scroll-item, .service-item, .detail-back, .logo-3d-card, .team-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    if (cursor) gsap.to(cursor, { scale: 1.2, backgroundColor: '#ffffff', mixBlendMode: 'difference', duration: 0.2 });
  });
  el.addEventListener('mouseleave', () => {
    if (cursor) {
      gsap.to(cursor, { scale: 0, backgroundColor: '#ff5a00', mixBlendMode: 'normal', duration: 0.2 });
      cursor.innerText = 'SEE PROJECT';
    }
  });
});


// --- PRELOADER (homepage only) ---
window.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('name-layer')) return;

  const tl = gsap.timeline();

  gsap.set(['#preloader-udo', '#preloader-labs', '#preloader-co'], { opacity: 0, y: 80 });
  gsap.set('#preloader-logo', { scale: 0.8, rotate: -5 });
  gsap.set('#hero-tagline', { opacity: 0, y: 30 });
  gsap.set(['.hero-name-ludo', '.hero-name-labs'], { opacity: 0, y: 100 });
  gsap.set('#hero-line', { scaleX: 0 });
  gsap.set('.hero-bar-left, .hero-bar-center, .hero-bar-right', { opacity: 0, y: 15 });

  tl.to('#preloader-logo', { scale: 1, rotate: 0, duration: 0.8, ease: 'power3.out' });
  tl.to(['#preloader-udo', '#preloader-labs', '#preloader-co'], { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'back.out(1.7)' }, '-=0.3');
  tl.to('#preloader-dot', { scale: 1.4, color: '#ffffff', duration: 0.3, yoyo: true, repeat: 1 });
  tl.to('#name-layer', { yPercent: -100, duration: 0.9, ease: 'power4.inOut', delay: 0.4 });
  tl.to('#hero-tagline', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.4');
  tl.to(['.hero-name-ludo', '.hero-name-labs'], { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out' }, '-=0.6');
  tl.to('#hero-line', { scaleX: 1, transformOrigin: 'left center', duration: 0.8, ease: 'power2.out' }, '-=0.6');
  tl.to('.hero-bar-left, .hero-bar-center, .hero-bar-right', { opacity: 1, y: 0, stagger: 0.08, duration: 0.7, ease: 'power2.out' }, '-=0.5');
});


// --- HERO AURA BACKDROP (animated breathing background) ---
window.addEventListener('mousemove', (e) => {
  if (!document.querySelector('.aura-1')) return;
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;
  gsap.to('.aura-1', { x: (x - 0.5) * 80, y: (y - 0.5) * 80, duration: 1.5, ease: 'power2.out' });
  gsap.to('.aura-2', { x: (0.5 - x) * 100, y: (0.5 - y) * 100, duration: 1.5, ease: 'power2.out' });
  gsap.to('.aura-3', { x: (x - 0.5) * 50, y: (y - 0.5) * 50, duration: 1.5, ease: 'power2.out' });
});

if (document.querySelector('.aura-1')) {
  // Continuous breathing rotation
  gsap.to('.aura-1', { rotation: 360, duration: 22, repeat: -1, ease: 'none' });
  gsap.to('.aura-2', { rotation: -360, duration: 30, repeat: -1, ease: 'none' });
  // Pulsing scale to make it feel alive
  gsap.to('.aura-1', { scale: 1.18, duration: 4.5, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  gsap.to('.aura-2', { scale: 1.12, duration: 6, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1 });
}


// --- 3D TILTING LOGO CARD (Info page) ---
const logoCard = document.getElementById('logo-3d-card');
if (logoCard) {
  logoCard.addEventListener('mousemove', (e) => {
    const rect = logoCard.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    gsap.to(logoCard, {
      rotateX: ((y - cy) / cy) * -14,
      rotateY: ((x - cx) / cx) * 14,
      duration: 0.15,
      ease: 'power1.out'
    });
    logoCard.style.setProperty('--glow-x', `${(x / rect.width) * 100}%`);
    logoCard.style.setProperty('--glow-y', `${(y / rect.height) * 100}%`);
  });
  logoCard.addEventListener('mouseleave', () => {
    gsap.to(logoCard, { rotateX: 0, rotateY: 0, duration: 0.5, ease: 'power3.out' });
  });
}


// --- FLOATING PREVIEW ENGINE ---
const preview = document.getElementById('proj-preview');
const previewCover = document.getElementById('proj-cover');
const previewDate = document.getElementById('proj-date');

if (preview) {
  preview.style.display = 'none';
  gsap.ticker.add(() => {
    if (preview.style.display === 'block') {
      gsap.set(preview, { x: mouseX + 25, y: mouseY + 25 });
    }
  });
}

function showPreview(imgUrl, date) {
  if (!preview || !previewCover) return;
  if (previewCover) previewCover.src = imgUrl;
  if (previewDate) previewDate.innerText = date;
  preview.style.display = 'block';
  gsap.fromTo(preview, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' });
}

function hidePreview() {
  if (!preview) return;
  gsap.to(preview, { opacity: 0, scale: 0.92, duration: 0.25, onComplete: () => { preview.style.display = 'none'; } });
}


// --- SERVICES HOVER (cursor changes) ---
document.querySelectorAll('.service-item').forEach(item => {
  item.addEventListener('mouseenter', () => {
    if (cursor) {
      cursor.innerText = 'DISCOVER';
      cursor.classList.add('discover-active');
      gsap.to(cursor, { scale: 1, duration: 0.2 });
    }
  });
  item.addEventListener('mouseleave', () => {
    if (cursor) {
      cursor.innerText = 'SEE PROJECT';
      cursor.classList.remove('discover-active');
      gsap.to(cursor, { scale: 0, duration: 0.2 });
    }
  });
});


// --- RECENT WORKS LIST HOVER PREVIEW (homepage .rw-item) ---
document.querySelectorAll('.rw-item').forEach(item => {
  const imgUrl = item.getAttribute('data-img');
  const date = item.getAttribute('data-date');

  item.addEventListener('mouseenter', () => {
    showPreview(imgUrl, date);
    if (cursor) {
      cursor.innerText = 'VIEW';
      gsap.to(cursor, { scale: 1, duration: 0.2 });
    }
  });

  item.addEventListener('mouseleave', () => {
    hidePreview();
  });
});


// --- WORKS PAGE LIST HOVER PREVIEW (.proj-scroll-item on works page) ---
document.querySelectorAll('.proj-scroll-item').forEach(item => {
  const imgUrl = item.getAttribute('data-img');
  const date = item.getAttribute('data-date');

  item.addEventListener('mouseenter', () => {
    showPreview(imgUrl, date);
    if (cursor) {
      cursor.innerText = 'VIEW';
      gsap.to(cursor, { scale: 1, duration: 0.2 });
    }
  });

  item.addEventListener('mouseleave', () => {
    hidePreview();
  });
});


// --- SCROLL PROGRESS SIDEBAR ---
window.addEventListener('scroll', () => {
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (docHeight > 0) {
    const pct = Math.min(100, Math.max(0, Math.round((window.pageYOffset / docHeight) * 100)));
    const pctElem = document.getElementById('scroll-pct');
    const barElem = document.getElementById('st-bar');
    if (pctElem) pctElem.innerText = `(${pct})`;
    if (barElem) barElem.style.height = `${pct}%`;
  }

  // Active section name on homepage
  if (document.getElementById('hero')) {
    const sections = [
      { id: 'hero', label: 'HERO' },
      { id: 'about', label: 'ABOUT' },
      { id: 'services', label: 'SERVICES' },
      { id: 'recent-works', label: 'WORKS' },
      { id: 'footer', label: 'CONTACT' }
    ];
    let activeLabel = 'HERO';
    const scrollPos = window.pageYOffset + window.innerHeight * 0.4;
    for (const sec of sections) {
      const el = document.getElementById(sec.id);
      if (el && scrollPos >= el.offsetTop) activeLabel = sec.label;
    }
    const stLabel = document.getElementById('st-label');
    if (stLabel && stLabel.innerText !== activeLabel) stLabel.innerText = activeLabel;
  }
});


// --- LIGHTBOX ZOOM MODAL ---
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');

function openLightbox(src) {
  if (lightbox && lightboxImg) {
    lightboxImg.src = src;
    lightbox.classList.add('open');
  }
}

if (lightboxClose) lightboxClose.addEventListener('click', () => lightbox.classList.remove('open'));
if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) lightbox.classList.remove('open');
  });
}


// --- PROJECT DETAIL PANEL ---
const isSubpage = window.location.pathname.includes('/works/') ||
                  window.location.pathname.includes('/info/') ||
                  window.location.pathname.includes('/contact/');

const getAssetPath = (path) => isSubpage ? '../' + path : path;

const projectGalleries = {
  hypermotion: ['assets/hypermotion.png', 'assets/kuro.png', 'assets/aether.png'],
  kuro:        ['assets/kuro.png', 'assets/aether.png', 'assets/hypermotion.png'],
  aether:      ['assets/aether.png', 'assets/hypermotion.png', 'assets/kuro.png']
};

const detailPanel = document.getElementById('project-detail');
const detailBack  = document.getElementById('detail-back');
const darkPanel   = document.getElementById('t-panel-dark');
const orangePanel = document.getElementById('t-panel-orange');

function openDetailPanel(id, title, date, desc, tags, imgUrl) {
  if (!detailPanel) return;

  const detailTitleElem = document.getElementById('detail-title');
  const detailYearElem  = document.getElementById('detail-year');
  const detailDescElem  = document.getElementById('detail-desc');
  const tagsContainer   = document.getElementById('detail-tags');
  const graphicContainer = document.getElementById('detail-selected');
  const thumbnailsCol   = document.getElementById('detail-thumbnails-col');

  if (detailTitleElem) detailTitleElem.innerText = title;
  if (detailYearElem)  detailYearElem.innerText  = `(${date})`;
  if (detailDescElem)  detailDescElem.innerText  = desc;

  if (tagsContainer) {
    tagsContainer.innerHTML = '';
    tags.split(',').forEach(tag => {
      const span = document.createElement('span');
      span.classList.add('detail-tag');
      span.innerText = tag.trim();
      tagsContainer.appendChild(span);
    });
  }

  if (graphicContainer) {
    graphicContainer.innerHTML = `<img src="${imgUrl}" alt="${title}" id="detail-selected-img" style="cursor:zoom-in;">`;
    const mainImg = document.getElementById('detail-selected-img');
    if (mainImg) mainImg.addEventListener('click', () => openLightbox(mainImg.src));
  }

  if (thumbnailsCol) {
    thumbnailsCol.innerHTML = '';
    const gallery = projectGalleries[id] || [imgUrl.replace(/^(\.\.\/)*/, '')];
    gallery.forEach((gPath, idx) => {
      const resolvedPath = getAssetPath(gPath);
      const thumbWrap = document.createElement('div');
      thumbWrap.classList.add('detail-thumb-item');
      if (idx === 0) thumbWrap.classList.add('active');
      thumbWrap.innerHTML = `<img src="${resolvedPath}" alt="Thumbnail ${idx + 1}">`;
      thumbWrap.addEventListener('click', () => {
        document.querySelectorAll('.detail-thumb-item').forEach(t => t.classList.remove('active'));
        thumbWrap.classList.add('active');
        const selectedImg = document.getElementById('detail-selected-img');
        if (selectedImg) {
          gsap.to(selectedImg, { opacity: 0, scale: 0.96, duration: 0.15, onComplete: () => {
            selectedImg.src = resolvedPath;
            gsap.to(selectedImg, { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' });
          }});
        }
      });
      thumbnailsCol.appendChild(thumbWrap);
    });
  }

  // Wipe transition in
  const wipe = gsap.timeline();
  wipe.to([darkPanel, orangePanel], { yPercent: -100, stagger: 0.1, duration: 0.6, ease: 'power3.inOut' });
  wipe.call(() => {
    detailPanel.classList.add('open');
    detailPanel.scrollTop = 0;
    lenis.stop();
  });
  wipe.to([orangePanel, darkPanel], { yPercent: -200, stagger: 0.08, duration: 0.6, ease: 'power3.inOut' });
  wipe.set([darkPanel, orangePanel], { yPercent: 100 });
  wipe.from('#detail-title-wrap, #detail-desc, #detail-tags, #detail-selected, #detail-thumbnails-col', {
    opacity: 0, y: 40, stagger: 0.08, duration: 0.6, ease: 'power2.out'
  }, '>-=0.2');
}

// Bind click to homepage recent works items
document.querySelectorAll('.rw-item').forEach(item => {
  item.addEventListener('click', () => {
    openDetailPanel(
      item.getAttribute('data-id'),
      item.querySelector('.rw-name').innerText,
      item.getAttribute('data-date'),
      item.getAttribute('data-desc'),
      item.getAttribute('data-tags'),
      item.getAttribute('data-img')
    );
  });
});

// Bind click to works page project list items
document.querySelectorAll('.proj-scroll-item').forEach(item => {
  item.addEventListener('click', () => {
    openDetailPanel(
      item.getAttribute('data-id'),
      item.querySelector('.proj-name').innerText,
      item.getAttribute('data-date'),
      item.getAttribute('data-desc'),
      item.getAttribute('data-tags'),
      item.getAttribute('data-img')
    );
  });
});

// Close button
if (detailBack) {
  detailBack.addEventListener('click', () => {
    const wipe = gsap.timeline();
    wipe.to([darkPanel, orangePanel], { yPercent: -100, stagger: 0.08, duration: 0.5, ease: 'power3.inOut' });
    wipe.call(() => {
      detailPanel.classList.remove('open');
      lenis.start();
    });
    wipe.to([orangePanel, darkPanel], { yPercent: -200, stagger: 0.08, duration: 0.5, ease: 'power3.inOut' });
    wipe.set([darkPanel, orangePanel], { yPercent: 100 });
  });
}
