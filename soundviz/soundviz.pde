/**
  * This sketch demonstrates how to monitor the currently active audio input 
  * of the computer using an AudioInput. What you will actually 
  * be monitoring depends on the current settings of the machine the sketch is running on. 
  * Typically, you will be monitoring the built-in microphone, but if running on a desktop
  * it's feasible that the user may have the actual audio output of the computer 
  * as the active audio input, or something else entirely.
  * <p>
  * Press 'm' to toggle monitoring on and off.
  * <p>
  * When you run your sketch as an applet you will need to sign it in order to get an input.
  * <p>
  * For more information about Minim and additional features, 
  * visit http://code.compartmental.net/minim/ 
  */

import ddf.minim.*;
import ddf.minim.analysis.*;
import ddf.minim.effects.*;

Minim minim;
AudioInput in;
FFT fft;
int fftavgsize;
int fftspecsize;

WindowFunction window;
BeatDetect beat;

// A weighting constants.
float Ac1 = 12200*12200;
float Ac2 = 20.6*20.6;
float Ac3 = 107.7*107.7;
float Ac4 = 737.9*737.9;

float fftspecscale = 180;
float fftavgscale = 200;

float fftavgwidth = 4;
float fftspecwidth = 2;

int numFreqs = 1500;
float freq0 = 20;
float dfreq = 6;

float[] Aweights = new float[numFreqs];

float[] fft0;
float[] avgfft;

float e00 = 0;
float e01 = 0;
float e10 = 0;
float e11 = 0;

void setup()
{
  //size(512, 200, P3D);
  size(displayWidth, displayHeight, P3D);
  colorMode(HSB, 1.0);

  minim = new Minim(this);
  
  // use the getLineIn method of the Minim object to get an AudioInput
  in = minim.getLineIn(Minim.STEREO, 1024);
  in.mute();
  
  fft = new FFT(in.bufferSize(), in.sampleRate());
  window = FFT.HAMMING;
  fft.window(window);
  fft.logAverages(60, 8);
  fftavgsize = fft.avgSize();
  fftspecsize = fft.specSize();
  
  avgfft = new float[fftavgsize];  
  fft0 = new float[fftspecsize];
  
  
  // Calculate A-weighting weights.
  for(int i = 0; i < numFreqs; i++)
  {
    float theFreq = freq0 + dfreq * i;
    Aweights[i] = Aweight(theFreq);
  }
  
  beat = new BeatDetect();
  beat.detectMode(BeatDetect.FREQ_ENERGY);
  
}

void draw()
{
  println(frameRate);
  background(0);
  stroke(255);
  fill(0,1,1);
  
  // Copy
  //arrayCopy(fft1, fft0);
  e00 = e10;
  e01 = e11;
  
  fft.forward(in.mix);
  
  // Get and display log-averaged FFT values.
  for(int i = 0; i < fftavgsize; i++)
  {
    avgfft[i] = fft.getAvg(i);
    
    // Display the log-averaged spectrum on top.
    rect(i*fftavgwidth, 0, fftavgwidth, avgfft[i]*fftavgscale);
  }
  
  //  Get and display all fft bands.
  for(int i = 0; i < fftspecsize; i++)
  {
    //float theFreq = freq0 + dfreq * i;
    fft0[i] = fft.getBand(i);
    
    // Display all of the fft bands on bottom.
    rect(i*fftspecwidth, height/2, fftspecwidth, fft0[i]*fftspecscale);
  }
  
  // Display a circle with radius proportional to the energy of some portion of the
  // fft spectrum or avg arrays.
  float e0 = 300*getEnergy(avgfft, 4 * floor(fftavgsize/5.), 25);
  println(e0);
  ellipse(3*width/4, 1*height/4, e0, e0);
  
  //beat.detect(in.mix);
  
  //e10 = 3*getDiffEnergy(0, 30);
  //float r = max(0, e10-e00);
  //ellipse(width/2, height/5, r,r);
  //e11 = 1*getMaxDivAvg();
  //r = max(0, e11);
//  if(beat.isRange(5, 20, 8))
//  {
//    r = 20;
//  }
//  else
//  {
//    r = 2;
//  }
//  ellipse(width/2, 4*height/5, r, r);
  
  
}

void keyPressed()
{
  if ( key == 'm' || key == 'M' )
  {
    if ( in.isMonitoring() )
    {
      in.disableMonitoring();
    }
    else
    {
      in.enableMonitoring();
    }
  }
  
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

float Aweight(float f)
{
  float f2 = pow(f, 2);
  float Raf = (Ac1 * pow(f2, 2)) / ((f2 + Ac2) * sqrt((f2 + Ac3) * (f2 + Ac4)) * (f2 + Ac1));
  return Raf;
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

// Get the energy (|| ||_2^2) of array_ across indices [x0, x0 + width_-1], divided by
// the number of indices used in the calculation (might be less than width_).
float getAvgEnergy(float[] vec_, int x0, int width_)
{
  float energy = 0;
  float x1 = min(x0 + width_, vec_.length);
  for(int i = x0; i < x1; i++)
  {
    float dfft = vec_[i];
    energy += dfft * dfft;
  }
  return energy / (x1 - x0 + 1);
}

float getMaxDivAvg()
{
  int L = fft0.length; 
  float maxval = 0;
  float calcval = 0;
  float avgval = 0;
  for(int i = 0; i < L; i++)
  {
    float fftval = fft0[i] * fft0[i];
    avgval += 1./L * fftval;
    if(fftval > maxval)
    {
      maxval = fftval;
    }
    
    if(fftval > 0.75 * maxval)
    {
      calcval += fftval;
    }
  }
  if(avgval > 1)
  {
    return calcval / avgval;
  }
  else
  {
    return 0;
  }
}
