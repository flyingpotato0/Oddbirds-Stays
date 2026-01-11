document.addEventListener('DOMContentLoaded',function(){
  const btn = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  btn.addEventListener('click',()=>{
    nav.classList.toggle('open');
  });
  // set year in footer
  const y = new Date().getFullYear();
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = y;

  // Our Spaces: make rooms clickable and show debug colors
  const rooms = document.querySelectorAll('.rooms .room');
  const spacesMedia = document.querySelector('.spaces-media');

  // Slideshow images for Room A (looping) with crossfade
  const roomASlides = [
    'Images/bed_1.jpeg',
    'Images/kitchen_1.avif',
    'Images/tv_1.jpeg',
    'Images/sink_1.jpeg'
  ];
  const roomBSlides = [
    'Images/bed_2.avif',
    'Images/kitchen_2.avif',
    'Images/tv_2.avif',
    'Images/sink_2.avif'
  ];
  let slideshowTimer = null;
  let slideshowIndex = 0;
  const slideA = document.querySelector('.spaces-media .slide-a');
  const slideB = document.querySelector('.spaces-media .slide-b');
  let front = slideA;
  let back = slideB;
  const roomCard = document.querySelector('.room-card');
  const roomCardClose = roomCard ? roomCard.querySelector('.room-card-close') : null;

  function startSlideshowCrossfade(slides, delay = 3000){
    if(!slideA || !slideB || !slides || slides.length === 0) return;
    stopSlideshow();
    slideshowIndex = 0;
    // set initial image on front and show it
    front.style.backgroundImage = `url('${slides[0]}')`;
    front.classList.add('show');
    back.classList.remove('show');
    slideshowTimer = setInterval(()=>{
      const next = (slideshowIndex + 1) % slides.length;
      // prepare back slide
      back.style.backgroundImage = `url('${slides[next]}')`;
      // crossfade
      back.classList.add('show');
      front.classList.remove('show');
      // swap references
      const tmp = front; front = back; back = tmp;
      slideshowIndex = next;
    }, delay);
  }

  function stopSlideshow(){
    if(slideshowTimer){
      clearInterval(slideshowTimer);
      slideshowTimer = null;
    }
    if(slideA) { slideA.classList.remove('show'); slideA.style.backgroundImage = ''; }
    if(slideB) { slideB.classList.remove('show'); slideB.style.backgroundImage = ''; }
    // reset container background
    if(spacesMedia) spacesMedia.style.background = '';
  }

  function showRoomCard(id){
    if(!roomCard) return;
    // populate content depending on id
    const title = roomCard.querySelector('.room-card-title');
    const features = roomCard.querySelector('.room-features');
    const actionBtn = roomCard.querySelector('.room-actions .btn');
    if(id === 'a'){
      title.textContent = 'Room A';
      features.innerHTML = '<li>👥 <strong>Sleeps 2</strong></li><li>🛏️ <strong>1 Queen-size Bed</strong></li><li>🚿 <strong>1 Bathroom</strong></li>';
      if(actionBtn){
        actionBtn.textContent = 'View Space';
        actionBtn.setAttribute('href','suite-a.html');
      }
    } else if(id === 'b'){
      title.textContent = 'Room B';
      features.innerHTML = '<li>👥 <strong>Sleeps 2</strong></li><li>🛏️ <strong>1 Queen-size Bed</strong></li><li>🚿 <strong>1 Bathroom</strong></li>';
      if(actionBtn){
        actionBtn.textContent = 'View Space';
        actionBtn.setAttribute('href','suite-b.html');
      }
    }
    roomCard.classList.add('visible');
    roomCard.setAttribute('aria-hidden','false');
  }

  function hideRoomCard(){
    if(!roomCard) return;
    roomCard.classList.remove('visible');
    roomCard.setAttribute('aria-hidden','true');
  }

  if(roomCardClose){
    roomCardClose.addEventListener('click', (e) => { e.preventDefault(); hideRoomCard(); });
  }

  rooms.forEach(r => {
    r.addEventListener('click', (e) => {
      e.preventDefault();
      const id = r.dataset.room;
      // toggle active class
      rooms.forEach(x => x.classList.remove('active'));
      r.classList.add('active');
      if(!spacesMedia) return;
      if(id === 'a'){
        // start crossfade slideshow for Room A
        spacesMedia.style.background = '';
        startSlideshowCrossfade(roomASlides, 2500);
        showRoomCard('a');
      } else if(id === 'b'){
        // start crossfade slideshow for Room B
        spacesMedia.style.background = '';
        startSlideshowCrossfade(roomBSlides, 2500);
        showRoomCard('b');
      }
    });
  });

  // --- Reviews / Feedback slideshow ---
  const reviewsContainer = document.querySelector('.review-slides');
  const prevBtn = document.querySelector('.review-prev');
  const nextBtn = document.querySelector('.review-next');
  let reviews = [];
  let reviewIndex = 0;
  let reviewTimer = null;

  const sampleReviews = [
    { text: "Great place. Cozy apartment.", author: 'Harsh Jain', rating: 5 },
    { text: "Enjoyed the stay!! Nice setup", author: 'Rishabh Khare', rating: 5 },
    { text: "Perfect and beautiful place for short stay for couples!", author: 'Akshat Bharani', rating: 5 },
    { text: "Best staying experience . Staff were good", author: 'Yash Gulati', rating: 5 },
    { text: "It was a comfortable stay overall!! Host was very friendly and responsive.", author: 'Ashwin', rating: 5 },
    { text: "Comfortable stay", author: 'Dhawal', rating: 5 }
  ];

  function renderReviews(list){
    reviewsContainer.innerHTML = '';
    reviewIndex = 0;
    list.forEach((r, i) => {
      const s = document.createElement('div');
      s.className = 'review-slide' + (i===0 ? ' show' : '');
      s.innerHTML = `<p>"${r.text}"</p><div class="review-meta"><div class="review-stars">${renderStars(r.rating)}</div><div class="review-author">${r.author}</div></div>`;
      reviewsContainer.appendChild(s);
    });
    reviews = list;
    updateSlides();
    startAutoAdvance();
  }

  function renderStars(n){
    let out = '';
    for(let i=0;i<5;i++){ out += `<span class="star" style="opacity:${i<n?1:0.22}"></span>`; }
    return out;
  }

  function updateSlides(){
    const slides = document.querySelectorAll('.review-slide');
    slides.forEach((s, idx)=>{ s.classList.toggle('show', idx===reviewIndex); });
  }

  function goToReview(i){ reviewIndex = i % reviews.length; updateSlides(); restartAutoAdvance(); }
  function prevReview(){ reviewIndex = (reviewIndex - 1 + reviews.length) % reviews.length; updateSlides(); restartAutoAdvance(); }
  function nextReview(){ reviewIndex = (reviewIndex + 1) % reviews.length; updateSlides(); restartAutoAdvance(); }

  function startAutoAdvance(){ stopAutoAdvance(); reviewTimer = setInterval(()=>{ nextReview(); }, 4500); }
  function stopAutoAdvance(){ if(reviewTimer){ clearInterval(reviewTimer); reviewTimer = null; } }
  function restartAutoAdvance(){ stopAutoAdvance(); startAutoAdvance(); }

  if(prevBtn) prevBtn.addEventListener('click', (e)=>{ e.preventDefault(); prevReview(); });
  if(nextBtn) nextBtn.addEventListener('click', (e)=>{ e.preventDefault(); nextReview(); });

  // Try fetching live reviews if a reviews endpoint is provided on window.REVIEWS_ENDPOINT.
  // The endpoint should return an array of objects: [{text, author, rating}, ...]
  async function fetchLiveReviews(){
    if(window.REVIEWS_ENDPOINT){
      try{
        const res = await fetch(window.REVIEWS_ENDPOINT);
        if(!res.ok) throw new Error('Network error');
        const data = await res.json();
        // Filter 4-5 star reviews and map to expected shape
        const filtered = (data || []).filter(x => x.rating >=4).map(x => ({ text: x.text || x.review || x.content || '', author: x.author || x.name || 'Guest', rating: x.rating || 5 }));
        if(filtered.length>0) return filtered;
      }catch(err){ console.warn('Failed to fetch live reviews:', err); }
    }
    return null;
  }

  (async ()=>{
    const live = await fetchLiveReviews();
    if(live && live.length>0){ renderReviews(live); }
    else { renderReviews(sampleReviews); }
  })();
  
  // --- Lightbox / collage slideshow ---
  const collageEl = document.querySelector('.collage');
  if(collageEl){
    const imgs = Array.from(collageEl.querySelectorAll('img')).map(img => img.getAttribute('src'));
    // build overlay DOM
    const overlay = document.createElement('div'); overlay.className = 'lb-overlay'; overlay.innerHTML = `
      <div class="lb-stage" role="dialog" aria-modal="true">
        <button class="lb-close" aria-label="Close">✕</button>
        <button class="lb-prev" aria-label="Previous">‹</button>
        <img class="lb-img" src="" alt="">
        <button class="lb-next" aria-label="Next">›</button>
      </div>
    `;
    document.body.appendChild(overlay);
    const lbImg = overlay.querySelector('.lb-img');
    const lbClose = overlay.querySelector('.lb-close');
    const lbPrev = overlay.querySelector('.lb-prev');
    const lbNext = overlay.querySelector('.lb-next');
    let currentIndex = 0;

    function openLightbox(index){
      currentIndex = (index + imgs.length) % imgs.length;
      lbImg.src = imgs[currentIndex];
      lbImg.alt = document.querySelectorAll('.collage img')[currentIndex].alt || '';
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      // preload neighbors
      const next = (currentIndex+1) % imgs.length; const prev = (currentIndex-1+imgs.length)%imgs.length;
      const p1 = new Image(); p1.src = imgs[next];
      const p2 = new Image(); p2.src = imgs[prev];
    }

    function closeLightbox(){ overlay.classList.remove('open'); document.body.style.overflow = ''; }
    function showNext(n){ currentIndex = (currentIndex + n + imgs.length) % imgs.length; lbImg.src = imgs[currentIndex]; lbImg.alt = document.querySelectorAll('.collage img')[currentIndex].alt || ''; }

    // attach click handlers to collage images
    collageEl.querySelectorAll('.collage-item img').forEach((el, i)=>{
      el.style.cursor = 'zoom-in';
      el.addEventListener('click', (e)=>{ e.preventDefault(); openLightbox(i); });
    });

    // controls
    lbClose.addEventListener('click', ()=> closeLightbox());
    overlay.addEventListener('click', (e)=>{ if(e.target === overlay) closeLightbox(); });
    lbPrev.addEventListener('click', ()=> showNext(-1));
    lbNext.addEventListener('click', ()=> showNext(1));

    // keyboard
    document.addEventListener('keydown', (e)=>{
      if(!overlay.classList.contains('open')) return;
      if(e.key === 'Escape') closeLightbox();
      if(e.key === 'ArrowRight') showNext(1);
      if(e.key === 'ArrowLeft') showNext(-1);
    });
  }
});

