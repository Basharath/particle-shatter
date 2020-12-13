import _ from './utils.js';

const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2,
};

const colors1 = ['#EF3D59', '#E17A47', '#EFC958', '#4AB19D', '#344E5C'];

const colors2 = ['#468966', '#FFF0A5', '#FFB03B', '#B64926', '#8E2800'];

const colors3 = ['#949021', '#5EB5E0', '#E0DC47', '#E03143', '#942833'];

const colors4 = ['#D41E21', '#FF751A', '#FECB04', '#04A46A', '#3498DB'];

const colors5 = ['#468966', '#FFF0A5', '#FFB03B', '#B64926', '#8E2800'];

addEventListener('resize', (e) => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  init();
});

addEventListener('click', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  init();
});

const friction = 0.9;
const gravity = 0.2;
// Particle
class Particle {
  constructor(x, y, radius, dx, dy) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.dx = dx;
    this.dy = dy;
    this.color = _.randomColor(colors1);
    this.hit = false;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
  update() {
    this.draw();
    this.x += this.dx;
    this.y += this.dy;

    if (
      this.x + this.radius + this.dx >= canvas.width ||
      this.x - this.radius < 0
    ) {
      this.dx = -this.dx;
    }

    if (this.y + this.radius + this.dy >= canvas.height) {
      this.dy = -this.dy * friction;
      this.hit = true;

      for (let i = 0; i < 3; i++) {
        const x = this.x;
        const y = this.y;
        const radius = this.radius / 2;
        const dx = Math.cos((Math.PI * (i + 1)) / 4) * 10;
        const dy = Math.sin((Math.PI * (i + 1)) / 4) * 10;
        pieces.push(new Piece(x, y, radius, dx, dy, this.color));
      }
    } else {
      this.dy += gravity;
    }
  }
}

class Piece {
  constructor(x, y, radius, dx, dy, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.dx = dx;
    this.dy = dy;
    this.color = color;
    this.alpha = 1;
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }
  update() {
    this.draw();
    this.alpha -= 0.0299;
    this.x += this.dx;
    this.y += -this.dy;
  }
}

// Implementation
let pieces = [];
let particles = [];
function init() {
  particles = [];
  for (let i = 0; i < 1; i++) {
    const radius = Math.random() * 20 + 3;
    const x = mouse.x;
    const y = mouse.y;
    const dx = 0.01;
    const dy = Math.random() * 15 + 1;
    particles.push(new Particle(x, y, radius, dx, dy));
  }
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  ctx.fillStyle = 'rgba(0, 0, 0, 1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  particles.forEach((particle, index) => {
    if (particle.hit) {
      particles.splice(index, 1);
    } else {
      particle.update();
    }
  });
  pieces.forEach((piece, index) => {
    if (piece.alpha < 0) {
      pieces.slice(index, 1);
    } else piece.update();
  });
}

init();
animate();
