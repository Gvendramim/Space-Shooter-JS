const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

let score = 0;
let gameOver = false;

const input = {
  left: false,
  right: false,
  space: false,
};

window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') input.left = true;
  if (e.key === 'ArrowRight') input.right = true;
  if (e.key === ' ') input.space = true;
});

window.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowLeft') input.left = false;
  if (e.key === 'ArrowRight') input.right = false;
  if (e.key === ' ') input.space = false;
});

const resetButton = document.createElement('button');
resetButton.innerText = 'Reset';
resetButton.style.position = 'absolute';
resetButton.style.top = '50%';
resetButton.style.left = '50%';
resetButton.style.transform = 'translate(-50%, -50%)';
resetButton.style.padding = '10px 20px';
resetButton.style.marginTop = '50px';
resetButton.style.fontSize = '20px';
resetButton.style.display = 'none';
document.body.appendChild(resetButton);

resetButton.addEventListener('click', resetGame);

class Player {
  constructor() {
    this.width = 50;
    this.height = 50;
    this.x = canvas.width / 2 - this.width / 2;
    this.y = canvas.height - this.height - 10;
    this.speed = 12;
    this.color = 'cyan';
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  move() {
    if (input.left && this.x > 0) this.x -= this.speed;
    if (input.right && this.x < canvas.width - this.width) this.x += this.speed;
  }
}

const player = new Player();

class Enemy {
  constructor(x, speed) {
    this.width = 40;
    this.height = 40;
    this.x = x;
    this.y = 0;
    this.speed = speed;
    this.color = 'red';
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update() {
    this.y += this.speed;
  }
}

const enemies = [];
function spawnEnemy() {
  const x = Math.random() * (canvas.width - 40);
  const speed = Math.random() * 2 + 1 + difficulty * 0.2;
  enemies.push(new Enemy(x, speed));
}

class Bullet {
  constructor(x, y) {
    this.width = 5;
    this.height = 15;
    this.x = x;
    this.y = y;
    this.speed = 9;
    this.color = 'yellow';
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update() {
    this.y -= this.speed;
  }
}

const bullets = [];
function shoot() {
  bullets.push(new Bullet(player.x + player.width / 2 - 2.5, player.y));
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

let difficulty = 1;

function drawScore() {
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 10, 30);
}

function increaseDifficulty() {
  difficulty++;
}

function updateGame() {
  if (gameOver) {
    ctx.fillStyle = 'red';
    ctx.font = '40px Arial';
    ctx.fillText('GAME OVER', canvas.width / 2 - 120, canvas.height / 2);
    resetButton.style.display = 'block';
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  player.move();
  player.draw();

  bullets.forEach((bullet, bulletIndex) => {
    bullet.update();
    bullet.draw();

    if (bullet.y < 0) bullets.splice(bulletIndex, 1);
  });

  enemies.forEach((enemy, enemyIndex) => {
    enemy.update();
    enemy.draw();

    bullets.forEach((bullet, bulletIndex) => {
      if (detectCollision(bullet, enemy)) {
        bullets.splice(bulletIndex, 1);
        enemies.splice(enemyIndex, 1);
        score += 10;
      }
    });

    if (detectCollision(enemy, player)) {
      gameOver = true;
    }

    if (enemy.y > canvas.height) {
      enemies.splice(enemyIndex, 1);
    }
  });

  drawScore();
  requestAnimationFrame(updateGame);
}

setInterval(spawnEnemy, 1000);
setInterval(increaseDifficulty, 10000);
setInterval(() => {
  if (input.space) shoot();
}, 100);

function resetGame() {
  score = 0;
  gameOver = false;
  difficulty = 1;
  bullets.length = 0;
  enemies.length = 0;
  player.x = canvas.width / 2 - player.width / 2;
  resetButton.style.display = 'none'; 
  updateGame();
}

updateGame();
