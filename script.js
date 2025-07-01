let scene, camera, renderer, car;
let move = { up: false, down: false, left: false, right: false };

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xa0a0a0);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 5, -10);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(0, 20, 10);
  scene.add(light);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(500, 500),
    new THREE.MeshStandardMaterial({ color: 0x008800 })
  );
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  const loader = new THREE.GLTFLoader();
  loader.load('models/car.glb', gltf => {
    car = gltf.scene;
    car.scale.set(1, 1, 1);
    car.position.set(0, 0.5, 0);
    scene.add(car);
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Keyboard controls
  window.addEventListener('keydown', e => handleInput(e.key, true));
  window.addEventListener('keyup', e => handleInput(e.key, false));

  // Mobile buttons
  document.getElementById('up').ontouchstart = () => (move.up = true);
  document.getElementById('down').ontouchstart = () => (move.down = true);
  document.getElementById('left').ontouchstart = () => (move.left = true);
  document.getElementById('right').ontouchstart = () => (move.right = true);

  document.getElementById('up').ontouchend = () => (move.up = false);
  document.getElementById('down').ontouchend = () => (move.down = false);
  document.getElementById('left').ontouchend = () => (move.left = false);
  document.getElementById('right').ontouchend = () => (move.right = false);
}

function handleInput(key, isDown) {
  if (key === 'ArrowUp') move.up = isDown;
  if (key === 'ArrowDown') move.down = isDown;
  if (key === 'ArrowLeft') move.left = isDown;
  if (key === 'ArrowRight') move.right = isDown;
}

function animate() {
  requestAnimationFrame(animate);

  if (car) {
    if (move.up) car.position.z -= 0.2;
    if (move.down) car.position.z += 0.2;
    if (move.left) car.rotation.y += 0.05;
    if (move.right) car.rotation.y -= 0.05;

    camera.position.lerp(
      new THREE.Vector3(car.position.x, car.position.y + 5, car.position.z - 10),
      0.1
    );
    camera.lookAt(car.position);
  }

  renderer.render(scene, camera);
}
