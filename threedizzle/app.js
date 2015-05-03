/*global THREE*/

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, .1, 50000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
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

camera.position.z = 5;

var frameCount = 0;
function render() {
  requestAnimationFrame( render );
  frameCount += 1;
  if(frameCount === 1) {
    frameCount = 0;
    addCube();
  }
  cubes.forEach(function (cube) {
    cube.rotation.x += .1;
    cube.rotation.y += .1;
    cube.position.z += 100;
    if(cube.position.z > -10) {
      scene.remove(cube);
    }
  });
  renderer.render( scene, camera );
}

function addCube() {
  var width = 1 + random(150);
  var height = 1 + random(300);
  var depth = 1 + random(500);
  var color = colors[random(8)];
  var geometry = new THREE.BoxGeometry( width, height, depth);
  var material = new THREE.MeshBasicMaterial( { color: color } );
  var cube = new THREE.Mesh( geometry, material );

  scene.add( cube );

  winX = window.innerWidth;
  var posX = random(winX) - (winX / 2);
  cube.position.x = posX;

  winY = window.innerHeight;
  var posY = random(winY) - (winY / 2);
  cube.position.y = posY;

  cube.position.z = -20000

  cubes.push(cube);
  return cube;
}

function random(factor) {
  var num = Math.random() * factor;
  num = Math.floor(num);
  return num;
}


render();