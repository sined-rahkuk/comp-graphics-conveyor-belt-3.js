Physijs.scripts.worker = 'js/Physijs/physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';

var scene, renderer, gui;
var camera, cameraControls, light;
var ground, ground_material;
var controls;
var objects = [];
var intervals = {};
var interval;
var rightDirection = true;


var Variables = function () {
    this.speed = 1.0;
};
var variables = new Variables();

gui = new dat.GUI();
gui.add(variables, 'speed', 0, 2);

if (!init()) animate();

function changeDirection() {
    rightDirection = !rightDirection;
}

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

function addCamera() {
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 0, 5);
    scene.add(camera);
}

function addGround() {
    var loader = new THREE.TextureLoader();
    ground_material = Physijs.createMaterial(new THREE.MeshLambertMaterial({
        map: loader.load('texture/floor.jpg'),
        side: THREE.DoubleSide
    }), .8, .3);
    ground_material.map.wrapS = ground_material.map.wrapT = THREE.RepeatWrapping;
    ground_material.map.repeat.set(10, 10);

    ground = new Physijs.BoxMesh(new THREE.BoxGeometry(100, 1, 100), ground_material, 0);
    ground.receiveShados = true;
    ground.position.set(0, -0.5, 0);
    ground.name = "ground";
    scene.add(ground);
}

function addSkybox() {
    var loader = new THREE.TextureLoader();
    var geometrySphere = new THREE.SphereGeometry(100, 100, 100);
    var sphereTexture = loader.load('texture/sky.jpg');
    var materialSphere = new THREE.MeshBasicMaterial({map: sphereTexture, transparent: true, side: THREE.DoubleSide});
    const sphere = new THREE.Mesh(geometrySphere, materialSphere);
    sphere.position.set(0, 0, 0);
    scene.add(sphere);
}

function loadObject() {
    var loader = new THREE.GLTFLoader();
    loader.load(
        'models/conveyor/scene.gltf',
        function (gltf) {
            scene.add(gltf.scene.children[0]);
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) {
            console.log('An error happened');
        }
    );

    loader.load(
        'models/conveyor/scene.gltf',
        function (gltf) {
            gltf.scene.children[0].position.set(0.6, 0, 1.35);
            gltf.scene.children[0].rotation.z = 1.57;
            scene.add(gltf.scene.children[0]);
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) {
            console.log('An error happened');
        }
    );

    loader.load(
        'models/conveyor/scene.gltf',
        function (gltf) {
            gltf.scene.children[0].position.set(1.9, 0, 0.8);
            scene.add(gltf.scene.children[0]);
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) {
            console.log('An error happened');
        }
    );

    loader = new THREE.TextureLoader();
    var texture = loader.load('texture/brick.jpg');
    var box_geometry = new THREE.CubeGeometry(0.8, 0.75, 2);
    var material = new THREE.MeshBasicMaterial({map: texture, transparent: true, side: THREE.DoubleSide});
    material.visible = false;
    var shape = new Physijs.BoxMesh(box_geometry, material, 100000);
    shape.position.set(0, 0.3, 0);
    shape.name = "pas1";

    scene.add(shape);

    shape.addEventListener('collision', function (other_object, relative_velocity, relative_rotation, contact_normal) {
        if (other_object.name === "shape") {
            if (!intervals[other_object.uuid]) {
                interval = setInterval(() => {
                    other_object.__dirtyPosition = true;
                    if (rightDirection)
                        other_object.position.z += variables.speed/500.0;
                    else
                        other_object.position.z -= variables.speed/500.0;
                    if (other_object.position.z >= 1 || other_object.position.z <= -1.05) {
                        clearInterval(intervals[other_object.uuid]);
                        delete intervals[other_object.uuid];
                    }
                }, 10);
                intervals[other_object.uuid] = interval;
            }
        }
    });

    shape = new Physijs.BoxMesh(box_geometry, material, 100000);
    shape.position.set(0.6, 0.3, 1.35);
    shape.rotation.y = 1.57;
    shape.name = "pas2";

    scene.add(shape);

    shape.addEventListener('collision', function (other_object, relative_velocity, relative_rotation, contact_normal) {
        if (other_object.name === "shape") {
            clearInterval(intervals[other_object.uuid]);
            delete intervals[other_object.uuid];
            if (!intervals[other_object.uuid]) {
                interval = setInterval(() => {
                    other_object.__dirtyPosition = true;
                    if (other_object.position.z <= 1.1)
                        other_object.position.z += variables.speed/500.0;
                    else {
                        if (rightDirection)
                            other_object.position.x += variables.speed/500.0;
                        if (!rightDirection)
                            other_object.position.x -= variables.speed/500.0;
                        if (other_object.position.x >= 1.6 || other_object.position.x <= -0.43) {
                            clearInterval(intervals[other_object.uuid]);
                            delete intervals[other_object.uuid];
                        }
                    }
                }, 10);
                intervals[other_object.uuid] = interval;
            }
        }
    });

    shape = new Physijs.BoxMesh(box_geometry, material, 100000);
    shape.position.set(2, 0.3, 0.8);
    shape.name = "pas3";

    scene.add(shape);

    shape.addEventListener('collision', function (other_object, relative_velocity, relative_rotation, contact_normal) {
        if (other_object.name === "shape") {
            clearInterval(intervals[other_object.uuid]);
            delete intervals[other_object.uuid];
            if (!intervals[other_object.uuid]) {
                interval = setInterval(() => {
                    other_object.__dirtyPosition = true;
                    if (other_object.position.x <= 1.7)
                        other_object.position.x += variables.speed/500.0;
                    else {
                        if (rightDirection)
                            other_object.position.z += variables.speed/500.0;
                        if (!rightDirection)
                            other_object.position.z -= variables.speed/500.0;
                        if (other_object.position.z >= 1.8 || other_object.position.z <= -0.25) {
                            clearInterval(intervals[other_object.uuid]);
                            delete intervals[other_object.uuid];
                        }
                    }
                }, 10);
                intervals[other_object.uuid] = interval;
            }
        }
    });

    box_geometry = new THREE.CubeGeometry(0.1, 0.9, 2);
    shape = new Physijs.BoxMesh(box_geometry, material, 100000);
    shape.position.set(0.5, 0.4, 0);
    scene.add(shape);

    box_geometry = new THREE.CubeGeometry(0.1, 0.9, 2);
    shape = new Physijs.BoxMesh(box_geometry, material, 100000);
    shape.position.set(-0.5, 0.4, 0);
    scene.add(shape);

    box_geometry = new THREE.CubeGeometry(0.1, 0.9, 2);
    shape = new Physijs.BoxMesh(box_geometry, material, 100000);
    shape.position.set(0.6, 0.4, 1.85);
    shape.rotation.y = 1.57;
    scene.add(shape);

    box_geometry = new THREE.CubeGeometry(0.1, 0.9, 1);
    shape = new Physijs.BoxMesh(box_geometry, material, 100000);
    shape.position.set(0.95, 0.4, 0.95);
    shape.rotation.y = 1.57;
    scene.add(shape);

    box_geometry = new THREE.CubeGeometry(0.1, 0.9, 1.2);
    shape = new Physijs.BoxMesh(box_geometry, material, 100000);
    shape.position.set(1.5, 0.4, 0.4);
    scene.add(shape);

    box_geometry = new THREE.CubeGeometry(0.1, 0.9, 2);
    shape = new Physijs.BoxMesh(box_geometry, material, 100000);
    shape.position.set(2.45, 0.4, 0.8);
    scene.add(shape);
}

