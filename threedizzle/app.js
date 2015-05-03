/*global THREE*/

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, -10, 50 );

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
  if(frameCount === 30) {
    console.log(cubes[0]);
    frameCount = 0;
    addCube();
  }
  cubes.forEach(function (cube) {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    cube.position.z -= 0.25;
  });
  renderer.render( scene, camera );
}

function addCube() {
  var width = 1 + random(150);
  var height = 1 + random(300);
  var depth = 1 + random(500);
  var color = 'rgb(' + random(250) + ',' + random(250) + ',' + random(250) + ')';
  var geometry = new THREE.BoxGeometry( width, height, depth);
  var material = new THREE.MeshBasicMaterial( { color: color } );
  var cube = new THREE.Mesh( geometry, material );

  scene.add( cube );

  var left = random(10) > 5;
  if(left) {
    cube.position.x = 0;
  }
  else{
    cube.position.x = window.innerWidth;
  }
  cubes.push(cube);
  return cube;
}

function random(factor) {
  var num = Math.random() * factor;
  num = Math.floor(num);
  return num;
}


render();