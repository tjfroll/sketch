/**
 * The *AudioSource object creates an analyzer node, sets up a repeating function with setInterval
 * which samples the input and turns it into an FFT array. The object has two properties:
 * streamData - this is the Uint8Array containing the FFT data
 * volume - cumulative value of all the bins of the streaData.
 *
 * The MicrophoneAudioSource uses the getUserMedia interface to get real-time data from the user's microphone. Not used currently but included for possible future use.
 */
var SoundCloudAudioSource = function(player) {
    var self = this;
    var analyser;
    var audioCtx = new (window.AudioContext || window.webkitAudioContext);
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    var source = audioCtx.createMediaElementSource(player);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    player.setAttribute('src', streamUrl);
    player.play();
    return audioCtx;
    /*

    //this is the part we want to mess with
    var sampleAudioStream = function() {
        analyser.getByteFrequencyData(self.streamData);
        // calculate an overall volume value
        var total = 0;
        for (var i = 0; i < 80; i++) { // get the volume from the first 80 bins, else it gets too loud with treble
            total += self.streamData[i];
        }
        self.volume = total;
    };
    setInterval(sampleAudioStream, 20);


    // public properties and methods
    this.volume = 0;
    this.streamData = new Uint8Array(128);
    this.playStream = function(streamUrl) {
        // get the input stream from the audio element
        player.addEventListener('ended', function(){
            self.directStream('coasting');
        });
        player.setAttribute('src', streamUrl);
        player.play();
    } */
};

/**
 * Makes a request to the Soundcloud API and returns the JSON data.
 */
var SoundcloudLoader = function(player,uiUpdater) {
    var self = this;
    var client_id = "CLIENT_ID_HERE_********"; // to get an ID go to http://developers.soundcloud.com/
    this.sound = {};
    this.streamUrl = "";
    this.errorMessage = "";
    this.player = player;
    this.uiUpdater = uiUpdater;

    /**
     * Loads the JSON stream data object from the URL of the track (as given in the location bar of the browser when browsing Soundcloud),
     * and on success it calls the callback passed to it (for example, used to then send the stream_url to the audiosource object).
     * @param track_url
     * @param callback
     */
    this.loadStream = function(track_url, successCallback, errorCallback) {
        SC.initialize({
            client_id: client_id
        });
        SC.get('/resolve', { url: track_url }, function(sound) {
            if (sound.errors) {
                self.errorMessage = "";
                for (var i = 0; i < sound.errors.length; i++) {
                    self.errorMessage += sound.errors[i].error_message + '<br>';
                }
                self.errorMessage += 'Make sure the URL has the correct format: https://soundcloud.com/user/title-of-the-track';
                errorCallback();
            } else {

                if(sound.kind=="playlist"){
                    self.sound = sound;
                    self.streamPlaylistIndex = 0;
                    self.streamUrl = function(){
                        return sound.tracks[self.streamPlaylistIndex].stream_url + '?client_id=' + client_id;
                    }
                    successCallback();
                }else{
                    self.sound = sound;
                    self.streamUrl = function(){ return sound.stream_url + '?client_id=' + client_id; };
                    successCallback();
                }
            }
        });
    };


    this.directStream = function(direction){
        if(direction=='toggle'){
            if (this.player.paused) {
                this.player.play();
            } else {
                this.player.pause();
            }
        }
        else if(this.sound.kind=="playlist"){
            if(direction=='coasting') {
                this.streamPlaylistIndex++;
            }else if(direction=='forward') {
                if(this.streamPlaylistIndex>=this.sound.track_count-1) this.streamPlaylistIndex = 0;
                else this.streamPlaylistIndex++;
            }else{
                if(this.streamPlaylistIndex<=0) this.streamPlaylistIndex = this.sound.track_count-1;
                else this.streamPlaylistIndex--;
            }
            if(this.streamPlaylistIndex>=0 && this.streamPlaylistIndex<=this.sound.track_count-1) {
               this.player.setAttribute('src',this.streamUrl());
               this.uiUpdater.update(this);
               this.player.play();
            }
        }
    }
};

