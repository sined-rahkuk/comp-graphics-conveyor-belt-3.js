var stats, scene, renderer, composer;
var camera, cameraControls;

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
  cameraControls = new THREE.OrbitControls(camera, renderer.domElement);

  // Instantiate a loader
  var loader = new THREE.GLTFLoader();
// Load a glTF resource
  loader.load(
      'js/assets/conveyor/scene.gltf',
      // called when the resource is loaded
      function (gltf) {
        var mesh = gltf.scene.children[0];
        mesh.traverse()
        scene.add(mesh);
        // gltf.animations; // Array<THREE.AnimationClip>
        // gltf.scene; // THREE.Scene
        // gltf.scenes; // Array<THREE.Scene>
        // gltf.cameras; // Array<THREE.Camera>
        // gltf.asset; // Object

      },
      // called while loading is progressing
      function (xhr) {

        console.log((xhr.loaded / xhr.total * 100) + '% loaded');

      },
      // called when loading has errors
      function (error) {

        console.log('An error happened');

      }
  );
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

  // // animation of all objects
  // scene.traverse(function (object3d, i) {
  //   if (!object3d instanceof THREE.Mesh) return;
  //   object3d.rotation.y = variables.speed * PIseconds * 0.0003 * (i % 2 ? 1 : -1);
  //   object3d.rotation.x = variables.speed * PIseconds * 0.0002 * (i % 2 ? 1 : -1);
  // });

  // actually render the scene
  renderer.render(scene, camera);
}
