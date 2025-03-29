let squares = [];
let maxSquares = 20;
let delay = 75; // Delay in frames before adding a new square
let frameCounter = 0;
let subRectangles = [];
let numSubRectangles = 34; // Number of sub rectangles between each main rectangle
let subRectFrameCounter = 0;
let subRectInterval = 1.5; // Interval between generating sub rectangles

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
  
  // Update and display main squares
  for (let i = squares.length - 1; i >= 0; i--) {
    squares[i].update();
    squares[i].display();
    
    // Remove square if it fills the screen
    if (squares[i].isFullScreen()) {
      if (i == 1) { // Check if the second rectangle is being removed
        subRectangles = []; // Clear sub rectangles when the second rectangle disappears
      }
      squares.splice(i, 1);
    }
  }

  // Generate sub rectangles between main squares
  if (squares.length > 1) {
    subRectFrameCounter++;
    if (subRectFrameCounter >= subRectInterval) {
      subRectangles = [];
      for (let i = 0; i < squares.length - 1; i++) {
        let current = squares[i];
        let next = squares[i + 1];
        for (let j = 0; j < numSubRectangles; j += 1) { // Increment by 2 to generate two sub rectangles
          let t1 = j / numSubRectangles;
          let t2 = (j + 1) / numSubRectangles;
          let x1 = lerp(current.x, next.x, t1);
          let y1 = lerp(current.y, next.y, t1);
          let w1 = lerp(current.w, next.w, t1);
          let h1 = lerp(current.h, next.h, t1);
          let c1 = lerpColor(current.color, next.color, t1);
          let growthRateX1 = lerp(current.growthRateX, next.growthRateX, t1);
          let growthRateY1 = lerp(current.growthRateY, next.growthRateY, t1);
          subRectangles.push(new SubRectangle(x1, y1, w1, h1, c1, growthRateX1, growthRateY1));

          let x2 = lerp(current.x, next.x, t2);
          let y2 = lerp(current.y, next.y, t2);
          let w2 = lerp(current.w, next.w, t2);
          let h2 = lerp(current.h, next.h, t2);
          let c2 = lerpColor(current.color, next.color, t2);
          let growthRateX2 = lerp(current.growthRateX, next.growthRateX, t2);
          let growthRateY2 = lerp(current.growthRateY, next.growthRateY, t2);
          subRectangles.push(new SubRectangle(x2, y2, w2, h2, c2, growthRateX2, growthRateY2));
        }
      }
      subRectFrameCounter = 0; // Reset the counter after generating sub rectangles
    }
  }

  // Display sub rectangles
  for (let subRect of subRectangles) {
    subRect.update();
    subRect.display();
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
    this.growthRateX = random(0.5, 2.5); // Slower growth
    this.growthRateY = random(0.5, 2.5); // Slower growth
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

class SubRectangle {
  constructor(x, y, w, h, color, growthRateX, growthRateY) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color;
    this.growthRateX = growthRateX;
    this.growthRateY = growthRateY;
  }
  
  update() {
    this.w += this.growthRateX;
    this.h += this.growthRateY;
  }
  
  display() {
    fill(this.color);
    rectMode(CENTER);
    rect(this.x, this.y, this.w, this.h);
  }
} 