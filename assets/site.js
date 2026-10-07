(function(){
  var btn = document.getElementById('copybtn');
  if (btn) btn.addEventListener('click', function(){
    var node = document.getElementById('tel');
    var done = function(){ btn.textContent = 'Copied'; setTimeout(function(){ btn.textContent = 'Copy number'; }, 1800); };
    function select(){
      var r = document.createRange(); r.selectNodeContents(node);
      var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
      btn.textContent = 'Selected — copy it';
      setTimeout(function(){ btn.textContent = 'Copy number'; }, 2500);
    }
    try { navigator.clipboard.writeText(node.textContent.trim()).then(done, select); } catch (e) { select(); }
  });
})();

/* Photo lightbox — tap any gallery photo to see it full size.
   Builds its own DOM so no markup changes are needed beyond the
   images themselves. Keyboard, swipe and click all navigate. */
(function(){
  var sel = '.ba-grid img, .jobs img, .gal img';
  var imgs = Array.prototype.slice.call(document.querySelectorAll(sel));
  if (!imgs.length) return;

  var lb = document.createElement('div');
  lb.className = 'lb';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.setAttribute('aria-label', 'Photo viewer');
  lb.innerHTML =
    '<button class="lb-btn lb-close" type="button" aria-label="Close">✕</button>' +
    '<button class="lb-btn lb-prev" type="button" aria-label="Previous photo">‹</button>' +
    '<button class="lb-btn lb-next" type="button" aria-label="Next photo">›</button>' +
    '<figure><img alt=""><figcaption></figcaption></figure>' +
    '<p class="lb-count"></p>';
  document.body.appendChild(lb);

  var big   = lb.querySelector('img');
  var cap   = lb.querySelector('figcaption');
  var count = lb.querySelector('.lb-count');
  var i = 0, lastFocus = null;

  function show(n){
    i = (n + imgs.length) % imgs.length;
    var src = imgs[i];
    big.src = src.currentSrc || src.src;
    big.alt = src.alt || '';
    cap.textContent = src.alt || '';
    count.textContent = (i + 1) + ' of ' + imgs.length;
  }
  function open(n){
    lastFocus = document.activeElement;
    show(n);
    lb.classList.add('on');
    document.body.classList.add('lb-open');
    lb.querySelector('.lb-close').focus();
  }
  function close(){
    lb.classList.remove('on');
    document.body.classList.remove('lb-open');
    big.src = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  imgs.forEach(function(im, n){
    im.setAttribute('tabindex', '0');
    im.setAttribute('role', 'button');
    im.addEventListener('click', function(){ open(n); });
    im.addEventListener('keydown', function(e){
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(n); }
    });
  });

  lb.querySelector('.lb-close').addEventListener('click', close);
  lb.querySelector('.lb-prev').addEventListener('click', function(e){ e.stopPropagation(); show(i - 1); });
  lb.querySelector('.lb-next').addEventListener('click', function(e){ e.stopPropagation(); show(i + 1); });
  lb.addEventListener('click', function(e){ if (e.target === lb || e.target.tagName === 'FIGURE') close(); });

  document.addEventListener('keydown', function(e){
    if (!lb.classList.contains('on')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(i - 1);
    else if (e.key === 'ArrowRight') show(i + 1);
  });

  // Horizontal swipe to move between photos; vertical is left alone.
  var x0 = null, y0 = null;
  lb.addEventListener('touchstart', function(e){
    x0 = e.changedTouches[0].clientX; y0 = e.changedTouches[0].clientY;
  }, {passive:true});
  lb.addEventListener('touchend', function(e){
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    var dy = e.changedTouches[0].clientY - y0;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) show(i + (dx < 0 ? 1 : -1));
    x0 = y0 = null;
  }, {passive:true});
})();