function addDragControls() {
    controls = new THREE.DragControls(objects, camera, renderer.domElement);
    controls.addEventListener('dragstart', function (event) {
        clearInterval(intervals[event.object.uuid]);
        delete intervals[event.object.uuid];
        scene.remove(event.object);
        cameraControls.enabled = false;
    });
    controls.addEventListener('dragend', function (event) {
        scene.add(event.object);
        cameraControls.enabled = true;
    });
}

function addScene() {
    scene = new Physijs.Scene({fixedTimeStep: 1 / 60});
    scene.addEventListener(
        'update',
        function () {
            scene.simulate(undefined, 1);
        }
    );
}

function addRenderer() {
    renderer = new THREE.WebGLRenderer({
        antialias: true,	// to get smoother output
    });

    renderer.setClearColor(0xbbbbbb);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('container').appendChild(renderer.domElement);
}


function createShape() {
    var loader = new THREE.TextureLoader();
    var sphereTexture = loader.load('texture/brick.jpg');
    var box_geometry = new THREE.CubeGeometry(0.125, 0.125, 0.125);
    var material = new THREE.MeshBasicMaterial({map: sphereTexture, transparent: true, side: THREE.DoubleSide});
    var shape = new Physijs.BoxMesh(box_geometry, material, 1);

    shape.material.color.setRGB(Math.random() * 100 / 100, Math.random() * 100 / 100, Math.random() * 100 / 100);
    shape.castShadow = true;
    shape.receiveShadow = true;
    shape.position.set(0, 3, 0);
    shape.name = "shape";
    scene.add(shape);
    objects.push(shape);
}

// init the scene
function init() {
    addRenderer();

    // create a scene
    addScene();

    // put a camera in the scene
    addCamera();

    // lighting
    addLights();

    // create a camera control
    cameraControls = new THREE.OrbitControls(camera, renderer.domElement);

    // Ground
    addGround();

    // Skybox
    addSkybox();

    // Instantiate a loader
    loadObject();

    // setInterval(createShape, 5000);

    addDragControls();
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
