import ddf.minim.*;
import ddf.minim.analysis.*;
import ddf.minim.effects.*;

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

Minim minim;
AudioInput in;
FFT fft;
WindowFunction window;
float[] fftavg;

float bpfreq = 400;
float bpbw = 40;


void setup()
{
  size(displayWidth, displayHeight, P3D);
  background(0);
  colorMode(HSB, 1.);
  
  // Minim audio setup.
  minim = new Minim(this);
  
  // use the getLineIn method of the Minim object to get an AudioInput
  in = minim.getLineIn(Minim.STEREO, 1024);
  in.mute();
  
  fft = new FFT(in.bufferSize(), in.sampleRate());
  window = FFT.HAMMING;
  fft.window(window);
  fft.logAverages(60, 8);
  
  fftavg = new float[fft.avgSize()];
 
}

void draw()
{
  time += 1;  
  
  // Audio analysis.
  fft.forward(in.mix);
  
  for(int i = 0; i < fft.avgSize(); i++)
  {
    fftavg[i] = fft.getAvg(i);
  }
    
  fvar = constrain(fvar + df, 0, 1);
  if(fvar == 0 || fvar == 1)
  {
    df *= -1;
  }
  
  //fill(fvar, 1, 1, 0.03);
  //stroke(1-fvar, 1, 1, 0.16);
  //noStroke();
  strokeWeight(0.1);
  
  yamp = map(mouseX, 0, 1400, 20, 60);
  //seglength = map(mouseY, 0, 800, 1, 50); 
  seglength = max(1, 300 * getEnergy(fftavg, 4 * floor(fft.avgSize()/5.), 25));
  
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
  float fvar2 = 0;
  float dfv2 = ((time / 100.) % 2) / numsegs;
  beginShape();
  for(int i = 0; i < numsegs; i++)
  {
   fvar2 += dfv2;
   float fv = (fvar + fvar2) % 1;
   fill(fvar, 1, 1, 0.03);
   stroke(1-fvar, 1, 1, 0.06);
   float x =  coffset + i * (seglength + i);
   float y = (-1 + random(2.)) * yamp;
   vertex(x, y);
  }
  endShape();
}

void keyPressed()
{
  if(key == 'q' || key == 'Q')
  {
    stop();
    exit();
  }
}

void stop()
{
  // always close Minim audio classes when you are done with them
  in.close();
  minim.stop();
  
  super.stop();
}

// Get the energy (|| ||_2^2) of array_ across indices [x0, x0 + width_-1].
float getEnergy(float[] vec_, int x0, int width_)
{
  float energy = 0;
  float x1 = min(x0 + width_, vec_.length);
  for(int i = x0; i < x1; i++)
  {
    float dfft = vec_[i];
    energy += dfft * dfft;
  }
  return energy;
}
  
