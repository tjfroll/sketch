var stats
var windowX, windowY

var context, canvas
var imageObj
var images = [
  'http://i.imgur.com/lsNjQ7u.jpg',
  'http://i.imgur.com/PBQmwsx.jpg',
  'http://i.imgur.com/ng3vJ7L.jpg',
  'http://i.imgur.com/7JPRZki.jpg',
  'http://i.imgur.com/Jg3RjTZ.jpg',
  'http://i.imgur.com/DKWHq1W.jpg',
  'http://i.imgur.com/N6sGhwS.jpg'
]
var width, height

var loopId = 0, loopIndex = 0, isRendering = false
var buttons, runBtn
var randoms = []
var size = 0

var isLeft = true, isRight = true, isDown = true, isUp = true
var isRed = true, isGreen = true, isBlue = true

init()

function init() {
  updateWindowDimensions()
  makeStats()

  container = document.createElement( 'div' )
  canvas = document.createElement( 'canvas' )
  context = canvas.getContext('2d')
  makeImage()
  container.appendChild( canvas )

  buttons = document.createElement( 'div' )
  buttons.className = 'toolbar'
  makeButtons()
  var presets = makePresets()
  container.appendChild(buttons)
  container.appendChild(presets)
  setupImage()
  document.body.appendChild( container )
}

function toggleRender() {
  if (!isRendering) {
    startRender()
  } else if (isRendering) {
    stopRender()
  }
}

function startRender() {
  isRendering = true
  runBtn.className += 'active'
  runBtn.textContent = 'stop'
  randoms = []
  setupImage()
  for (var i = 0; i < canvas.width * canvas.height * 4; i++) {
    randoms.push(Math.random())
  }
  size = randoms.length
  window.requestAnimationFrame(render)
}

function stopRender() {
  isRendering = false
  runBtn.className = ''
  runBtn.textContent = 'run'
  window.cancelAnimationFrame(loopId)
}

function reset() {
  context.drawImage(imageObj, 0, 0, width, height)
}

function render() {
  var imgData = context.getImageData(0, 0, canvas.width, canvas.height)
  var data = imgData.data
  var variance = Math.floor(Math.random() * 16) - 1
  for (var i = 4; i < size; i += 4) {
    var pos = (i / 4) + variance
    if (pos >= size) {
      pos = pos - size
    }
    if (isRight && randoms[pos] < 0.25) { //right
      if (isRed) data[i] = data[i - 4]
      if (isGreen) data[i + 1] = data[i + 1 - 4]
      if (isBlue) data[i + 2] = data[i + 2 - 4]
    } 
    else if (isLeft && randoms[pos] < 0.5) { //left
      if (i + 4 < size) {
        if (isRed) data[i] = data[i + 4]
        if (isGreen) data[i + 1] = data[i + 1 + 4]
        if (isBlue) data[i + 2] = data[i + 2 + 4]
      }
    } else if (isUp && randoms[pos] < 0.75) { //top
      if (i + width * 4 < size) {
        if (isRed) data[i] = data[i + width * 4]
        if (isGreen) data[i + 1] = data[i + 1 + width * 4]
        if (isBlue) data[i + 2] = data[i + 2 + width * 4]
      }
    } else if (isDown) { //bot
      if (i - width * 4 > 0) {
        if (isRed) data[i] = data[i - width * 4]
        if (isGreen) data[i + 1] = data[i + 1 - width * 4]
        if (isBlue) data[i + 2] = data[i + 2 - width * 4]
      }
    }
  }

  context.putImageData(imgData, 0, 0)
  stats.update()
  loopId = window.requestAnimationFrame(render)
}

function makeImage() {
  imageObj = document.createElement( 'img' )
  imageObj.crossOrigin = 'Anonymous'
  imageObj.onload = function (e) {
    width = e.currentTarget.width > windowX ? windowX : e.currentTarget.width
    height = e.currentTarget.height > windowY ? windowY : e.currentTarget.height
    width = width > 1920 ? 1920 : width
    height = height > 1920 ? 1080 : height
    context.canvas.width = width 
    context.canvas.height = height
    context.drawImage(this, 0, 0, width, height)
  }
}

function setupImage() {
  if (imageObj.src === urlInput.value)
    return
  imageObj.src = urlInput.value
}

function attemptImageSetup(e) {
  var text = e.target.value || e
  if (text == null || !text || text.length < 10)
    return
  else if (text.endsWith('jpg') || text.endsWith('png'))
    setupImage()
}

function makeButtons() {
  runBtn = makeButton(buttons, {
    onclick: toggleRender,
    textContent: 'run'
  })

  makeButton(buttons, {
    onclick: reset,
    textContent: 'reset'
  })

  makeColorButtons()
  makeDirButtons()

  urlInput = document.createElement( 'input' )
  urlInput.placeholder = 'Image url to warp'
  urlInput.value = images[0]
  urlInput.oninput = attemptImageSetup
  urlInput.title = 'Provide an image url!'
  buttons.appendChild(urlInput)

  return buttons
}

function makeColorButtons() {
  ['red', 'green', 'blue'].forEach( function(color) {
    makeButton(buttons, {
      textContent: color.charAt(0),
      className: 'active color-btn',
      id: color + '-btn',
      title: 'Toggle ' + color,
      onclick: function() { setColor(color) }
    })
  })
}

function makeDirButtons() {
  ['up', 'down', 'left', 'right'].forEach( function(dir) {
    makeButton(buttons, {
      textContent: dir,
      className: 'active dir-btn',
      id: dir + '-btn',
      title: 'Shift ' + dir,
      onclick: function() { setDirection(dir) }
    })
  })
}

function makeButton(parent, opts) {
  btn = document.createElement( 'button' )
  btn.onclick = opts.onclick
  btn.className = opts.className
  btn.textContent = opts.textContent
  btn.id = opts.id
  btn.title = opts.title
  parent.appendChild( btn )
  return btn
}

function makePresets() {
  var btns = document.createElement( 'div' )
  btns.className = 'presets'
  images.forEach( function(url, i) {
    var btn = makeButton(btns, {
      onclick: function() {
        $('.preset-btn').removeClass('active')
        btn.className += ' active'
        urlInput.value = url
        setupImage()
      },
      textContent: '' + (i + 1),
      title: 'Load preset image',
      className: i === 0 ? 'preset-btn active' : 'preset-btn'
    })
  })
  return btns
}

function setColor(color) {
  switch (color) {
    case 'red':
      isRed = !isRed
      break
    case 'green':
      isGreen = !isGreen
      break
    case 'blue':
      isBlue = !isBlue
      break
  }
  $('#' + color + '-btn').toggleClass('active')
}

function setDirection(dir) {
  switch (dir) {
    case 'left':
      isLeft = !isLeft
      break
    case 'right':
      isRight = !isRight
      break
    case 'down':
      isDown = !isDown
      break
    case 'up':
      isUp = !isUp
      break
  }
  $('#' + dir + '-btn').toggleClass('active')
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