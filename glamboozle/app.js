var turn;
var osc;
var increaseOsc;

var pxWidth;
var ctrX;
var ctrY;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);

  turn = 0;
  osc = 0;
  increaseOsc = true;

  pxWidth = width * 4;
  ctrX = width / 2;
  ctrY = height / 2;
}
 
function draw() {

  if (increaseOsc) {
    osc += .005;
    turn += 3; // turn rate
    if (osc > 1) {
      osc = 1;
      increaseOsc = false;
    }
  } else {
    osc -= .005;
    if (turn > 10) {
      turn -= 9;
    }
    if (osc < 0) {
      osc = 0;
      increaseOsc = true;
    }
  }
   
  for (var deg = 0; deg < 360; deg += 64) {
    push();
    var rng = random(50);
    translate(ctrX, ctrY);
    rotate( radians(deg + turn) );
    makeSquiggle(deg, turn, rng);

    pop();
  }
}
 
function makeSquiggle(deg, turn) {
  beginShape();

  var r = 180 - (deg / 3) + (turn / 5);
  var g = 100 - (turn / 3) + (deg / 5);
  var b = 10 + (deg * osc * 1.1);
  var a = 75;

  fill(r, g, b, a);
  stroke(r / 2, b / 2, g / 2, 40);

  for (var i = 0; i < 200; i += 10) {
    var x = i * turn / 3 * osc;
    var y = noise(i * .1, osc, 1 - osc) * (2000 * osc);

    vertex(x, y);
    vertex(x + 4, y - 64);
  }

  endShape();
}


function pixelate() {

  var size = getSize();
  var xSize = size * 4;
  var ySize = pxWidth * size;

  loadPixels();

  // iterates through the whole width and height
  // y has to jump in increments of the window width because pixels[] is a flat array of all pixels
  for (var y = 0; y < pxWidth * height; y += ySize) {
    for (var x = 0; x < pxWidth; x += xSize) { // increment by pseudo-pixel

      // just pick the top-left pixel of the block to sample from
      var sample = getSample(x, y);

      var lerped = randomLerp(sample);

      var r = red(lerped);
      var g = green(lerped);
      var b = blue(lerped);
      var a = alpha(lerped);

      // assign to all the pixels of the block
      for (var pX = x; pX < x + xSize; pX += 4) {
        for (var pY = y; pY < y + ySize; pY += pxWidth) {
          var loc = (pY + pX);
          setPixel(loc, r, g, b, a);
        }
      }
    }
  }

  updatePixels();
}

function setPixel(loc, r, g, b, a) {
  pixels[loc] = r;
  pixels[loc + 1] = g;
  pixels[loc + 2] = b;
  pixels[loc + 3] = a;
}

function getSample(x, y) {
  var xy = x + y;
  return color(pixels[xy], pixels[xy + 1], pixels[xy + 2], pixels[xy + 3]);
}

function getSize() {
  var size = floor(mouseX / 50); //pseudo-pixel to operate on
  if(size > 64) {
    size = 64;
  } else if (size < 6) {
    size = 6
  }
  return size
}

function randomLerp(sample) {
  var br = brightness(sample) / 80; // fade to black over time
  var rR = random(50) * br;
  var rG = random(50) * br;
  var rB = random(50) * br;
  var rA = alpha(sample);
  var ran = color(rR, rG, rB, rA);
  return lerpColor(ran, sample, .7);
}