// Load places of interest from places.txt and render cards
async function loadPlaces(){
  try{
    // Prefer inline data (for file:// use-cases) otherwise fetch places.txt
    let txt = '';
    const inline = document.getElementById('placesData');
    if(inline && inline.textContent && inline.textContent.trim()){
      txt = inline.textContent;
    } else {
      const res = await fetch('places.txt');
      if(!res.ok) return;
      txt = await res.text();
    }
    const lines = txt.split(/\r?\n/).map(l=>l.trim()).filter(Boolean);
    const descMap = {
      'pheonix mall': 'A large shopping and leisure mall with dining and entertainment options.',
      '56 dukaan': 'A local shopping spot offering a variety of goods and quick bites.',
      'rajwada place': 'A historic palace at the heart of the city, worth a short visit.',
      'sarafa bazar': 'Famous for its lively night food market and local specialties.',
      'kamla nehru zoo': 'A family-friendly zoo with a small but pleasant collection of animals.',
      'bhag buddhist caves (dhar)': 'Ancient Buddhist rock-cut caves with archaeological interest.',
      'maheshwar ghat': 'Scenic riverside ghats and temples, great for a peaceful stroll.',
      'ujjain': 'An ancient pilgrimage city with temples and historic sites.'
    };

    const pinSvg = `
<svg viewBox="0 0 24 24" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <defs> <style>.cls-1{fill:#1a73e8;}.cls-2{fill:#ea4335;}.cls-3{fill:#4285f4;}.cls-4{fill:#fbbc04;}.cls-5{fill:#34a853;}</style> </defs> <g transform="scale(1.03, 1.03), translate(3.5, 0)"> <path class="cls-1" d="M14.45.78A8.09,8.09,0,0,0,5.8,3.29L9.63,6.51Z" transform="translate(-3.91 -0.4)"></path> <path class="cls-2" d="M5.8,3.29a8.07,8.07,0,0,0-1.89,5.2,9.06,9.06,0,0,0,.8,3.86L9.63,6.51Z" transform="translate(-3.91 -0.4)"></path> <path class="cls-3" d="M12,5.4a3.09,3.09,0,0,1,3.1,3.09,3.06,3.06,0,0,1-.74,2l4.82-5.73a8.12,8.12,0,0,0-4.73-4L9.63,6.51A3.07,3.07,0,0,1,12,5.4Z" transform="translate(-3.91 -0.4)"></path> <path class="cls-4" d="M12,11.59a3.1,3.1,0,0,1-3.1-3.1,3.07,3.07,0,0,1,.73-2L4.71,12.35A28.67,28.67,0,0,0,8.38,17.6l6-7.11A3.07,3.07,0,0,1,12,11.59Z" transform="translate(-3.91 -0.4)"></path> <path class="cls-5" d="M14.25,19.54c2.7-4.22,5.84-6.14,5.84-11a8.1,8.1,0,0,0-.91-3.73L8.38,17.6c.46.6.92,1.24,1.37,1.94C11.4,22.08,10.94,23.6,12,23.6S12.6,22.08,14.25,19.54Z" transform="translate(-3.91 -0.4)"></path> </g> </g></svg>`;

    const grid = document.getElementById('placesGrid');
    if(!grid) return;

    lines.forEach((ln, idx) => {
      const parts = ln.split(' - ');
      const name = (parts[0] || ln).trim();
      const url = (parts[1] || '#').trim();
      const desc = descMap[name.toLowerCase()] || 'A local point of interest worth visiting during your stay.';

      const card = document.createElement('div'); card.className = 'place-card';
      const link = document.createElement('a'); link.className = 'place-link'; link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer';

      const img = document.createElement('div'); img.className = 'place-image';
      // Map place name tokens to image filenames (use substring matching for robustness)
      const imagePatterns = [
        {pattern: 'pheonix', file: 'pheonixmall.jpg'},
        {pattern: '56 dukaan', file: '56dukaan.jpg'},
        {pattern: '56dukaan', file: '56dukaan.jpg'},
        {pattern: 'rajwada', file: 'rajwada.jpg'},
        {pattern: 'sarafa', file: 'sarafa.jpg'},
        {pattern: 'kamla', file: 'kamlazoo.png'},
        {pattern: 'kamlazoo', file: 'kamlazoo.png'},
        {pattern: 'dhar', file: 'dharcaves.jpg'},
        {pattern: 'maheshwar', file: 'maheshwar.jpg'},
        {pattern: 'ujjain', file: 'ujjain.jpg'}
      ];

      const nameLower = name.toLowerCase();
      let filename = null;
      for(const ip of imagePatterns){ if(nameLower.includes(ip.pattern)) { filename = ip.file; break; } }

      if(filename){
        const imgUrl = `Images/${filename}`;
        img.style.backgroundImage = `url('${imgUrl}')`;
        img.style.backgroundSize = 'cover';
        img.style.backgroundPosition = 'center';
      } else {
        // fallback: generate SVG placeholder
        const w = 360, h = 360;
        const bg1 = '#ebddc0'; // cream
        const bg2 = '#d6b76a'; // gold
        const accent = '#0e3b33'; // deep green
        const title = name;
        const svg = `
<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>
  <defs>
    <linearGradient id='g' x1='0' x2='1' y1='0' y2='1'>
      <stop offset='0' stop-color='${bg1}' />
      <stop offset='1' stop-color='${bg2}' />
    </linearGradient>
  </defs>
  <rect width='100%' height='100%' fill='url(#g)' />
  <g transform='translate(18,36)'>
    <circle cx='18' cy='18' r='14' fill='${accent}' opacity='0.12'/>
    <text x='46' y='24' font-family='Playfair Display, serif' font-size='20' fill='${accent}' font-weight='600'>${escapeXml(title.split(' ')[0]||title)}</text>
  </g>
  <g transform='translate(18,220)'>
    <text x='0' y='0' font-family='Inter, Arial, sans-serif' font-size='14' fill='#6b6b6b'>${escapeXml((desc||'').slice(0,110))}</text>
  </g>
</svg>`;
        const data = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
        img.style.backgroundImage = `url("${data}")`;
        img.style.backgroundSize = 'cover';
        img.style.backgroundPosition = 'center';
      }

      // escape helper used for SVG fallback
      function escapeXml(str){ return String(str).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&apos;"}[c]; }); }
      const content = document.createElement('div'); content.className = 'place-content';
      const h3 = document.createElement('h3'); h3.className = 'place-title'; h3.textContent = name;
      const p = document.createElement('p'); p.className = 'place-desc'; p.textContent = desc;
      content.appendChild(h3); content.appendChild(p);

      const pinWrap = document.createElement('div'); pinWrap.className = 'pin-wrap'; pinWrap.innerHTML = pinSvg;

      link.appendChild(img);
      link.appendChild(content);
      link.appendChild(pinWrap);
      card.appendChild(link);
      grid.appendChild(card);
    });
  }catch(err){ console.warn('Failed to load places',err); }
}

// Kick off loading places after DOM ready
loadPlaces().catch(()=>{});
