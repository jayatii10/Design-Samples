(() => {
  const cards = [...document.querySelectorAll('.work-card')];
  const dialog = document.getElementById('lightbox');
  const stage = document.getElementById('lightbox-stage');
  const preview = document.getElementById('lightbox-image');
  const placeholder = document.getElementById('lightbox-placeholder');
  const count = document.getElementById('lightbox-count');
  const label = document.getElementById('lightbox-label');
  const close = document.getElementById('close-lightbox');
  const prev = document.getElementById('prev-design');
  const next = document.getElementById('next-design');
  let activeIndex = 0;
  let lastFocused = null;

  // Replace images/design-01.jpg through images/design-05.jpg with your own files.
  // JPG, PNG, and WebP all work; if you use another extension, update index.html too.
  cards.forEach((card, index) => {
    const image = card.querySelector('.design-image');
    image.addEventListener('load', () => card.classList.add('has-image'));
    image.addEventListener('error', () => card.classList.remove('has-image'));
    if (image.complete && image.naturalWidth > 0) card.classList.add('has-image');
    card.addEventListener('click', () => openPreview(index));
  });

  function openPreview(index) {
    activeIndex = index;
    lastFocused = document.activeElement;
    renderPreview();
    if (!dialog.open) dialog.showModal();
    document.body.classList.add('modal-open');
    close.focus();
  }

  function renderPreview() {
    const card = cards[activeIndex];
    const source = card.querySelector('.design-image');
    const art = card.querySelector('.placeholder-art');
    count.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`;
    label.textContent = `Design sample ${String(activeIndex + 1).padStart(2, '0')}`;
    preview.alt = `Expanded view of Instagram post design ${activeIndex + 1}`;
    stage.classList.remove('has-image');
    preview.removeAttribute('src');
    placeholder.className = `lightbox-placeholder ${art.className.replace('placeholder-art', '').trim()}`;
    placeholder.style.background = getComputedStyle(card).backgroundColor;
    const artBig = art.querySelector('.art-big');
    placeholder.innerHTML = artBig ? artBig.innerHTML : `DESIGN<br>${activeIndex + 1}`;
    if (card.classList.contains('card-white')) placeholder.style.color = '#171916';
    else if (card.classList.contains('card-saffron')) placeholder.style.color = '#171916';
    else placeholder.style.color = '#fff';

    if (card.classList.contains('has-image') && source.src) {
      preview.onload = () => stage.classList.add('has-image');
      preview.src = source.src;
      if (preview.complete && preview.naturalWidth > 0) stage.classList.add('has-image');
    }
    prev.disabled = cards.length < 2;
    next.disabled = cards.length < 2;
  }

  function closePreview() {
    if (dialog.open) dialog.close();
  }
  function step(direction) {
    activeIndex = (activeIndex + direction + cards.length) % cards.length;
    renderPreview();
  }

  close.addEventListener('click', closePreview);
  prev.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));
  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  });
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closePreview();
  });
  document.addEventListener('keydown', (event) => {
    if (!dialog.open) return;
    if (event.key === 'ArrowRight') { event.preventDefault(); step(1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); step(-1); }
  });
})();