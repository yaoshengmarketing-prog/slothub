(() => {
  const gm = document.querySelector('.gm');
  if (!gm) return;

  const image = gm.querySelector('.gm-image');
  const imageAsset = image?.querySelector('img[src]');
  const video = gm.querySelector('.gm-video[data-verified="true"]');
  gm.querySelectorAll('.gm-video').forEach(item => {
    if (item !== video) item.remove();
  });
  if (!imageAsset) gm.querySelector('figure')?.remove();
  if (!imageAsset && !video) {
    gm.remove();
    return;
  }
  gm.classList.toggle('gm-image-only', Boolean(imageAsset && !video));

  const dialog = gm.querySelector('dialog');
  const close = dialog?.querySelector('.gm-close');
  if (imageAsset && dialog && close && typeof dialog.showModal === 'function') {
    image.addEventListener('click', () => {
      if (!dialog.open) dialog.showModal();
      close.focus();
    });
    close.addEventListener('click', () => dialog.close());
    // This dialog has one interactive control; keep Tab on that close button.
    dialog.addEventListener('keydown', event => {
      if (event.key === 'Tab') {
        event.preventDefault();
        close.focus();
      }
    });
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right ||
          event.clientY < box.top || event.clientY > box.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
      if (image.isConnected) image.focus({ preventScroll: true });
    });
  }

  const load = video?.querySelector('.gm-load');
  const frame = video?.querySelector('.gm-frame');
  if (!load || !frame || load.dataset.video !== '494271522') return;
  load.addEventListener('click', () => {
    if (frame.querySelector('iframe')) return;
    const player = document.createElement('iframe');
    player.title = 'Razor Shark 原廠 Razor Reveal 功能展示';
    player.src = 'https://player.vimeo.com/video/494271522?autoplay=0&dnt=1';
    player.allow = 'fullscreen; picture-in-picture';
    player.allowFullscreen = true;
    frame.append(player);
    frame.hidden = false;
    load.disabled = true;
    load.textContent = '播放器已載入；無法播放可使用下方站外連結';
  });
})();
