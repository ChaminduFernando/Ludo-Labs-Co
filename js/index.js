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

// Link ScrollTrigger to Lenis
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);


// --- CUSTOM CURSOR SYSTEM ---
const cursor = document.getElementById('proj-cursor');
let mouseX = 0, mouseY = 0;
let curX = 0, curY = 0;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Cursor follow loops
gsap.ticker.add(() => {
  curX += (mouseX - curX) * 0.12;
  curY += (mouseY - curY) * 0.12;
  gsap.set(cursor, { x: curX, y: curY });
});

// Cursor hover rules
const hoverElements = document.querySelectorAll('.chr-hover, a, .proj-item, .skill-header, .detail-back, .logo-3d-card, .team-card');
hoverElements.forEach(el => {
  el.addEventListener('mouseenter', () => {
    gsap.to(cursor, { scale: 1.2, backgroundColor: '#ffffff', mixBlendMode: 'difference', duration: 0.2 });
  });
  el.addEventListener('mouseleave', () => {
    gsap.to(cursor, { scale: 0, backgroundColor: '#ff5a00', mixBlendMode: 'normal', duration: 0.2 });
    cursor.innerText = 'SEE PROJECT';
  });
});


// --- PRELOADER SEQUENCE ---
window.addEventListener('DOMContentLoaded', () => {
  const tl = gsap.timeline();

  // Reset states
  gsap.set(['#preloader-udo', '#preloader-labs', '#preloader-co'], { opacity: 0, y: 80 });
  gsap.set('#preloader-logo', { scale: 0.8, rotate: -5 });
  
  gsap.set('#hero-tagline', { opacity: 0, y: 30 });
  gsap.set(['.hero-name-ludo', '.hero-name-labs'], { opacity: 0, y: 100 });
  gsap.set('#hero-line', { scaleX: 0 });
  gsap.set('.hero-bar-left, .hero-bar-center, .hero-bar-right', { opacity: 0, y: 15 });

  // 1. Monogram reveal
  tl.to('#preloader-logo', {
    scale: 1,
    rotate: 0,
    duration: 0.8,
    ease: 'power3.out'
  });

  // 2. Letters reveal
  tl.to(['#preloader-udo', '#preloader-labs', '#preloader-co'], {
    opacity: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'back.out(1.7)'
  }, '-=0.3');

  // 3. Dot glow effect
  tl.to('#preloader-dot', {
    scale: 1.4,
    color: '#ffffff',
    duration: 0.3,
    yoyo: true,
    repeat: 1
  });

  // 4. Slide out preloader
  tl.to('#name-layer', {
    yPercent: -100,
    duration: 0.9,
    ease: 'power4.inOut',
    delay: 0.4
  });

  // 5. Trigger Hero tagline fade-in
  tl.to('#hero-tagline', {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power2.out'
  }, '-=0.4');

  // 6. Trigger Hero Name slide-up
  tl.to(['.hero-name-ludo', '.hero-name-labs'], {
    opacity: 1,
    y: 0,
    duration: 0.9,
    stagger: 0.12,
    ease: 'power3.out'
  }, '-=0.6');

  // 7. Reveal Hero bottom bars
  tl.to('#hero-line', {
    scaleX: 1,
    transformOrigin: 'left center',
    duration: 0.8,
    ease: 'power2.out'
  }, '-=0.6');

  tl.to('.hero-bar-left, .hero-bar-center, .hero-bar-right', {
    opacity: 1,
    y: 0,
    stagger: 0.08,
    duration: 0.7,
    ease: 'power2.out'
  }, '-=0.5');
});


// --- HERO BACKDROP SHIFTING AURA (Matches 1st Image Vibe) ---
window.addEventListener('mousemove', (e) => {
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;

  // Move glows subtly in opposite directions
  gsap.to('.aura-1', { x: (x - 0.5) * 60, y: (y - 0.5) * 60, duration: 1.5, ease: 'power2.out' });
  gsap.to('.aura-2', { x: (0.5 - x) * 80, y: (0.5 - y) * 80, duration: 1.5, ease: 'power2.out' });
  gsap.to('.aura-3', { x: (x - 0.5) * 40, y: (y - 0.5) * 40, duration: 1.5, ease: 'power2.out' });
});

// Breathing loop rotations
gsap.to('.aura-1', { rotation: 360, duration: 25, repeat: -1, ease: 'none' });
gsap.to('.aura-2', { rotation: -360, duration: 35, repeat: -1, ease: 'none' });


