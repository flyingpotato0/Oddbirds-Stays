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
      if(actionBtn) actionBtn.textContent = 'View Space';
    } else if(id === 'b'){
      title.textContent = 'Room B';
      features.innerHTML = '<li>👥 <strong>Sleeps 2</strong></li><li>🛏️ <strong>1 Queen-size Bed</strong></li><li>🚿 <strong>1 Bathroom</strong></li>';
      if(actionBtn) actionBtn.textContent = 'View Space';
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
});
