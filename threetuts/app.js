var container, stats
var camera, scene, renderer, particle
var mouseX = 0, mouseY = 0, mouseDown = false
var windowX, windowY
var windowHalfX, windowHalfY

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
  renderer.setClearColor( 0xEFEFEF )
  renderer.setPixelRatio( window.devicePixelRatio )
  renderer.setSize( windowX, windowY )
}

// -- events -- //

function startEvents() {
  window.addEventListener( 'resize', onWindowResize, false )
  document.addEventListener( 'mousedown', startParticles, false)
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
    window.requestAnimationFrame(function(frame) {
      console.log(frame)
      startParticles(e)
    })
  }
}

function startParticles(e) {
  mouseDown = true
  document.addEventListener( 'mouseup', stopParticles, false)
  document.addEventListener( 'mousemove', restartParticles, false)
  addParticles(e)
}

function stopParticles(e) {
  mouseDown = false
  document.removeEventListener( 'mouseup', stopParticles, false )
  document.removeEventListener( 'mousemove', restartParticles, false )
  document.addEventListener( 'mousedown', startParticles, false)
}

// -- particle creation -- //

function addParticles(e) {
  if (mouseDown) {
    mouseX = e.clientX - windowHalfX
    mouseY = -e.clientY + windowHalfY
    addParticle(e)
    window.requestAnimationFrame(function() { addParticles(e) })
  }
}

function addParticle(e) {
  particle = new THREE.Sprite( generateMaterial() )
  initParticle( particle, e )
  scene.add( particle )
}

function generateMaterial() {
  var seed = Math.random()
  return new THREE.SpriteMaterial( {
    map: new THREE.CanvasTexture( generateSprite(seed) ),
    blending: THREE.SubtractiveBlending
  } )
}

function generateSprite(random) {

  var canvas = document.createElement( 'canvas' )
  canvas.width = 64
  canvas.height = 64
  var context = canvas.getContext( '2d' )
  context.fillStyle = generateGradient(canvas, context, random)
  context.fillRect( 0, 0, canvas.width, canvas.height )

  return canvas;
}

function generateGradient(canvas, context, random) {
  if (random == null) {
    random = Math.random()
  }

  var START_COEFF = 0.5
  var END_COEFF = 0.5

  var x0 = canvas.width * START_COEFF
  var y0 = canvas.height * START_COEFF
  var r0 = 1
  var x1 = canvas.width * END_COEFF
  var y1 = canvas.height * END_COEFF
  var r1 = canvas.width * END_COEFF
  var gradient = context.createRadialGradient( x0, y0, r0, x1, y1, r1 )

  var random64 = Math.floor(random * 64)
  var random75 = Math.floor(random * 75)
  var random255 = Math.floor(random * 255)
  var stops = [
    'rgba(' + random255 + ',' + random255 + ', 250,.5)',
    'rgba(250,' + random75 + ',' + random255 + ', 250)',
    'rgba(250,250,' + random64 + ',.7)',
    'rgba(250,250,250,.1)'
  ]
  addStops(gradient, stops)
  return gradient
}

function addStops(gradient, stops) {
  for (var i=1; i <= stops.length; i++) {
    gradient.addColorStop(i / stops.length, stops[i - 1])
  }
}

function initParticle( particle, e ) {
  if (!e)
    return

  var particle = this instanceof THREE.Sprite ? this : particle

  // console.log(particle)

  particle.position.set( mouseX, mouseY, 0 )
  particle.scale.x = particle.scale.y = Math.random() * 64 + 64

  new TWEEN.Tween( particle )
    .to( {}, 10000 )
    .onComplete( initParticle )
    .start()

  var posX = (Math.random() - 0.5) * 5000
  var posY = (Math.random() - 1) * 5000
  var posZ = (Math.random()) * 10000

  new TWEEN.Tween( particle.position )
    .to( { x: posX, y: posY, z: posZ}, 5000 )
    .start()

  new TWEEN.Tween( particle.scale )
    .to( { x: .01, y: 20 }, 2000 )
    .start()

}