// --- 3D TILTING ABOUT LOGO CARD (Matches 2nd & 3rd Image) ---
const logoCard = document.getElementById('logo-3d-card');
if (logoCard) {
  logoCard.addEventListener('mousemove', (e) => {
    const rect = logoCard.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Lerp values relative to center (-1 to 1)
    const percentX = (x - centerX) / centerX;
    const percentY = (y - centerY) / centerY;
    
    // Scale max tilt degrees
    const rotateX = percentY * -14;
    const rotateY = percentX * 14;
    
    gsap.to(logoCard, {
      rotateX: rotateX,
      rotateY: rotateY,
      duration: 0.15,
      ease: 'power1.out'
    });
    
    // Update shiny glow spot variables
    logoCard.style.setProperty('--glow-x', `${(x / rect.width) * 100}%`);
    logoCard.style.setProperty('--glow-y', `${(y / rect.height) * 100}%`);
  });
  
  logoCard.addEventListener('mouseleave', () => {
    gsap.to(logoCard, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: 'power3.out'
    });
  });
}


// --- MID REVEAL SCROLL EFFECTS ---
gsap.fromTo('.reveal-frame', 
  { width: '75%', height: '60%' },
  {
    width: '100%',
    height: '100%',
    scrollTrigger: {
      trigger: '#reveal-image-wrap',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  }
);

gsap.from('.reveal-phrase', {
  opacity: 0,
  y: 60,
  scrollTrigger: {
    trigger: '#reveal-image-wrap',
    start: 'top center+=100',
    end: 'center center',
    scrub: true
  }
});


// --- FLOATING PREVIEW ENGINE ---
const preview = document.getElementById('proj-preview');
const previewCover = document.getElementById('proj-cover');
const previewDate = document.getElementById('proj-date');

gsap.ticker.add(() => {
  if (preview.style.display === 'block') {
    gsap.set(preview, { x: mouseX + 25, y: mouseY + 25 });
  }
});

// Services item hovers (4th Image Glowing Cursor Overlay)
document.querySelectorAll('.service-item').forEach(item => {
  item.addEventListener('mouseenter', () => {
    cursor.innerText = 'DISCOVER';
    cursor.classList.add('discover-active');
    gsap.to(cursor, { scale: 1, duration: 0.2 });
  });

  item.addEventListener('mouseleave', () => {
    cursor.innerText = 'SEE PROJECT';
    cursor.classList.remove('discover-active');
    gsap.to(cursor, { scale: 0, duration: 0.2 });
  });
});

// --- SELECTED WORKS PINNED SPLIT SCROLL (Matches 5th Image) ---
const scrollItems = gsap.utils.toArray('.proj-scroll-item');
const mockupImg = document.getElementById('mockup-display-img');
const mockupDate = document.getElementById('mockup-date');
const trackInner = document.getElementById('projects-track-inner');
const mockupScreen = document.getElementById('mockup-screen-tilt');
const rightCol = document.querySelector('.projects-right-col');

if (scrollItems.length > 0) {
  // Pinned container scrubbing
  const pinTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: '#projects',
      start: 'top top',
      end: '+=2200',
      scrub: true,
      pin: true,
      anticipatePin: 1
    }
  });

  // Translate the track so items pass center
  pinTimeline.to(trackInner, {
    y: () => -(trackInner.scrollHeight - window.innerHeight * 0.8),
    ease: 'none'
  });

  // Active state highlighting and mockup image swaps
  scrollItems.forEach((item, idx) => {
    const imgUrl = item.getAttribute('data-img');
    const date = item.getAttribute('data-date');

    ScrollTrigger.create({
      trigger: '#projects',
      start: () => `top top+=${(idx * 2200) / scrollItems.length}`,
      end: () => `top top+=${((idx + 1) * 2200) / scrollItems.length}`,
      onToggle: (self) => {
        if (self.isActive) {
          scrollItems.forEach(sib => sib.classList.remove('active'));
          item.classList.add('active');
          
          mockupDate.innerText = date;
          
          // Swap display image with quick animation
          const swapTimeline = gsap.timeline();
          swapTimeline.to(mockupImg, { opacity: 0, scale: 0.96, duration: 0.15, onComplete: () => {
            mockupImg.src = imgUrl;
          }});
          swapTimeline.to(mockupImg, { opacity: 1, scale: 1.0, duration: 0.35, ease: 'back.out(1.1)' });
          
          // Screen bounce
          gsap.fromTo(mockupScreen, 
            { rotateY: 3, rotateX: 3 },
            { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' }
          );
        }
      }
    });
  });
}

