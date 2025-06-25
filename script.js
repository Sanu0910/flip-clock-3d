function padZero(num) {
  return num < 10 ? '0' + num : num.toString();
}

function createFlipUnit(containerId, currentValue) {
  const container = document.getElementById(containerId);
  container.innerHTML = `
    <div class="flip-card">
      <div class="top" data-number="${currentValue}"></div>
      <div class="bottom" data-number="${currentValue}"></div>
    </div>
  `;
}

function updateFlipUnit(containerId, newValue) {
  const container = document.getElementById(containerId);
  const top = container.querySelector('.top');
  const bottom = container.querySelector('.bottom');
  const oldValue = top?.getAttribute('data-number');

  if (oldValue === newValue) return;

  top.setAttribute('data-number', oldValue);
  bottom.setAttribute('data-number', newValue);

  const card = container.querySelector('.flip-card');
  card.classList.remove('flip-animate');
  void card.offsetWidth; // trigger reflow
  card.classList.add('flip-animate');

  setTimeout(() => {
    top.setAttribute('data-number', newValue);
  }, 500);
}

function updateClock() {
  const now = new Date();
  const h = padZero(now.getHours());
  const m = padZero(now.getMinutes());
  const s = padZero(now.getSeconds());

  updateFlipUnit('hour', h);
  updateFlipUnit('minute', m);
  updateFlipUnit('second', s);
}

function initClock() {
  const now = new Date();
  createFlipUnit('hour', padZero(now.getHours()));
  createFlipUnit('minute', padZero(now.getMinutes()));
  createFlipUnit('second', padZero(now.getSeconds()));
}

initClock();
setInterval(updateClock, 1000);
