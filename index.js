var scene, renderer;
var camera, cameraControls;

var pas;

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

  // create a scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0, 0, 0);

  // put a camera in the scene
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.set(0, 0, 5);
  scene.add(camera);

  var light = new THREE.AmbientLight(0x404040, 15); // soft white light
  scene.add(light);

  var geometryPlane = new THREE.PlaneGeometry(10, 10, 4, 4);
  var materialPlane = new THREE.MeshBasicMaterial({
    color: 0x747F70,
    side: THREE.DoubleSide
  });
  let plane = new THREE.Mesh(geometryPlane, materialPlane);
  plane.position.set(0, 0, 0);
  plane.rotation.x = Math.PI / 2;
  scene.add(plane);


  // create a camera contol
  cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
  // Instantiate a loader
  var loader = new THREE.GLTFLoader();
  // Load a glTF resource
  loader.load(
      // resource URL
      'js/assets/conveyor/scene.gltf',
      // called when the resource is loaded
      function (gltf) {
        // console.log(gltf)
        scene.add(gltf.scene.children[0]);
        findAll();
      },
      // called while loading is progressing
      function (xhr) {

        console.log((xhr.loaded / xhr.total * 100) + '% loaded');

      },
      // called when loading has errors
      function (error) {
        console.log(error);
        console.log('An error happened');

      }
  );

}

// animation loop
function animate() {
  requestAnimationFrame(animate);

  if (!! pas) {
    // pas.rotation.x += 0.05;
    // pas.rotation.y += 0.05;
    // pas.rotation.z += 0.15;
  }
  // do the render
  render();

}

// render the scene
function render() {

  // update camera controls
  cameraControls.update();

  // actually render the scene
  renderer.render(scene, camera);
}


const findAll = () => {

  let idx = 0;
  scene.traverse((obj) => {

    if (obj.name === 'Conveyor01Belt_Belt_0') {
      pas = obj;
      console.log(pas);
    }
  })
}