/**
 * Class to update the UI when a new sound is loaded
 * @constructor
 */
var UiUpdater = function() {
    var controlPanel = document.getElementById('controlPanel');
    var trackInfoPanel = document.getElementById('trackInfoPanel');
    var infoImage = document.getElementById('infoImage');
    var infoArtist = document.getElementById('infoArtist');
    var infoTrack = document.getElementById('infoTrack');
    var messageBox = document.getElementById('messageBox');

    this.clearInfoPanel = function() {
        // first clear the current contents
        infoArtist.innerHTML = "";
        infoTrack.innerHTML = "";
        trackInfoPanel.className = 'hidden';
    };
    this.update = function(loader) {
        // update the track and artist into in the controlPanel
        var artistLink = document.createElement('a');
        artistLink.setAttribute('href', loader.sound.user.permalink_url);
        artistLink.innerHTML = loader.sound.user.username;
        var trackLink = document.createElement('a');
        trackLink.setAttribute('href', loader.sound.permalink_url);

        if(loader.sound.kind=="playlist"){
            trackLink.innerHTML = "<p>" + loader.sound.tracks[loader.streamPlaylistIndex].title + "</p>" + "<p>"+loader.sound.title+"</p>";
        }else{
            trackLink.innerHTML = loader.sound.title;
        }

        var image = loader.sound.artwork_url ? loader.sound.artwork_url : loader.sound.user.avatar_url; // if no track artwork exists, use the user's avatar.
        infoImage.setAttribute('src', image);

        infoArtist.innerHTML = '';
        infoArtist.appendChild(artistLink);

        infoTrack.innerHTML = '';
        infoTrack.appendChild(trackLink);

        // display the track info panel
        trackInfoPanel.className = '';

        // add a hash to the URL so it can be shared or saved
        var trackToken = loader.sound.permalink_url.substr(22);
        window.location = '#' + trackToken;
    };
    this.toggleControlPanel = function() {
        if (controlPanel.className.indexOf('hidden') === 0) {
            controlPanel.className = '';
        } else {
            controlPanel.className = 'hidden';
        }
    };
    this.displayMessage = function(title, message) {
        messageBox.innerHTML = ''; // reset the contents

        var titleElement = document.createElement('h3');
        titleElement.innerHTML = title;

        var messageElement = document.createElement('p');
        messageElement.innerHTML = message;

        var closeButton = document.createElement('a');
        closeButton.setAttribute('href', '#');
        closeButton.innerHTML = 'close';
        closeButton.addEventListener('click', function(e) {
            e.preventDefault();
            messageBox.className = 'hidden';
        });

        messageBox.className = '';
        // stick them into the container div
        messageBox.appendChild(titleElement);
        messageBox.appendChild(messageElement);
        messageBox.appendChild(closeButton);
    };
};

var audioSource;
var player;
var uiUpdater;
var loader;

window.onload = function init() {

    player =  document.getElementById('player');
    uiUpdater = new UiUpdater();
    loader = new SoundcloudLoader(player,uiUpdater);

    audioSource = new SoundCloudAudioSource(player);
    var form = document.getElementById('form');
    var loadAndUpdate = function(trackUrl) {
        loader.loadStream(trackUrl,
            function() {
                uiUpdater.clearInfoPanel();
                audioSource.playStream(loader.streamUrl());
                uiUpdater.update(loader);
                setTimeout(uiUpdater.toggleControlPanel, 3000); // auto-hide the control panel
            },
            function() {
                uiUpdater.displayMessage("Error", loader.errorMessage);
            });
    };

    uiUpdater.toggleControlPanel();
    // on load, check to see if there is a track token in the URL, and if so, load that automatically
    if (window.location.hash) {
        var trackUrl = 'https://soundcloud.com/' + window.location.hash.substr(1);
        loadAndUpdate(trackUrl);
    }

    // handle the form submit event to load the new URL
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        var trackUrl = document.getElementById('input').value;
        loadAndUpdate(trackUrl);
    });
    var toggleButton = document.getElementById('toggleButton')
    toggleButton.addEventListener('click', function(e) {
        e.preventDefault();
        uiUpdater.toggleControlPanel();
    });

    window.addEventListener("keydown", keyControls, false);
     
    function keyControls(e) {
        switch(e.keyCode) {
            case 32:
                // spacebar pressed
                loader.directStream('toggle');
                break;
            case 37:
                // left key pressed
                loader.directStream('backward');
                break;
            case 39:
                // right key pressed
                loader.directStream('forward');
                break;
        }   
    }
};








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
var fill_h = 0;
var fill_h3 = 0;