// 3D Tilt for Right Showcase Mockup Screen
if (rightCol && mockupScreen) {
  rightCol.addEventListener('mousemove', (e) => {
    const rect = rightCol.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const percentX = (x - centerX) / centerX;
    const percentY = (y - centerY) / centerY;
    
    gsap.to(mockupScreen, {
      rotateX: percentY * -8,
      rotateY: percentX * 8,
      duration: 0.25,
      ease: 'power1.out'
    });
  });
  
  rightCol.addEventListener('mouseleave', () => {
    gsap.to(mockupScreen, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: 'power2.out'
    });
  });
}


// --- CAPABILITIES FOLDERS ACCORDION ---
const folders = document.querySelectorAll('.skill-group');
folders.forEach(folder => {
  const header = folder.querySelector('.skill-header');
  const body = folder.querySelector('.skill-body');
  
  header.addEventListener('click', () => {
    const isOpen = folder.classList.contains('open');

    folders.forEach(f => {
      f.classList.remove('open');
      gsap.to(f.querySelector('.skill-body'), { height: 0, duration: 0.4, ease: 'power2.out' });
    });

    if (!isOpen) {
      folder.classList.add('open');
      gsap.to(body, { height: body.scrollHeight, duration: 0.4, ease: 'power2.out' });
    }
  });
});

const initialOpen = document.querySelector('.skill-group.open');
if (initialOpen) {
  gsap.set(initialOpen.querySelector('.skill-body'), { height: initialOpen.querySelector('.skill-body').scrollHeight });
}


// --- FLUID SVG SCROLL PATH ---
gsap.fromTo('.fluid-line', 
  { strokeDashoffset: 1500 },
  {
    strokeDashoffset: 0,
    scrollTrigger: {
      trigger: '#projects',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.5
    }
  }
);


// --- PROJECT DETAIL OVERLAY PANEL ---
const detailPanel = document.getElementById('project-detail');
const detailBack = document.getElementById('detail-back');
const darkPanel = document.getElementById('t-panel-dark');
const orangePanel = document.getElementById('t-panel-orange');

document.querySelectorAll('.proj-scroll-item').forEach(item => {
  item.addEventListener('click', () => {
    const id = item.getAttribute('data-id');
    const title = item.querySelector('.proj-name').innerText;
    const date = item.getAttribute('data-date');
    const desc = item.getAttribute('data-desc');
    const tags = item.getAttribute('data-tags');
    const imgUrl = item.getAttribute('data-img');

    // Populate detail contents
    document.getElementById('detail-title').innerText = title;
    document.getElementById('detail-year').innerText = `(${date})`;
    document.getElementById('detail-desc').innerText = desc;

    // Populate tags
    const tagsContainer = document.getElementById('detail-tags');
    tagsContainer.innerHTML = '';
    tags.split(',').forEach(tag => {
      const tagSpan = document.createElement('span');
      tagSpan.classList.add('detail-tag');
      tagSpan.innerText = tag.trim();
      tagsContainer.appendChild(tagSpan);
    });

    // Populate selected cover image
    const graphicContainer = document.getElementById('detail-selected');
    graphicContainer.innerHTML = `<img src="${imgUrl}" alt="${title}">`;

    // Trigger full screen wipe transition
    const wipe = gsap.timeline();
    
    wipe.to([darkPanel, orangePanel], {
      yPercent: -100,
      stagger: 0.1,
      duration: 0.6,
      ease: 'power3.inOut'
    });

    wipe.call(() => {
      detailPanel.classList.add('open');
      detailPanel.scrollTop = 0;
      lenis.stop();
    });

    wipe.to([orangePanel, darkPanel], {
      yPercent: -200,
      stagger: 0.08,
      duration: 0.6,
      ease: 'power3.inOut'
    });

    wipe.set([darkPanel, orangePanel], { yPercent: 100 });

    wipe.from('#detail-title-wrap, #detail-desc, #detail-tags, #detail-selected', {
      opacity: 0,
      y: 40,
      stagger: 0.1,
      duration: 0.6,
      ease: 'power2.out'
    }, '>-=0.2');
  });
});

// Close details button
detailBack.addEventListener('click', () => {
  const wipe = gsap.timeline();

  wipe.to([darkPanel, orangePanel], {
    yPercent: -100,
    stagger: 0.08,
    duration: 0.5,
    ease: 'power3.inOut'
  });

  wipe.call(() => {
    detailPanel.classList.remove('open');
    lenis.start();
  });

  wipe.to([orangePanel, darkPanel], {
    yPercent: -200,
    stagger: 0.08,
    duration: 0.5,
    ease: 'power3.inOut'
  });

  wipe.set([darkPanel, orangePanel], { yPercent: 100 });
});
