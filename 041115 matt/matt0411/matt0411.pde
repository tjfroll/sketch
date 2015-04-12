
float T = 90;
float dt = 2 * PI / T;
float angle;

float yamp = 10;


float coffset = 0;

int numsegs = 15;
float seglength = 100;

int time = 0;
int resetcount = 25;

float fvar = 0;
float df = 0.01;


void setup()
{
  size(1366, 768);
  background(0);
  colorMode(HSB, 1.);
}

void draw()
{
  time += 1;
  if(time % resetcount == -1)
  {
    background(0);
  }
  
  fvar = constrain(fvar + df, 0, 1);
  if(fvar == 0 || fvar == 1)
  {
    df *= -1;
  }
  
  fill(fvar, 1, 1, 0.03);
  stroke(0.0, 0.0, 0.8);
  strokeWeight(0.5);
  
  yamp = map(mouseX, 0, 1400, 20, 60);
  seglength = map(mouseY, 0, 800, 1, 50); 
  
  for(int t = 0; t < T; t++)
  {
    angle = t * dt;
    pushMatrix();
    translate(width/2, height/2);
    rotate(angle);
    newline(coffset, numsegs);
    popMatrix();
  }
  
}

void newline(float coffset, int numsegs)
{
  beginShape();
  for(int i = 0; i < numsegs; i++)
  {
   float x =  coffset + i * (seglength + i);
   float y = (-1 + random(2.)) * yamp;
   vertex(x, y);
  }
  endShape();
}
  
