var x;
var y;
var currentAmp;
var turn;
var red;
var increaseAmp;
var increaseRed;
var freq;
var amp;

function setup() {
 size(900, 980);
 background(0);
  
 x = 0;
 y = 0;
 currentAmp = 0;
 turn = 0;
 red = 0;
 increaseAmp = false;
 increaseRed = false;

 freq = 20;
 amp = 1000;
}
 
function draw() {
  freq = .02;
  currentLine = (0.4) * 10;

  if (increaseAmp) {
    currentAmp = currentAmp - .01;
  } else {
    currentAmp = currentAmp + .01;
  }
   
  if (currentAmp == 1) {
    increaseAmp = true;
  } else if (currentAmp == 0) {
    increaseAmp = false;
  }
   
  if (increaseRed) {
    red = red + 1;
  } else {
    red = red - 1;
  }
  if (red == 255) {
    increaseRed = true;
  } else if (red == 0) {
    increaseRed = false;
  }
     
  turn = turn + 1;
   
  for(var deg = 0; deg < 360; deg = deg + 8)
  {
    makeSquiggle(deg, currentAmp, turn, red);
  }
}
 
function makeSquiggle(deg, wobble, turn, reddish) {
  pushMatrix();
  translate(width / 2, height / 2);

  rotate( radians(deg + (turn * .1)) );
   
  beginShape();
  fill(255, deg, 0, 10);
  
  for(var i = 0; i < 200; i++) {
    stroke(reddish, 0, 0, 30);
     
    x = i * currentLine;
    y = noise( x * freq, deg, wobble ) * amp;

    vertex(x, y);
  }

  endShape();
  popMatrix();
}
