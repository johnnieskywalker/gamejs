// Get the canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game settings
const gravity = 0.5;
const friction = 0.8;

// Player object
const player = {
  x: 50,
  y: canvas.height - 150,
  width: 32,
  height: 32,
  velocityX: 0,
  velocityY: 0,
  speed: 3,
  jumping: false,
  color: 'red',
};

// Keyboard input
const keys = {};

// Platforms array
const platforms = [];

// Create platforms
platforms.push(
  { x: 0, y: canvas.height - 50, width: canvas.width, height: 50, color: 'green' }, // Ground
  { x: 200, y: canvas.height - 150, width: 100, height: 20, color: 'green' },
  { x: 400, y: canvas.height - 250, width: 100, height: 20, color: 'green' },
  { x: 600, y: canvas.height - 350, width: 100, height: 20, color: 'green' }
);

// Event listeners for keyboard input
document.addEventListener('keydown', (e) => {
  keys[e.code] = true;
});

document.addEventListener('keyup', (e) => {
  keys[e.code] = false;
});

// Game loop
function gameLoop() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Handle player input
  if (keys['ArrowRight'] || keys['KeyD']) {
    player.velocityX = player.speed;
  } else if (keys['ArrowLeft'] || keys['KeyA']) {
    player.velocityX = -player.speed;
  } else {
    player.velocityX *= friction;
  }

  if ((keys['ArrowUp'] || keys['Space'] || keys['KeyW']) && !player.jumping) {
    player.velocityY = -10;
    player.jumping = true;
  }

  // Apply gravity
  player.velocityY += gravity;

  // Update player position
  player.x += player.velocityX;
  player.y += player.velocityY;

  // Collision detection with platforms
  platforms.forEach((platform) => {
    if (
      player.x < platform.x + platform.width &&
      player.x + player.width > platform.x &&
      player.y < platform.y + platform.height &&
      player.y + player.height > platform.y
    ) {
      // Check from which side the collision is happening
      if (player.velocityY > 0) {
        player.y = platform.y - player.height;
        player.velocityY = 0;
        player.jumping = false;
      }
    }
  });

  // Prevent player from going off-screen horizontally
  if (player.x < 0) {
    player.x = 0;
  } else if (player.x + player.width > canvas.width) {
    player.x = canvas.width - player.width;
  }

  // Prevent player from falling off the screen
  if (player.y > canvas.height) {
    // Reset player position
    player.x = 50;
    player.y = canvas.height - 150;
    player.velocityX = 0;
    player.velocityY = 0;
  }

  // Draw platforms
  platforms.forEach((platform) => {
    ctx.fillStyle = platform.color;
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
  });

  // Draw player
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Request the next frame
  requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
