/*global THREE*/

var camNear = .1;
var camFar = 10000000;
var winX = window.innerWidth;
var winY = window.innerHeight;
var aspectRatio = winX / winY;
var fieldOfView = 90;

var rangeX = winX + (camFar * 2);
var rangeY = winY + camFar;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( fieldOfView, aspectRatio, camNear, camFar);

var renderer = new THREE.WebGLRenderer();
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

var cubes = [];

addCube();

console.log(cubes[0]);
console.log(scene);

camera.position.z = camFar / 10;

var frameCount = 0;
function render() {
  requestAnimationFrame( render );
  frameCount += 1;
  if(frameCount === 1) {
    frameCount = 0;
    addCube();
  }
  cubes.forEach(function (cube) {
    cube.rotate();
    cube.zoom();
    if(cube.position.z < 0 - camFar ) {
      scene.remove(cube);
    }
  });
  renderer.render( scene, camera );
}

function addCube() {
  var width = 1 + random(camFar / 30);
  var height = 1 + random(camFar / 120);
  var depth = 1 + random(camFar / 90);
  var geometry = new THREE.BoxGeometry( width, height, depth);

  var color = colors[random(8)];
  var material = new THREE.MeshBasicMaterial( { color: color } );

  var cube = new THREE.Mesh( geometry, material );
  var spinX = random(1, true) / 20;
  var spinY = random(1, true) / 20;
  var spinZ = random(1, true) / 20;
  cube.rotate = function() {
    this.rotation.x += spinX;
    this.rotation.y += spinY;
    this.rotation.z += spinZ;
  }

  var zoom = 10 + random(camFar / 120);
  cube.zoom = function() {
    this.position.z -= zoom;
  }

  var size = random(camFar / 300)
  verts = cube.geometry.vertices
  verts.forEach (function (vert) {
    vert.x += random(size * 50);
    vert.y += random(size * 30);
    vert.z += random(size * 20);
  });

  scene.add( cube );

  winX = window.innerWidth + 200000;
  var posX = random(rangeX) - (rangeX / 2);
  cube.position.x = posX;

  var posY = random(rangeY) - (rangeY / 2);
  cube.position.y = posY;

  cube.position.z = camFar / 10;

  cubes.push(cube);
  return cube;
}

function random(factor, allowNegative) {
  var num = Math.random() * factor;
  if(allowNegative) {
    num -= Math.random() * factor;
  }
  num = Math.floor(num);
  return num;
}


render();