// Value between 0 and 1 controlling fill brightness.
var fill_b = 0;

// Value between 0 and 1 controlling fill alpha.
var fill_a = 0;

// Rate of change of fill_h.
var df;

// Tracks whether fill_h should be adding or subtracting df.
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
var energyh;  // high (treble) range energy.
var energy = 0;   // total spectral energy.

// Values containing the frame-to-frame change in energy.
var denergyl;
var denergylm;
var denergym;
var denergyhm;
var denergyh;
var denergy;

// Smoothed changes in energy.
var denergylsmoothed = 0;
var denergylmsmoothed = 0;
var denergymsmoothed = 0;
var denergyhmsmoothed = 0;
var denergyhsmoothed = 0;
var denergysmoothed = 0;

var specdata;

var pixdecay = true;

function setup()
{
  // Create the display canvas.
  createCanvas(512, 512);

  // Make the screen black.
  background(0);

  // Set the color mode.
  colorMode(HSB, 1);
  
  // Initialize audio input.
  oldAudio = new p5.AudioIn();
  console.log('oldAudio', oldAudio)

  audio = audioSource;
  console.log('audio', audio)
  
  // Initialize the FFT object.
  fft = new p5.FFT(0.8);
  fft.setInput(audio);
}

function draw() {
  // Increment time.
  time += 1;

  // Get the volume level of the current sound buffer. Range [0, 1].
  //vol = audio.getLevel();
  //audio.amp(1);

  // Get the spectrum of the current sound buffer. Range [0, 255].
  spectrum = fft.analyze();

  // Get energy values in the predefined spectral ranges.
  denergyl = energyl;
  energyl = fft.getEnergy("bass");
  denergyl = Math.abs(energyl - denergyl);

  denergylm = energylm;
  energylm = fft.getEnergy("lowMid");
  denergylm = Math.abs(energylm - denergylm);

  denergym = energym;
  energym = fft.getEnergy("mid");
  denergym = Math.abs(energym - denergym);

  denergyhm = energyhm;
  energyhm = fft.getEnergy("highMid");
  denergyhm = Math.abs(energyhm - denergyhm);

  denergyh = energyh;
  energyh = fft.getEnergy("treble");
  denergyh = Math.abs(energyh - denergyh);

  denergy = energy;
  energy = fft.getEnergy(20, 20000);
  denergy = Math.abs(energy - denergy);

  // Ignore energy changes smaller than these thresholds
  var delthresh = 10;
  var delmthresh = 10;
  var demthresh = 10;
  var dehmthresh = 10;
  var dehthresh = 10;
  var dethresh = 8;

  // denergysmoothed decay rate
  var dedecay = 0.9;

  if (denergyl > delthresh) {
    denergylsmoothed += denergyl;
  }
  if (denergylm > delmthresh) {
    denergylmsmoothed += denergylm;
  }
  if (denergym > demthresh) {
    denergymsmoothed += denergym;
  }
  if (denergyhm > dehmthresh) {
    denergyhmsmoothed += denergyhm;
  }
  if (denergyh > dehthresh) {
    denergyhsmoothed += denergyh;
  }
  if (denergy > dethresh) {
    denergysmoothed += denergy;
  }

  denergylsmoothed *= dedecay;
  denergylmsmoothed *= dedecay;
  denergymsmoothed *= dedecay;
  denergyhmsmoothed *= dedecay;
  denergyhsmoothed *= dedecay;
  denergysmoothed *= dedecay;


  //var volscale = 1;//(vol === 0) ? 0 : 0.01/vol;

  // Scale segment x length distribution using bass energy levels.
  var xsmooth = 0.1 ;
  segrangex[0] = xsmooth * segrangex[0] + (1-xsmooth) * (0.5 * (0.5 + energyl / 4 + denergylsmoothed / 1.5 + denergylmsmoothed / 1.5));
  segrangex[1] = 0.7 * (5 + energyl / 0.5);

  // Scale segment y length distribution using mid energy levels and
  // high-mid energy levels.
  var ev = 0.013 * Math.pow(energylm, 1.52)
  segrangey[0] = -ev;
  segrangey[1] = ev;

  // Update fill_h and fill_a. Use info about the maximum band energy
  // amplitude and frequency to set values.
  specdata = arraymax(spectrum);
  //fill_h = specdata[1] / spectrum.length;
  fill_a = 0.06;// * constrain(specdata[0] / 20, 0, 1);
  fill_b = 1;//constrain(3 * energy / 255, 0, 1);


  // Update fill_h, df, and dfsign.
  df = dfsign * 0.0005 * Math.pow(energyh / 90, 2);
  fill_h = constrain(fill_h + df, 0, 1);
  fill_h3 = fill_h + constrain(5 * denergysmoothed / 255, 0, 1);
  if (fill_h === 1 || fill_h === 0) {
    dfsign *= -1;
  }
  // Fill is set within the newline function, so that it can vary
  // within a single "line".
  //fill(fill_h, 1, 1, 0.03);
  //stroke(1-fill_h, 1, 1, 0.06);

  // Stroke weight ranges from 0.05 to 1.05, changes over time.
  var strokeweight = 0.08;//constrain(0.01 + energylm / 20., 0, 0.3);
  strokeWeight(strokeweight);

  // Create a "line" emanating from the center of the window at a
  // range of angles in [0, 2*PI].
  for (var t = 0; t < T; t++) {
    // Rotation angle for the next "line".
    var angle = t * dt;

    push();
    translate(width / 2, height / 2);
    rotate(angle);

    // Draw the "line".
    newline();

    pop();
  }

  // If pixdecay is true, make the pixels fade to black
  if(pixdecay)
  {
    loadPixels();
    for (var i = 0; i < 4 * width * height; i++) {
      pixels[i] *= 0.94;
    }
    updatePixels();
  }
}

