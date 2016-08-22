var stats
var windowX, windowY

var context, canvas
var imageObj, src = 'http://i.imgur.com/PBQmwsx.jpg'
var width, height

var loopId = 0, loopIndex = 0, isRendering = false
var runBtn, stopBtn

init()

function init() {
  updateWindowDimensions()
  setupImage()
  makeStats()

  container = document.createElement( 'div' )
  canvas = document.createElement( 'canvas' )
  context = canvas.getContext('2d')

  imageObj.onload = function (e) {
    width = e.currentTarget.width > windowX ? windowX : e.currentTarget.width
    height = e.currentTarget.height > windowY ? windowY : e.currentTarget.height
    context.canvas.width = width 
    context.canvas.height = height
    context.drawImage(this, 0, 0, width, height)
  }

  container.appendChild( canvas )
  var buttons = makeButtons()
  container.appendChild(buttons)
  document.body.appendChild( container )
}

function setupImage() {
  imageObj = new Image()
  imageObj.crossOrigin = 'Anonymous'
  imageObj.src = src
}

function makeButtons() {
  var buttons = document.createElement( 'div' )
  buttons.classNames = 'button-row'
  runBtn = document.createElement( 'button' )
  runBtn.onclick = startRender
  runBtn.textContent = 'run'
  runBtn.id = 'run-btn'
  stopBtn = document.createElement( 'button' )
  stopBtn.onclick = stopRender
  stopBtn.textContent = 'stop'
  stopBtn.id = 'stop-btn'
  buttons.appendChild( runBtn )
  buttons.appendChild( stopBtn )
  return buttons
}

function startRender() {
  if (!isRendering) {
    runBtn.classNames += ' active'
    isRendering = true
    window.requestAnimationFrame(render)
  }
}

function stopRender() {
  isRendering = false
  window.cancelAnimationFrame(loopId)
  context.drawImage(imageObj, 0, 0, width, height)
}

function render() {
  var imgData = context.getImageData(0, 0, canvas.width, canvas.height)
  var data = imgData.data

  for (var i = 4; i < data.length; i += 4) {
    var rnd = Math.random()
    if (rnd < 0.25) {
      //right
      data[i] = data[i - 4]
      data[i + 1] = data[i + 1 - 4]
      data[i + 2] = data[i + 2 - 4]
    } else if (rnd < 0.5) {
      //left
      if (i + 4 < data.length) {
        data[i] = data[i + 4]
        data[i + 1] = data[i + 1 + 4]
        data[i + 2] = data[i + 2 + 4]
      }
    } else if (rnd < 0.75) {
      //top
      if (i + width * 4 < data.length) {
        data[i] = data[i + width * 4]
        data[i + 1] = data[i + 1 + width * 4]
        data[i + 2] = data[i + 2 + width * 4]
      }
    } else {
      //bot
      if (i - width * 4 > 0) {
        data[i] = data[i - width * 4]
        data[i + 1] = data[i + 1 - width * 4]
        data[i + 2] = data[i + 2 - width * 4]
      }
    }
  }

  context.putImageData(imgData, 0, 0)
  loopId = window.requestAnimationFrame(render)
  stats.update()
}

function updateWindowDimensions() {
  windowX = window.innerWidth
  windowY = window.innerHeight
  windowHalfX = windowX / 2
  windowHalfY = windowY / 2
}

function makeStats() {
  stats = new Stats()
  document.body.appendChild( stats.dom )  
}