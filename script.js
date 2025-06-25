function createDigits(containerId) {
  const col = document.getElementById(containerId);
  for (let i = 0; i < 10; i++) {
    const d = document.createElement('div');
    d.className = 'digit';
    d.textContent = i;
    col.appendChild(d);
  }
}

['h1', 'h2', 'm1', 'm2', 's1', 's2'].forEach(createDigits);

function updateTime() {
  const now = new Date();
  const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '');
  [...timeStr].forEach((num, i) => {
    const id = ['h1', 'h2', 'm1', 'm2', 's1', 's2'][i];
    const col = document.getElementById(id);
    col.style.transition = 'transform 0.6s ease-in-out';
    col.style.transform = `translateY(-${Number(num) * 80}px)`;
  });
}

updateTime();
setInterval(updateTime, 1000);
