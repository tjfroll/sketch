// Minim libraries for sound analysis.
import ddf.minim.*;
import ddf.minim.analysis.*;

// The basic Minim object.
Minim minim;

// Gets sound input from default recording device (should be stereo mix).
AudioInput in;

// FFT object, takes a Fourier transform of the sound buffer.
FFT fft;

// Number of elements in the FFT spectrum averages array.
int fftavgsize;

// Number of elements in the FFT spectrum array.
int fftspecsize;

// FFT time window.
WindowFunction window;

// Scale spectrum data for ease of visualization.
float fftspecscale = 180;
float fftavgscale = 200;

// Width of spectrum bars as displayed.
float fftavgwidth = 4;
float fftspecwidth = 2;


// Array containing each frame's FFT spectrum.
float[] fft0;

// Array containing each frame's FFT log-averaged spectrum.
float[] avgfft;

void setup()
{
  size(displayWidth, displayHeight, P3D);
  colorMode(HSB, 1.0);

  minim = new Minim(this);
  
  // Use the getLineIn method of the Minim object to get an AudioInput
  in = minim.getLineIn(Minim.STEREO, 1024);
  
  // Muting the line in prevents feedback, somehow.
  in.mute();
  
  // Initializes the FFT object.
  fft = new FFT(in.bufferSize(), in.sampleRate());
  
  // Use a Hamming FFT window.
  window = FFT.HAMMING;
  fft.window(window);
  
  // Specify the log-averaging procedure - base frequency of 60Hz, 8 bands per octave.
  fft.logAverages(60, 8);
  
  // Get the sizes of the log-averaged and full spectra.
  fftavgsize = fft.avgSize();
  fftspecsize = fft.specSize();
  
  // Iniitalize these guys.
  avgfft = new float[fftavgsize];  
  fft0 = new float[fftspecsize];
  
}

void draw()
{
  println(frameRate);
  background(0);
  stroke(255);
  fill(0,1,1);
  
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
  ellipse(3*width/4, 1*height/4, e0, e0);
}

void keyPressed()
{
  // If 'q' is pressed, stop the Minim functions and exit the sketch.
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

// Get the squared energy of vec_ across indices [x0, x0 + width_-1].
// (energy = vec_[x0]^2 + vec_[x0+1]^2 + ... + vec_[x0+width_-1]^2).
float getEnergy(float[] vec_, int x0, int width_)
{
  float energy = 0;
  
  // Array bounds check.
  float x1 = min(x0 + width_, vec_.length);
  
  for(int i = x0; i < x1; i++)
  {
    float dfft = vec_[i];
    energy += dfft * dfft;
  }
  return energy;
}
