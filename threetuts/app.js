var container, stats
var camera, scene, renderer, particle
var mouseX = 0, mouseY = 0, mouseDown = false, prevMouseX = 0, prevMouseY = 0
var windowX, windowY
var windowHalfX, windowHalfY
var canvasColor = '#772828'

init()
animate()


function init() {

  container = document.createElement( 'div' )
  document.body.appendChild( container )

  updateWindowDimensions()
  camera = makeCamera()
  setupCamera()
  scene = makeScene()
  renderer = makeRenderer()
  setupRenderer()
  container.appendChild( renderer.domElement )

  stats = new Stats()
  container.appendChild( stats.dom )
  startEvents()
}

function animate() {
  requestAnimationFrame( animate )

  render()
  stats.update()
}

function render() {
  TWEEN.update()

  // camera.position.x += ( mouseX - camera.position.x ) * 0.05
  // camera.position.y += ( - mouseY - camera.position.y ) * 0.05
  // camera.lookAt( scene.position )

  renderer.render( scene, camera )
}

// -- initialization -- //

function updateWindowDimensions() {
  windowX = window.innerWidth
  windowY = window.innerHeight
  windowHalfX = windowX / 2
  windowHalfY = windowY / 2
}

function makeCamera() {
  var left = -windowHalfX
  var right = windowHalfX
  var top = windowHalfY
  var bot = -windowHalfY
  var near = 1
  var far = 5000
  return new THREE.OrthographicCamera(left, right, top, bot, near, far )
}

function setupCamera() {
  camera.position.z = 2500
}

function makeScene() {
  return new THREE.Scene()
}

function makeRenderer() {
  return new THREE.CanvasRenderer()
}

function setupRenderer() {
  renderer.setClearColor( canvasColor )
  renderer.setPixelRatio( window.devicePixelRatio )
  renderer.setSize( windowX, windowY )
}

// -- events -- //

function startEvents() {
  window.addEventListener( 'resize', onWindowResize, false )
  document.addEventListener( 'mousedown', startParticles, false)
  document.addEventListener( 'touchstart', startParticles, false)
}

function onWindowResize() {
  updateWindowDimensions()

  camera.aspect = windowX / windowY
  camera.updateProjectionMatrix()

  renderer.setSize( windowX, windowY )
}

function restartParticles(e) {
  if (mouseDown) {
    stopParticles()
    startParticles(e)
  }
}

function startParticles(e) {
  mouseDown = true
  document.addEventListener( 'mouseup', stopParticles, false)
  document.addEventListener( 'mousemove', restartParticles, false)
  document.addEventListener( 'touchend', stopParticles, false)
  document.addEventListener( 'touchmove', restartParticles, false)
  addParticles(e)
}

function stopParticles(e) {
  mouseDown = false
  document.removeEventListener( 'mouseup', stopParticles, false )
  document.removeEventListener( 'mousemove', restartParticles, false )
  document.removeEventListener( 'touchend', stopParticles, false)
  document.removeEventListener( 'touchmove', restartParticles, false)
  document.addEventListener( 'mousedown', startParticles, false)
  document.addEventListener( 'touchstart', startParticles, false)
}

// -- particle creation -- //

function addParticles(e, currentX, currentY) {
  if (mouseDown) {
    prevMouseX = mouseX
    prevMouseY = mouseY
    mouseX = e.clientX - windowHalfX
    mouseY = -e.clientY + windowHalfY
    var firstSpawn = currentX == null || currentY == null
    var samePosition = (prevMouseX === currentX && prevMouseY === currentY)
    if ( firstSpawn || samePosition ) {
      addParticle(e, getDist())
      window.requestAnimationFrame(function() {
        addParticles(e, prevMouseX, prevMouseY)
      })
    }
  }
}

function getDist() {
  var xDist = mouseX - prevMouseX
  var yDist = mouseY - prevMouseY
  return Math.floor(Math.sqrt((xDist * xDist) + (yDist * yDist)))
}

function addParticle(e, dist) {
  particle = new THREE.Sprite( generateMaterial(dist) )
  initParticle( particle, e )
  scene.add( particle )
}

// -- creating the sprite -- //

function generateMaterial(dist) {
  return new THREE.SpriteMaterial( {
    map: new THREE.CanvasTexture( generateSprite(dist) ),
    blending: THREE.AdditiveBlending
  } )
}

function generateSprite(dist) {

  var canvas = document.createElement( 'canvas' )
  var context = canvas.getContext( '2d' )
  context.fillStyle = generateGradient(canvas, context, dist)
  context.fillRect( 0, 0, canvas.width, canvas.height )

  return canvas;
}

function generateGradient(canvas, context, dist) {
  if (!dist)
    dist = 1
  if (dist > 255)
    dist = 255
  canvas.width = dist * 4
  canvas.height = dist * 4

  var START_COEFF = 0.5
  var END_COEFF = 0.5

  var x0 = canvas.width * START_COEFF
  var y0 = canvas.height * START_COEFF
  var r0 = 1
  var x1 = canvas.width * END_COEFF
  var y1 = canvas.height * END_COEFF
  var r1 = canvas.width * END_COEFF
  var gradient = context.createRadialGradient( x0, y0, r0, x1, y1, r1 )

  console.log(dist)

  var color1 = getColorNumber(dist, 0.75)
  var color2 = getColorNumber(dist, 1)
  var color3 = getColorNumber(dist, 1.25)
  var color4 = getColorNumber(dist, 1.5)
  var color5 = getColorNumber(dist, 2)
  var stops = [
    getRGBString([color2, color1, 0, 0.8]),
    getRGBString([color3, color1, 0, 0.4]),
    getRGBString([color5, color1, 0, 0.7]),
    getRGBString([color2, color1, 0, 0.1]),
    getRGBString([0, 0, 0, 0])
  ]
  console.log(stops)
  addStops(gradient, stops)
  return gradient
}

function getColorNumber(dist, factor) {
  var num = dist * factor
  if (num > 255)
    return 255
  return Math.floor(num)
}

function getRGBString(colors) {
  return 'rgba(' + colors[0] + ',' + colors[1] + ',' + colors[2] + ',' + colors[3] + ')'
}

function addStops(gradient, stops) {
  for (var i=1; i <= stops.length; i++) {
    gradient.addColorStop(i / stops.length, stops[i - 1])
  }
}

// -- particle animation and positioning -- //

function initParticle( particle, e ) {
  if (!e)
    return

  var particle = this instanceof THREE.Sprite ? this : particle

  particle.position.set( mouseX, mouseY, 0 )
  particle.scale.x = particle.scale.y = Math.random() * 64 + 64

  new TWEEN.Tween( particle )
    .to( {}, 10000 )
    .onComplete( initParticle )
    .start()

  var posX = (Math.random() - 0.5) * 5000
  var posY = (Math.random() - 0.75) * 5000
  var posZ = (Math.random()) * 10000

  new TWEEN.Tween( particle.position )
    .to( { x: posX, y: posY, z: posZ}, 15000 )
    .start()

  new TWEEN.Tween( particle.scale )
    .to( { x: .01, y: 20 }, 5000 )
    .start()

}