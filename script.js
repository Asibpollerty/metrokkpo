// script.js — интерактивность: выделение линий, тултипы, клик на станции
document.addEventListener('DOMContentLoaded', () => {
  const highlightBtn = document.getElementById('highlightBtn');
  const resetBtn = document.getElementById('resetBtn');
  const totalLines = document.querySelectorAll('.line-card').length;
  let current = 0;

  highlightBtn.addEventListener('click', () => {
    current = current === 0 ? 1 : (current % totalLines) + 1;
    highlightLine(current);
    highlightBtn.textContent = `Линия ${current} — выделена (клик для следующей)`;
  });

  resetBtn.addEventListener('click', () => {
    clearAll();
    current = 0;
    highlightBtn.textContent = 'Выделить линию';
  });

  function highlightLine(n) {
    clearAll();
    const card = document.querySelector(`.line-card[data-line="${n}"]`);
    if (!card) return;
    card.classList.add('highlighted');
    const color = getComputedStyle(card).getPropertyValue('--line-color').trim() || '#8b5cf6';
    // подсветка карты
    card.style.boxShadow = `0 20px 60px ${hexToRgba(color,0.18)}`;
    // анимация станций по очереди
    const stations = card.querySelectorAll('.station');
    stations.forEach((s, i) => {
      setTimeout(() => s.classList.add('active'), i * 90);
    });
    // плавный скролл к карточке
    card.scrollIntoView({behavior:'smooth', block:'center'});
  }

  function clearAll() {
    document.querySelectorAll('.station.active').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.line-card.highlighted').forEach(c => {
      c.classList.remove('highlighted');
      c.style.boxShadow = '';
    });
  }

  // тултипы для станций
  document.querySelectorAll('.station').forEach((st, idx) => {
    st.addEventListener('mouseenter', (e) => {
      const name = st.dataset.name || st.textContent.trim();
      const tip = document.createElement('div');
      tip.className = 'station-tooltip';
      tip.textContent = `${idx+1}. ${name}`;
      document.body.appendChild(tip);
      st._tip = tip;
      const move = (ev) => {
        tip.style.left = (ev.clientX + 14) + 'px';
        tip.style.top = (ev.clientY + 14) + 'px';
      };
      st._move = move;
      window.addEventListener('mousemove', move);
    });
    st.addEventListener('mouseleave', () => {
      if (st._tip){ st._tip.remove(); st._tip = null; window.removeEventListener('mousemove', st._move); }
    });

    // клик — небольшой всплеск
    st.addEventListener('click', () => {
      st.classList.add('active');
      setTimeout(()=> st.classList.remove('active'), 1400);
    });
  });

  // helper: convert hex to rgba
  function hexToRgba(hex, alpha=1){
    let h = hex.replace('#','').trim();
    if(h.length === 3) h = h.split('').map(c=>c+c).join('');
    const r = parseInt(h.substring(0,2),16);
    const g = parseInt(h.substring(2,4),16);
    const b = parseInt(h.substring(4,6),16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  // entrance animation for cards
  document.querySelectorAll('.line-card').forEach((c,i)=>{
    c.style.opacity = 0;
    c.style.transform = 'translateY(14px)';
    setTimeout(()=> { c.style.transition = 'all .5s cubic-bezier(.2,.9,.2,1)'; c.style.opacity=1; c.style.transform='none'; }, i*80 );
  });
});
