/*global THREE*/

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, .1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var cubes = [];

addCube();

console.log(cubes[0]);

camera.position.z = 5;

var frameCount = 0;
function render() {
  requestAnimationFrame( render );
  frameCount += 1;
  if(frameCount === 60) {
    frameCount = 0;
    addCube();
  }
  cubes.forEach(function (cube) {
    cube.rotation.x += .01;
    cube.rotation.y += .01;
    cube.position.z -= .25;
  });
  renderer.render( scene, camera );
}

function addCube() {
  var width = random(50);
  var height = random(100);
  var depth = 5 + random(100);
  var color = 'rgb(' + random(250) + ',' + random(250) + ',' + random(250) + ')';
  var geometry = new THREE.BoxGeometry( width, height, depth, width, height, depth);
  var material = new THREE.MeshBasicMaterial( { color: color } );
  var cube = new THREE.Mesh( geometry, material );
  scene.add( cube );
  cubes.push(cube);
  return cube;
}

function random(factor) {
  var num = Math.random() * factor;
  num = Math.floor(num);
  return num;
}


render();