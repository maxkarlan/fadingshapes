let squares = [];
let maxSquares = 20;
let delay = 45; // Delay in frames before adding a new square
let frameCounter = 0;

function setup() {
  let side = min(windowWidth, windowHeight) * 2 / 3;
  let cnv = createCanvas(side, side);
  noStroke();
  frameRate(60);
  squares.push(new GrowingSquare(width / 2, height / 2));
  // Center the canvas
  let x = (windowWidth - width) / 2;
  let y = (windowHeight - height) / 2;
  cnv.position(x, y);
}

function draw() {
  background(0);
  
  // Update and display squares
  for (let i = squares.length - 1; i >= 0; i--) {
    squares[i].update();
    squares[i].display();
    
    // Remove square if it fills the screen
    if (squares[i].isFullScreen()) {
      squares.splice(i, 1);
    }
  }
  
  // Add a new square if there are less than maxSquares and delay has passed
  if (squares.length < maxSquares && frameCounter >= delay) {
    squares.push(new GrowingSquare(width / 2, height / 2));
    frameCounter = 0; // Reset the counter after adding a square
  }
  
  frameCounter++;
}

class GrowingSquare {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 1;
    this.h = 1;
    this.growthRateX = random(0.1, 5); // Slower growth
    this.growthRateY = random(0.1, 5); // Slower growth
    this.growFasterHorizontally = random() < 0.5;
    this.color = color(random(255), random(255), random(255), 255); // Start fully opaque
  }
  
  update() {
    if (this.growFasterHorizontally) {
      this.w += this.growthRateX;
      this.h += this.growthRateY * 0.5;
    } else {
      this.h += this.growthRateY;
      this.w += this.growthRateX * 0.5;
    }
    // Update transparency based on size
    let maxSize = max(width, height);
    let currentSize = max(this.w, this.h);
    let alpha = map(currentSize, 1, maxSize, 255, 0);
    this.color.setAlpha(alpha);
  }
  
  display() {
    fill(this.color);
    rectMode(CENTER);
    rect(this.x, this.y, this.w, this.h);
  }
  
  isFullScreen() {
    return this.w >= width && this.h >= height;
  }
} 