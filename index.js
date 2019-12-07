'use strict';

Physijs.scripts.worker = 'Physijs/physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';

var scene, renderer, gui;
var camera, cameraControls, light;
var ground, ground_material;
var pas;

var Variables = function () {
  this.speed = 1.0;
};
var variables = new Variables();

gui = new dat.GUI();
gui.add(variables, 'speed', 0, 2);

if (!init()) animate();

function addLights() {

  var ambientLight = new THREE.AmbientLight(0xFFFFFF);
  scene.add(ambientLight);

  var spotlight = new THREE.SpotLight('rgb(255,255,255)');
  spotlight.angle = Math.PI;
  spotlight.position.set(0, 4, 2);
  spotlight.intensity = 2;
  spotlight.castShadow = true;
  scene.add(spotlight);
  spotlight.penumbra = 1;
  var spotLightHelper = new THREE.SpotLightHelper(spotlight);
  scene.add(spotLightHelper);


}

// init the scene
function init() {
  renderer = new THREE.WebGLRenderer({
    antialias: true,	// to get smoother output
  });

  renderer.setClearColor(0xbbbbbb);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('container').appendChild(renderer.domElement);

  // create a scene
  scene = new Physijs.Scene;
  scene.setGravity(new THREE.Vector3(0, -30, 0));
  scene.addEventListener(
      'update',
      function () {
        scene.simulate(undefined, 1);
      }
  );

  // put a camera in the scene
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.set(0, 0, 5);
  scene.add(camera);

  // lighting
  // light = new THREE.AmbientLight(0x404040, 15); // soft white light
  // scene.add(light);
  addLights();
  // create a camera control
  cameraControls = new THREE.OrbitControls(camera, renderer.domElement);

  // Materials
  // ground_material = Physijs.createMaterial(
  //     new THREE.MeshStandardMaterial({color: 0x747F70, side: THREE.DoubleSide}), 1, .9 // low restitution
  // );
  //
  // // Ground
  // ground = new Physijs.PlaneMesh(new THREE.BoxGeometry(10, 0.5, 10), ground_material, 0 // mass
  // );
  // ground.receiveShadow = true;
  // ground.position.set(0, -0.5, 0);
  // scene.add(ground);
  var floorTexture = new THREE.ImageUtils.loadTexture('texture/floor.jpg');
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set(10, 10);
  var geometryPlane = new THREE.PlaneGeometry(20, 20, 4, 4);
  var materialPlane = new THREE.MeshStandardMaterial({
    map: floorTexture,
    side: THREE.DoubleSide,
    roughness: 0.12,
    metalness: 0.65
  });
  const plane = new THREE.Mesh(geometryPlane, materialPlane);
  plane.position.set(0, -0.5, 0);
  plane.rotation.x = Math.PI / 2;
  scene.add(plane);

  // Skybox
  var geometrySphere = new THREE.SphereGeometry(100, 100, 100);
  var sphereTexture = new THREE.ImageUtils.loadTexture('texture/michalov.png');
  var materialSphere = new THREE.MeshBasicMaterial({map: sphereTexture, transparent: true, side: THREE.DoubleSide});
  const sphere = new THREE.Mesh(geometrySphere, materialSphere);
  sphere.position.set(0, 0, 0);
  scene.add(sphere);

  // Instantiate a loader
  var loader = new THREE.GLTFLoader();
  loader.load(
      'js/assets/conveyor/scene.gltf',
      // called when the resource is loaded
      function (gltf) {
        scene.add(gltf.scene.children[0]);
        findAll();
        // pas.position.z += 1;
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
  setInterval(createShape, 1000);
}

function createShape() {
  var box_geometry = new THREE.CubeGeometry(1, 1, 1),
      sphere_geometry = new THREE.SphereGeometry(1, 5, 5),
      cylinder_geometry = new THREE.CylinderGeometry(2, 2, 1, 32),
      cone_geometry = new THREE.CylinderGeometry(0, 2, 4, 32),
      octahedron_geometry = new THREE.OctahedronGeometry(1.7, 1),
      torus_geometry = new THREE.TorusKnotGeometry(1.7, .2, 32, 4);

  var shape, material = new THREE.MeshLambertMaterial({opacity: 0, transparent: true});

  switch (Math.floor(Math.random() * 2)) {
    case 0:
      shape = new Physijs.BoxMesh(
          box_geometry,
          material
      );
      break;

    case 1:
      shape = new Physijs.SphereMesh(
          sphere_geometry,
          material,
          undefined,
          {restitution: Math.random() * 1.5}
      );
      break;
  }

  shape.material.color.setRGB(Math.random() * 100 / 100, Math.random() * 100 / 100, Math.random() * 100 / 100);
  shape.castShadow = true;
  shape.receiveShadow = true;

  shape.position.set(0, 0.5, 0);

  shape.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
  );
  scene.add(shape);
  console.log(scene);
}

// render the scene
function render() {
  cameraControls.update();
  scene.simulate();
  renderer.render(scene, camera);
}

// animation loop
function animate() {
  requestAnimationFrame(animate);
  render();
}

const findAll = () => {
    scene.traverse((obj) => {
        if (obj.name === 'Conveyor01Belt_Belt_0') {
            pas = obj;
            console.log(pas);
        }
    })
};
