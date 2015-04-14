// Radial "lines" are sent out at angles [0, dt, 2dt, ..., (T-1)*dt].
var T = 90;
var dt = 2 * Math.PI / T;

// Each "line" is composed of numsegs segments. Each successive segment vertex is drawn at coordinates [x,y] chosen uniformly at random from [segrangex, segrangey] (relative to the previous segment vertex). 
var segrangex = [50, 200];
var segrangey = [-10, 10];
var numsegs = 15;

// Keep track of the number of frames so far.
var time = 0;

// Value between 0 and 1 controlling fill hue.
var fillvar = 0;

// Rate of change of fillvar.
var df;

// Tracks whether fillvar should be adding or subtracting df.
var dfsign = 1;

// Audio input.
var audio;

// Audio input volume.
var vol;

// FFT object, takes a Fourier transform of the sound buffer.
var fft;

// Array containing the FFT spectrum values.
var spectrum;

// Values containing the energy of certain portions of the FFT spectrum.
var energyl;  // low (bass) range energy.
var energylm; // low-mid range energy.
var energym;  // mid range energy.
var energyhm; // high-mid range energy.
var energyh;   // high (treble) range energy.
function setup()
{
	// Create the display canvas.
	createCanvas(windowWidth, windowHeight);

	// Make the screen black.
	background(0);

	// Set the color mode.
	colorMode(HSB, 1);
	
	// Initialize audio input.
	audio = new p5.AudioIn();
	audio.start();
	//audio.connect();
	//console.log(audio.listSources());
	
	// Initialize the FFT object.
	fft = new p5.FFT();
	fft.setInput(audio);
	fft.smooth(0.8);
}

function draw()
{
	// Increment time.
	time += 1;
	
	// Get the spectrum of the current sound buffer. Range [0, 255].
	spectrum = fft.analyze();

	// Get energy values in the predefined spectral ranges.
	energyl =  fft.getEnergy("bass");
	energylm = fft.getEnergy("lowMid");
	energym =  fft.getEnergy("mid");
	energyhm = fft.getEnergy("highMid");
	energyh =  fft.getEnergy("treble");
	
	// Scale segment x length distribution using bass energy levels.
	segrangex[0] = 0.1 + energyl / 2.;
	segrangex[1] = 0.5 + energyl;

	// Scale segment y length distribution using mid energy levels and
	// high-mid energy levels.
	segrangey[0] = (-1 + energyhm / 255.) * (energym / 10.);
	segrangey[1] = (energyhm / 255.) * (energym / 10.);
	

	// Get the volume level of the current sound buffer. Range [0, 1].
	vol = audio.getLevel();
	
	// Update fillvar, df, and dfsign.
	df = dfsign * (0.002 + 0.058 * vol); 
	fillvar = constrain(fillvar + df, 0, 1);
	if (fillvar === 1 || fillvar === 0)
	{
		dfsign *= -1;
	}
	// Fill is set within the newline function, so that it can vary
	// within a single "line".
	
	// Stroke weight ranges from 0.05 to 1.05, changes over time.
	var strokeweight = 0.05 + ((time / 120.) % 1);
	strokeWeight(strokeweight);
	
	// Create a "line" emanating from the center of the window at a
	// range of angles in [0, 2*PI].
	for (t = 0; t < T; t++)
	{
		// Rotation angle for the next "line".
		var angle = t * dt;

		push();
		translate(width/2, height/2);
		rotate(angle);

		// Draw the "line".
		newline();

		pop();
	}
}

// Draw a new "line".
function newline()
{
	// Additional fill variable, to allow the color to change throughout
	// the "line".
	var fillvar2 = 0;

	// Rate of change of fillvar2.
	var df2 = 1./1000 * energyh;

	// Draw the "line".
	beginShape();
	for(i = 0; i < numsegs; i++)
	{
		// Increment fillvar2.
		fillvar2 += df2;

		// Create the final fill hue.
		var fhue = (fillvar + fillvar2) % 1;
		fill(fhue, 1, 1, 0.03);
		stroke(1-fhue, 1, 1, 0.06);

		// [x,y] coordinates of the next vertex.
		var x = segrangex[0] + random(segrangex[1]-segrangex[0]);
		var y = segrangey[0] + random(segrangey[1]-segrangey[0]);
		vertex(x,y);
		
		// Recenter coordinate system on the current vertex.
		translate(x, 0);
	}
	endShape();
}
