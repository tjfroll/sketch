// FFT object, takes a Fourier transform of the sound buffer.
FFT = p5.FFT

// Number of elements in the FFT spectrum averages array.
var fftavgsize;

var audio;

// Number of elements in the FFT spectrum array.
var fftspecsize;

// Scale spectrum data for ease of visualization.
var fftspecscale = 180;
var fftavgscale = 200;

// Width of spectrum bars as displayed.
var fftavgwidth = 4;
var fftspecwidth = 2;


// Array containing each frame's FFT spectrum.
var fft0;

// Array containing each frame's FFT log-averaged spectrum.
var avgfft;

function setup() {
  createCanvas(windowWidth - 100, windowHeight - 100);

  audio = new p5.AudioIn();
  
  audio.start();

  audio.connect();

  console.log(audio.listSources());
  
  // Initializes the FFT object.
  fft = new FFT(audio.bufferSize(), audio.sampleRate());
  
  // Use a Hamming FFT window.
  //window = FFT.HAMMING;
  //fft.window(window);
  
  // Specify the log-averaging procedure - base frequency of 60Hz, 8 bands per octave.
  fft.logAverages(60, 8);
  
  // Get the sizes of the log-averaged and full spectra.
  fftavgsize = fft.avgSize();
  fftspecsize = fft.specSize();
  
  // Iniitalize these guys.
  avgfft = new float[fftavgsize];  
  fft0 = new float[fftspecsize];
  
}

function draw()
{
  println(frameRate);
  background(0);
  stroke(255);
  fill(0,1,1);
  
  fft.forward(audio.mix);
  
  // Get and display log-averaged FFT values.
  for(var i = 0; i < fftavgsize; i++) {
    avgfft[i] = fft.getAvg(i);
    
    // Display the log-averaged spectrum on top.
    rect(i*fftavgwidth, 0, fftavgwidth, avgfft[i]*fftavgscale);
  }
  
  //  Get and display all fft bands.
  for(var i = 0; i < fftspecsize; i++) {
    //var theFreq = freq0 + dfreq * i;
    fft0[i] = fft.getBand(i);
    
    // Display all of the fft bands on bottom.
    rect(i * fftspecwidth, height / 2, fftspecwidth, fft0[i] * fftspecscale);
  }
  
  // Display a circle with radius proportional to the energy of some portion of the
  // fft spectrum or avg arrays.
  var e0 = 300*getEnergy(avgfft, 4 * floor(fftavgsize/5.), 25);
  println(e0);
  ellipse(3 * width / 4, 1 * height / 4, e0, e0);
}

function keyPressed() {
  // If 'q' is pressed, stop the Minim functions and exit the sketch.
  if(key == 'q' || key == 'Q')
  {
    stop();
    exit();
  }
}

function stop()
{
  // always close Minim audio classes when you are done with them
  audio.close();
  audio.stop();
}

// Get the squared energy of vec_ across indices [x0, x0 + width_-1].
// (energy = vec_[x0]^2 + vec_[x0+1]^2 + ... + vec_[x0+width_-1]^2).
function getEnergy(vec_, x0, width_) {
  var energy = 0;
  
  // Array bounds check.
  var x1 = min(x0 + width_, vec_.length);
  
  for(var i = x0; i < x1; i++)
  {
    var dfft = vec_[i];
    energy += dfft * dfft;
  }
  return energy;
}
