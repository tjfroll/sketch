/*global THREE*/

var camNear = 0.1;
var camFar = 1000;
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

var pulseCount = 0;
var cube = addCube();
var pulseOut = true;
function render() {
  requestAnimationFrame( render );
  if(pulseCount === 60) {
    pulseOut = false;
  } else if (pulseCount === 0) {
    pulseOut = true;
  }
  if (pulseOut) {
    pulseCount += 2;
  } else {
    pulseCount -= 1;
  }
  cube.rotate();
  cube.pulse(pulseOut);
  renderer.render( scene, camera );
}

function addCube() {
  var width = 1 + random(camFar / 5);
  var height = 1 + random(camFar / 10);
  var depth = 1 + random(camFar / 8);
  var geometry = new THREE.BoxGeometry( width, height, depth);

  var color = colors[random(8)];
  var material = new THREE.MeshLambertMaterial({
    color: color
  });

  var cube = new THREE.Mesh( geometry, material );
  var spinX = random(1, true) / 50;
  var spinY = random(1, true) / 50;
  var spinZ = random(1, true) / 50;

  var verts = cube.geometry.vertices;
  var center = cube.geometry.center();

  cube.reset = function() {
    verts.forEach (function (vert) {
      vert.x = 0;
      vert.y = 0;
      vert.z = 0;
    });
    this.geometry.verticesNeedUpdate = true;
  }
  cube.rotate = function() {
    this.rotation.x += spinX;
    this.rotation.y += spinY;
    this.rotation.z += spinZ;
  };


  // LOL GLORIOUS CODE
  leftVerts = [];
  rightVerts = [];
  topVerts = [];
  botVerts = [];
  frontVerts = [];
  backVerts = [];
  verts.forEach (function (vert) {
    if (vert.x < center.x) {
      leftVerts.push(vert);
    } else {
      rightVerts.push(vert);
    }

    if (vert.y < center.y) {
      botVerts.push(vert);
    } else {
      topVerts.push(vert);
    }

    if (vert.z < center.z) {
      backVerts.push(vert);
    } else {
      frontVerts.push(vert);
    }
  });

  updateX = function (dist) {
    dist = random(dist);
    leftVerts.forEach( function (vert) {
      vert.x -= dist;
    });
    dist = random(dist);
    rightVerts.forEach( function (vert) {
      vert.x += dist;
    });
  }

  updateY = function (dist) {
    dist = random(dist);
    botVerts.forEach( function (vert) {
      vert.y -= dist;
    });
    dist = random(dist);
    topVerts.forEach( function (vert) {
      vert.y += dist;
    });
  }

  updateZ = function (dist) {
    dist = random(dist);
    backVerts.forEach( function (vert) {
      vert.z -= dist;
    });
    dist = random(dist);
    frontVerts.forEach( function (vert) {
      vert.z += dist;
    });
  }

  cube.pulse = function (isOutgoing) {
    var outSpeed = 4;
    var inSpeed = -2;
    if(isOutgoing) {
      //x
      updateX(outSpeed);

      updateY(outSpeed);

      updateZ(outSpeed);
    } else {
      updateX(inSpeed);

      updateY(inSpeed);

      updateZ(inSpeed);
    }
    this.geometry.verticesNeedUpdate = true;
  };

  scene.add( cube );

  var posX = 0;
  cube.position.x = posX;

  var posY = 0;
  cube.position.y = posY;

  var posZ = 0;
  cube.position.z = posZ;

  return cube;
}

function random(factor, allowNegative) {
  var num = Math.random() * factor;
  if(allowNegative) {
    negative = Math.random() < 0.5;
    if(negative) {
      num = 0 - num;
    }
  }
  num = Math.floor(num);
  return num;
}


var light = new THREE.HemisphereLight(color1, color5, 2);
scene.add( light );

var light = new THREE.AmbientLight(color3);
scene.add( light );

camera.position.z = camFar / 10;

console.log(cube);
console.log(scene);

render();