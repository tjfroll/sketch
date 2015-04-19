var x;
var y;
var turn;
var currentAmp;
var increaseAmp;

function setup() {
  createCanvas(700, 780);
  background(0);

  x = 0;
  y = 0;
  turn = 0;
  currentAmp = 0;
  increaseAmp = false;
}
 
function draw() {

  if (increaseAmp) {
    currentAmp -= .01;
    if (currentAmp === 0) {
      increaseAmp = true;
    }
  } else {
    currentAmp += .01;
    if (currentAmp === 1) {
      increaseAmp = false;
    }
  }
     
  turn += 4; // turn rate
   
  for (var deg = 0; deg < 360; deg += 32) {
    makeSquiggle(deg, currentAmp, turn);
  }

  loadPixels();

  totalX = width * 4;
  size = floor(winMouseX / 50); //pseudo-pixel to operate on
  if(size > 64) {
    size = 64;
  } else if (size < 6) {
    size = 6
  }
  xSize = size * 4;

  // iterates through the whole width and height
  // y has to jump in increments of the window width because pixels[] is a flat array of all pixels
  for (var y = 0; y < totalX * height; y += totalX * size) {
    for (var x = 0; x < totalX; x += xSize) { // increment by pseudo-pixel

      // just pick the top-left pixel of the block to sample from
      sample = color(pixels[y + x], pixels[y + x + 1], pixels[y + x + 2]);

      br = brightness(sample) / 100; // fade to black over time
      rR = random(50) * br;
      rG = random(50) * br;
      rB = random(50) * br;

      ran = color(rR, rG, rB);

      lerped = lerpColor(ran, sample, .8);

      lR = red(lerped);
      lG = green(lerped);
      lB = blue(lerped);

      // assign to all the pixels of the block
      for (var pX = x; pX < x + xSize; pX += 4) {
        for (var pY = y; pY < y + (totalX * size); pY += totalX) {
          loc = (pY + pX);
          pixels[loc] = lR;
          pixels[loc + 1] = lG;
          pixels[loc + 2] = lB;
        }
      }
    }
  }

  updatePixels();
}
 
function makeSquiggle(deg, wobble, turn) {
  push();
  translate(width / 2, height / 2);

  rotate( radians(deg + (turn * .1)) );
   
  beginShape();

  fill(deg, 255 - deg, wobble * deg)

  for (var i = 0; i < 20; i++) {
    stroke(0, 0, 0, 100);
     
    x = i * .5;
    y = noise(x, deg, wobble) * 1000;

    vertex(x, y);
    vertex(x + 16, y + 16);
    vertex(x - 16, y - 16);
  }

  endShape();
  pop();
}
