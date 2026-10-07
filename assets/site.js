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
