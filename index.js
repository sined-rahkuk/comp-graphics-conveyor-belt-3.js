var stats, scene, renderer, composer;
var camera, cameraControls;
var cubik;

var Variables = function () {
  this.speed = 1.0;
};
var variables = new Variables();

var gui = new dat.GUI();
gui.add(variables, 'speed', 0, 2);


if (!init()) animate();

// init the scene
function init() {

  renderer = new THREE.WebGLRenderer({
    antialias: true,	// to get smoother output
  });

  renderer.setClearColor(0xbbbbbb);

  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('container').appendChild(renderer.domElement);

  // add Stats.js - https://github.com/mrdoob/stats.js
  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.bottom = '0px';
  document.body.appendChild(stats.domElement);

  // create a scene
  scene = new THREE.Scene();

  // put a camera in the scene
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.set(0, 0, 5);
  scene.add(camera);

  // create a camera contol
  cameraControls = new THREE.OrbitControls( camera, renderer.domElement );

  // Objects
  var geometry = new THREE.BoxGeometry(1, 1, 1);
  var material = new THREE.MeshNormalMaterial();
  cubik = new THREE.Mesh(geometry, material);
  cubik.position.set(0, -0.5, 0);
  scene.add(cubik);
}

// animation loop
function animate() {
  requestAnimationFrame(animate);

  // do the render
  render();

  // update stats
  stats.update();
}

// render the scene
function render() {
  // variable which is increase by Math.PI every seconds - usefull for animation
  // var PIseconds = Date.now() * Math.PI;

  // update camera controls
  cameraControls.update();
  cubik.rotation.x += 0.05;
  cubik.rotation.y -= 0.05;
  cubik.rotation.z *= 0.05;

  // // animation of all objects
  // scene.traverse(function (object3d, i) {
  //   if (!object3d instanceof THREE.Mesh) return;
  //   object3d.rotation.y = variables.speed * PIseconds * 0.0003 * (i % 2 ? 1 : -1);
  //   object3d.rotation.x = variables.speed * PIseconds * 0.0002 * (i % 2 ? 1 : -1);
  // });

  // actually render the scene
  renderer.render(scene, camera);
}
