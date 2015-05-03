/*global THREE*/

var camNear = 0.1;
var camFar = 100000;
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

var color1 = '#6F256F';
var color2 = '#983352';
var color3 = '#609732';
var color4 = '#91A437';

var color5 = '#226666';
var color6 = '#2E4172';
var color7 = '#AA8439';
var color8 = '#AA6C39';

var colors = [color1, color2, color3, color4, color5, color6, color7, color8];

var cubes = [];

addCube();

var light = new THREE.HemisphereLight(color1, color5, 2);
scene.add( light );

var light = new THREE.AmbientLight(color3);
scene.add( light );

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
    addCube();
  }
  cubes = cubes.filter(function (cube) {
    return cube.visible;
  });
  cubes.forEach(function (cube) {
    cube.rotate();
    cube.zoom();
    //cube.transform();
    if(cube.position.z < 0 - camFar ) {
      scene.remove(cube);
      cube.visible = false;
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
  var material = new THREE.MeshLambertMaterial({
    color: color
  });

  var cube = new THREE.Mesh( geometry, material );
  var spinX = random(1, true) / 30;
  var spinY = random(1, true) / 30;
  var spinZ = random(1, true) / 10;
  cube.rotate = function() {
    this.rotation.x += spinX;
    this.rotation.y += spinY;
    this.rotation.z += spinZ;
  };

  var zoom = 30 + random(camFar / 120);
  cube.zoom = function() {
    this.position.z -= zoom;
  };

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