// Draw a new "line".
function newline()
{
  // Additional fill variable, to allow the color to change throughout
  // the "line".
  var fill_h2 = 0;

  // Rate of change of fill_h2.
  var df2 = 0;//.00005 * (energyh + energyhm);

  // Draw the "line".
  beginShape();
  //vertex(0, 0);
  for(var i = 0; i < numsegs; i++)
  {
    // Increment fill_h2.
    fill_h2 += df2;

    // Create the final fill hue.
    var fhue = (fill_h3 + fill_h2 + fill_b) % 1;
    fill(fhue, 1, fill_b, fill_a);

    var stroke_a = 20 * fill_a * constrain(segrangey[1] / 50, 0, 1)
    stroke(0, 0, fill_b, stroke_a);

    // [x,y] coordinates of the next vertex.
    var x = i * segrangex[0];//segrangex[0] + random(segrangex[1]-segrangex[0]);
    var y = segrangey[0] + random(segrangey[1]-segrangey[0]);
    vertex(x,y);
    
    // Recenter coordinate system on the current vertex.
    //translate(x, 0);
  }
  endShape();
}

function arraymax(arr)
{
  // Returns the largest value in array arr, as well as the index
  // of the first occurrence of that value.
  var maxval = 0;
  var maxidx = 0;
  for(var i = 0; i < arr.length; i++)
  {
    if(arr[i] > maxval)
    {
      maxval = arr[i];
      maxidx = i;
    }
  }

  return [maxval, maxidx]
}

function keyTyped()
{
  // Press c to clear the canvas.
  if(key === 'c' || key === 'C')
  {
    background(0);
  }

  // Press c to toggle pixel decay.
  if(key === 'd' || key === 'D')
  {
    pixdecay = !pixdecay;
  }
}