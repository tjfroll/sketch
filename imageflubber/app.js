var stats
var windowX, windowY

var context, canvas
var imageObj
var images = [
  'http://i.imgur.com/CL5PGlc.jpg',
  'http://i.imgur.com/KuhFoP9.jpg',
  'http://i.imgur.com/lsNjQ7u.jpg',
  'http://i.imgur.com/PBQmwsx.jpg',
  'http://i.imgur.com/ng3vJ7L.jpg',
  'http://i.imgur.com/Jg3RjTZ.jpg',
  'http://i.imgur.com/lyC25bG.jpg',
  'http://i.imgur.com/N6sGhwS.jpg',
  'http://i.imgur.com/mzsdPRB.jpg'
]
var width, height

var loopId = 0, loopIndex = 0, isRendering = false
var toolbar, runBtn, randColorBtn, randDirBtn
var imgData, data
var randoms = []
var size = 0

var randColor = false, randDir = false
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

  toolbar = document.createElement( 'div' )
  toolbar.className = 'toolbar'
  makeToolbar()
  var presets = makePresets()
  container.appendChild(toolbar)
  container.appendChild(presets)
  setupImage()
  document.body.appendChild( container )
}

function render() {
  var variance = Math.floor(Math.random() * 16) - 1
  var quadWidth = width * 4

  if (randDir) {
    var rD = Math.random()
    if (rD <= 0.25) {
      if (isUp) setDir('left')
    } else if (rD <= 0.5) {
      if (isLeft || isUp) setDir('right')
    } else if (rD <= 0.75) {
      if (isLeft) setDir('up')
    } else {
      setDir('down')
    }
  }
  if (randColor) {
    var rC = Math.random()
    if (rC <= 0.33) {
      if (isGreen || isBlue) setColor('red')
    } else if (rC <= 0.66) {
      if (isRed || isBlue) setColor('green')
    } else {
      if (isGreen || isRed) setColor('blue')
    }
  }

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
      if (i + quadWidth < size) {
        if (isRed) data[i] = data[i + quadWidth]
        if (isGreen) data[i + 1] = data[i + 1 + quadWidth]
        if (isBlue) data[i + 2] = data[i + 2 + quadWidth]
      }
    } else if (isDown) { //bot
      if (i - quadWidth > 0) {
        if (isRed) data[i] = data[i - quadWidth]
        if (isGreen) data[i + 1] = data[i + 1 - quadWidth]
        if (isBlue) data[i + 2] = data[i + 2 - quadWidth]
      }
    }
  }

  context.putImageData(imgData, 0, 0)
  stats.update()
  loopId = window.requestAnimationFrame(render)
}

// -- events -- //

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
  imgData = context.getImageData(0, 0, canvas.width, canvas.height)
  data = imgData.data
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

function randomizeColor() {
  randColor = !randColor
  $(randColorBtn).toggleClass('active')
}

function randomizeDir() {
  randDir = !randDir
  $(randDirBtn).toggleClass('active')
}

// -- setting up the image -- //

function makeImage() {
  imageObj = document.createElement( 'img' )
  imageObj.crossOrigin = 'Anonymous'
  imageObj.onload = function (e) {
    var factorX, factorY
    width = e.currentTarget.width
    height = e.currentTarget.height
    if (width > windowX) {
      factorX = windowX / width
      width = windowX
      height = Math.floor(height * factorX)
    }
    if (height > windowY) {
      factorY = windowY / height
      height = windowY
      width = Math.floor(width * factorY)
    }
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

// -- interface -- //

function makeToolbar() {
  runBtn = makeButton(toolbar, {
    onclick: toggleRender,
    textContent: 'run'
  })

  makeButton(toolbar, {
    onclick: reset,
    textContent: 'reset'
  })

  randColorBtn = makeButton(toolbar, {
    onclick: randomizeColor,
    textContent: '? color ?',
    title: 'Randomize the color channels.'
  })
  makeColorButtons()

  randDirBtn = makeButton(toolbar, {
    onclick: randomizeDir,
    textContent: '? dir ?',
    title: 'Randomize the directions.'
  })
  makeDirButtons()

  urlInput = document.createElement( 'input' )
  urlInput.placeholder = 'Image url to warp'
  urlInput.value = images[0]
  urlInput.oninput = attemptImageSetup
  urlInput.title = 'Provide an image url!'
  toolbar.appendChild(urlInput)

  return toolbar
}

function makeColorButtons() {
  ['red', 'green', 'blue'].forEach( function(color) {
    makeButton(toolbar, {
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
    makeButton(toolbar, {
      textContent: getDirText(dir),
      className: 'active dir-btn',
      id: dir + '-btn',
      title: 'Shift ' + dir,
      onclick: function() { setDirection(dir) }
    })
  })
}

function getDirText(dir) {
  switch (dir) {
    case 'up':
      return '^^^'
    case 'down':
      return 'vvv'
    case 'left':
      return '<<<'
    case 'right':
      return '>>>'
  }
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

// -- util -- //

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