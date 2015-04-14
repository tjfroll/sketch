//http://jsfiddle.net/MarijnS95/qHWM7/6/

addEventListener('load', init);


function init() {
  window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.AudioContext = window.ctx = document.getElementById('c').getContext('2d');
  gradient = ctx.createLinearGradient(0, 0, 0, 200);
  gradient.addColorStop(1, '#ADD8E6');
  gradient.addColorStop(0.65, '#576D74');
  gradient.addColorStop(0.45, '#FFAA00');
  gradient.addColorStop(0, '#FF0000');
  ctx.fillStyle = gradient;
  window.AudioContext = window.webkitAudioContext || window.AudioContext;
  context = new AudioContext();
  analyser = context.createAnalyser();
  analyser.fftsize = 512;
  analyser.smoothingTimeConstant = 0.9;
  navigator.getMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
  navigator.getMedia({
      audio: true,
      video: false
  }, function (localMediaStream) {
      source = context.createMediaStreamSource(localMediaStream);
      console.log(source);
      source.connect(analyser);
      draw();
  }, function (err) {
      console.log(err);
  });
}


function draw() {
  var array = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(array);
  ctx.clearRect(0, 0, 512, 256);
  for (var i = 0; i < array.length; i++) {
      ctx.fillRect(i * 2, 256-array[i], 1, 256);
  }
  requestAnimationFrame(draw);
}