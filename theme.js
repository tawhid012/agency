tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--bg-primary)',
        surface: 'var(--bg-secondary)',
        'surface-variant': 'var(--bg-tertiary)',
        elevated: 'var(--bg-elevated)',
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        muted: 'var(--text-muted)',
        'on-surface': 'var(--text-primary)',
        'on-surface-variant': 'var(--text-secondary)',
        outline: 'var(--glass-border)',
        'outline-variant': 'var(--glass-border)',
        accent: {
          purple: 'var(--accent-purple)',
          blue: 'var(--accent-blue)',
          cyan: 'var(--accent-cyan)'
        }
      }
    }
  }
}

// Universal Custom Cursor and Spotlight Effect
document.addEventListener('DOMContentLoaded', () => {
  if (window.matchMedia('(pointer: fine)').matches) {
    // 1. Inject DOM elements if they don't already exist
    let dot = document.getElementById('cursorDot');
    if (!dot) {
      dot = document.createElement('div');
      dot.id = 'cursorDot';
      dot.className = 'cursor-dot';
      document.body.appendChild(dot);
    }

    let ring = document.getElementById('cursorRing');
    if (!ring) {
      ring = document.createElement('div');
      ring.id = 'cursorRing';
      ring.className = 'cursor-ring';
      document.body.appendChild(ring);
    }

    let spotlight = document.getElementById('spotlight');
    if (!spotlight) {
      spotlight = document.createElement('div');
      spotlight.id = 'spotlight';
      spotlight.className = 'spotlight';
      document.body.insertBefore(spotlight, document.body.firstChild);
    }

    // 2. Track mouse movement
    document.addEventListener('mousemove', (e) => {
      dot.style.left = e.clientX + 'px';
      dot.style.top = e.clientY + 'px';
      
      ring.style.left = e.clientX + 'px';
      ring.style.top = e.clientY + 'px';
      
      spotlight.style.left = e.clientX + 'px';
      spotlight.style.top = e.clientY + 'px';
    });

    // 3. Hover effects (enlarge the ring when hovering interactive elements)
    const hoverSelectors = 'a, button, [role="button"], input, select, textarea, .cursor-pointer, .tilt-card, .faq-trigger, .stack-item';
    
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverSelectors)) {
        ring.classList.add('hover');
      }
    });

    document.addEventListener('mouseout', (e) => {
      const target = e.target.closest(hoverSelectors);
      if (target) {
        const related = e.relatedTarget;
        if (!related || !related.closest(hoverSelectors)) {
          ring.classList.remove('hover');
        }
      }
    });
  }
});
