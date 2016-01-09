/*global THREE*/

var camNear, camFar, winX, winY, aspectRatio, fieldOfView, rangeX, rangeY;
var scene, camera, renderer, colors, cubeHeight, cubeWidth, cubeDepth, frameCount, toggleInterval;
var keyIsDown = false;

// key codes
var U_ARROW = 40;
var D_ARROW = 38;
var L_ARROW = 37;
var R_ARROW = 39;

function getCubeGeometry() {
  var width = cubeWidth + random(camFar / 30);
  var height = cubeHeight + random(camFar / 120);
  var depth = cubeDepth + random(camFar / 90);
  return new THREE.BoxGeometry( width, height, depth);
}

function getCubeColor() {
  return colors[random(8)];
}

// create the cube material
function getCubeMaterial() {
  return new THREE.MeshLambertMaterial({
    color: getCubeColor()
  });
}

// create the cube
function makeCube() {
  return new THREE.Mesh(getCubeGeometry(), getCubeMaterial());
}

// set the rotational speed of the cube
function setCubeRotation(cube) {
  var spinX = random(1, true) / 30;
  var spinY = random(1, true) / 30;
  var spinZ = random(1, true) / 10;
  cube.rotate = function() {
    this.rotation.x += spinX;
    this.rotation.y += spinY;
    this.rotation.z += spinZ;
  };
}

// set the distance of the cube from the camera
function setCubeZoom(cube) {
  var zoom = 30 + random(camFar / 120);
  cube.zoom = function() {
    this.position.z -= zoom;
  };
}

// alter the x/y/z dimensions of each vertex
function setCubeVertices(cube) {
  var size = random(camFar / 25);
  var verts = cube.geometry.vertices;
  cube.transform = function() {
    verts.forEach (function (vert) {
      vert.x += random(size * 5);
      vert.y += random(size * 3);
      vert.z += random(size * 2);
    });
    //this.geometry.verticesNeedUpdate = true;
  };

  cube.transform();
}

function tweakCubeVertices(cube) {
  var verts = cube.geometry.vertices;
  cube.transform = function() {
    verts.forEach (function (vert) {
      vert.x += random(vert.x / 20, true);
      vert.y += random(vert.y / 20, true);
      vert.z += random(vert.z / 20, true);
    });
    this.geometry.verticesNeedUpdate = true;
  };

  cube.transform();
}

// x/y/z coordinates in the scene
function setCubePosition(cube) {
  scene.add( cube );

  var posX = random(rangeX) - (rangeX / 2);
  cube.position.x = posX;

  var posY = random(rangeY) - (rangeY / 2);
  cube.position.y = posY;

  cube.position.z = camFar / 100;
}

// add a cube
function addCube() {

  var cube = makeCube();
  //setCubeRotation(cube);
  setCubeZoom(cube);
  setCubeVertices(cube);
  setCubePosition(cube);

  cubes.push(cube);
  return cube;
}

// generate a random number
function random(factor, allowNegative) {
  var num = Math.random() * factor;
  if(allowNegative) {
    num -= Math.random() * factor;
  }
  num = Math.floor(num);
  return num;
}

// render a frame of the sketch
function render() {
  requestAnimationFrame( render );
  frameCount += 1;
  if(frameCount === 5) {
    frameCount = 0;
  }
  cubes = cubes.filter(function (cube) {
    return cube.visible;
  });
  cubes.forEach(function (cube) {
    //cube.rotate();
    //cube.zoom();
    //tweakCubeVertices(cubes[frameCount])
    //cube.transform();
    if(cube.position.z < 0 - camFar ) {
      scene.remove(cube);
      cube.visible = false;
    }
  });
  renderer.render( scene, camera );
}

function onKeyDown(event) {
  keepToggling = true;
  if (event.which === U_ARROW) {
    cubeWidth += 100;
    cubes.forEach(function (cube) {
      var verts = cube.geometry.vertices;
      verts.forEach (function (vert) {
        vert.x += 100;
      });
      cube.geometry.verticesNeedUpdate = true;
    });
  }
  else if (event.which === D_ARROW) {
    cubeWidth += -100;
    cubes.forEach(function (cube) {
      var verts = cube.geometry.vertices;
      verts.forEach (function (vert) {
        vert.x -= 100;
      });
      cube.geometry.verticesNeedUpdate = true;
    });
  }
  else if (event.which === L_ARROW) {
    cubeHeight += 100;
  }
  else if (event.which === R_ARROW) {
    cubeHeight += -100;
  }
  else {
    keepToggling = false;
  }
  if(keepToggling) {
    renderer.render( scene, camera );
    requestAnimationFrame(onKeyDown)
  }
}

function onKeyUp(event) {
  keepToggling = false
}

function init() {
  camNear = 0.1;
  camFar = 10000;

  winX = window.innerWidth;
  winY = window.innerHeight;

  aspectRatio = winX / winY;
  fieldOfView = 90;

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera( fieldOfView, aspectRatio, camNear, camFar);
  camera.position.z = camFar / 10;
  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    stencil: true
  });


  rangeX = winX;
  rangeY = winY;

  cubeHeight = 1;
  cubeWidth = 1;
  cubeDepth = 1;
  cubes = [];
  frameCount = 0;

  renderer.setSize( winX, winY );
  document.body.appendChild( renderer.domElement );

  color1 = '#6F256F';
  color2 = '#983352';
  color3 = '#609732';
  color4 = '#91A437';
  color5 = '#226666';
  color6 = '#2E4172';
  color7 = '#AA8439';
  color8 = '#AA6C39';
  colors = [color1, color2, color3, color4, color5, color6, color7, color8];

  scene.add( new THREE.HemisphereLight(color1, color5, 2) );
  scene.add( new THREE.AmbientLight(color3) );

  for(var i=0;i< 5;i++){
    addCube();
  }
  console.log(cubes[0]);
  console.log(scene);

  render();

  $('html').on('keydown', onKeyDown);
  $('html').on('keyup', onKeyUp);
}

init();