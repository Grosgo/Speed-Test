const statsPanel = document.createElement("div");
statsPanel.className = "stats-panel";
statsPanel.innerHTML = `
  <h3>Performance Stats</h3>
  <div>Average: <span id="avgValue">0 Mbps</span></div>
  <div>Peak: <span id="peakValue">0 Mbps</span></div>
  <div>Lowest: <span id="lowValue">0 Mbps</span></div>
`;
document.body.appendChild(statsPanel);

const maxSpeed = 2000;
const tickCount = 11;
const startAngle = 225;
const endAngle = 495;
const totalAngle = endAngle - startAngle;

const gaugeSize = 500;
const centerX = gaugeSize / 2;
const centerY = gaugeSize / 2;
const radius = 175;

const scaleContainer = document.createElement("div");
scaleContainer.className = "gauge-scale";
document.querySelector(".gauge-container").appendChild(scaleContainer);
scaleContainer.innerHTML = "";

for (let i = 0; i < tickCount; i++) {
  const mbps = i * (maxSpeed / (tickCount - 1));
  const angleDeg = startAngle + (mbps / maxSpeed) * totalAngle;
  const rad = (angleDeg - 90) * (Math.PI / 180);
  const x = centerX + radius * Math.cos(rad);
  const y = centerY + radius * Math.sin(rad);

  const tick = document.createElement("div");
  tick.className = "tick";
  tick.textContent = `${mbps.toFixed(0)} Mbps`;
  tick.style.position = "absolute";
  tick.style.left = `${(x / gaugeSize) * 100}%`;
  tick.style.top = `${(y / gaugeSize) * 100}%`;
  tick.style.transform = "translate(-50%, -50%)";
  scaleContainer.appendChild(tick);
}

function speedToAngle(speed) {
  const clamped = Math.max(0, Math.min(speed, maxSpeed));
  return startAngle + (clamped / maxSpeed) * totalAngle;
}

function setNeedle(speed) {
  const clamped = Math.min(Math.max(speed, 0), maxSpeed);
  const angle = speedToAngle(clamped);
  needle.style.transform = `translate(-50%, -100%) rotate(${angle}deg)`;
}

function updateSpeed(speed) {
  setNeedle(speed);
  startButton.textContent = `${speed.toFixed(0)} Mbps`;
}

async function runSpeedTest(durationSeconds = 8) {
  startButton.disabled = true;
  startButton.textContent = "Running...";
  const testUrl = "https://speed.cloudflare.com/__down?bytes=5000000";
  const intervals = durationSeconds * 10;
  const testSpeeds = [];

  for (let i = 0; i < intervals; i++) {
    let downloadedBytes = 0;
    const startTime = Date.now();

    try {
      const res = await fetch(testUrl, { cache: "no-store" });
      const reader = res.body.getReader();
      const timeout = setTimeout(() => reader.cancel(), 100);

      let done = false;
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        if (value) downloadedBytes += value.length;
        done = doneReading;
      }
      clearTimeout(timeout);
    } catch (err) {
      console.warn("Download error:", err);
    }

    const elapsed = (Date.now() - startTime) / 1000;
    const mbps = (downloadedBytes * 8) / (elapsed * 1e6);
    testSpeeds.push(mbps);
    updateSpeed(mbps);
    await new Promise((res) => setTimeout(res, 100));
  }

  const average = testSpeeds.reduce((a, b) => a + b, 0) / testSpeeds.length;
  document.getElementById("avgValue").textContent = `${average.toFixed(1)} Mbps`;
  document.getElementById("peakValue").textContent = `${Math.max(...testSpeeds).toFixed(1)} Mbps`;
  document.getElementById("lowValue").textContent = `${Math.min(...testSpeeds).toFixed(1)} Mbps`;

  startButton.disabled = false;
  startButton.textContent = "Test Again";
}

window.onload = () => {
  setNeedle(0);
};

startButton.addEventListener("click", () => {
  runSpeedTest();
});
document.addEventListener('mousemove', (e) => {
  const bg = document.querySelector('.animated-bg');
  const x = e.clientX;
  const y = e.clientY;
  bg.style.transform = `translate(${x - window.innerWidth}px, ${y - window.innerHeight}px)`;
});

class Galaxy {
  constructor() {
    this.canvas = document.getElementById('galaxy-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.stars = [];
    this.mouse = { x: 0, y: 0 };
    this.explosions = [];

    this.init();
    this.animate();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    this.useClickPosition = false;
    document.addEventListener('mousemove', (e) => {
      if (!this.useClickPosition) {
        this.mouse.x = e.clientX - window.innerWidth / 2;
        this.mouse.y = e.clientY - window.innerHeight / 2;
      }
    });

    document.addEventListener('click', (e) => {
      this.mouse.x = e.clientX - window.innerWidth / 2;
      this.mouse.y = e.clientY - window.innerHeight / 2;
      this.createExplosion(e.clientX, e.clientY);
    });

    document.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      this.createExplosion(touch.clientX, touch.clientY);
    });

    for (let i = 0; i < 1000; i++) {
      this.stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 1.5,
        speed: Math.random() * 0.2,
        color: `hsl(${Math.random() * 60 + 200}, 100%, ${Math.random() * 30 + 50}%)`,
        vx: 20,
        vy: 20
      });
    }
  }

  createExplosion(x, y) {
    this.explosions.push({
      x,
      y,
      radius: 50,
      maxRadius: 100,
      alpha: 0.01,
      power: 1 + Math.random() * 3
    });
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  animate() {
    this.ctx.fillStyle = 'rgba(5, 5, 15, 0.2)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.explosions.length - 1; i >= 0; i--) {
      const exp = this.explosions[i];
      exp.radius += 50;
      exp.alpha -= 0.000001;

      if (exp.alpha <= 0 || exp.radius > exp.maxRadius) {
        this.explosions.splice(i, 1);
        continue;
      }

      this.ctx.beginPath();
      this.ctx.arc(exp.x, exp.y, exp.radius, 0, Math.PI * 2);
      this.ctx.strokeStyle = `rgba(255, 255, 255, ${exp.alpha})`;
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
    }

    this.stars.forEach(star => {
      this.explosions.forEach(exp => {
        const dx = star.x - exp.x;
        const dy = star.y - exp.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < exp.radius * 3.5) {
          const force = exp.power * (1 - distance / (exp.radius * 1.5));
          star.vx -= (dx / distance) * force;
          star.vy -= (dy / distance) * force;
        }
      });

      star.x += star.vx + (this.mouse.x * star.speed * 0.075);
      star.y += star.vy + (this.mouse.y * star.speed * 0.075);

      star.vx *= 0.95;
      star.vy *= 0.95;

      if (star.x > this.canvas.width) star.x = 0;
      if (star.x < 0) star.x = this.canvas.width;
      if (star.y > this.canvas.height) star.y = 0;
      if (star.y < 0) star.y = this.canvas.height;

      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      this.ctx.fillStyle = star.color;
      this.ctx.fill();
    });

    requestAnimationFrame(() => this.animate());
  }
}

window.addEventListener('load', () => {
  new Galaxy();
});

window.addEventListener('load', () => {
  new Galaxy();
});