import * as THREE from 'three';
import { GameManager } from './GameManager.js';
import { ResourceManager } from './ResourceManager.js';
import { UIManager } from './UIManager.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { initCamera, initRenderer } from './util/util.js';
import { RoundedBoxGeometry } from './RoundedBoxGeometry.js';

let scene, camera, renderer;
let game, resourceManager, uiManager;
let clock = new THREE.Clock();
let hoveredChicken = null;
let hoveredEgg = null;
let controls;
let gameOver = false;

const PLANE_SIZE = 10;
const TOTAL_TIME = 300;

init();
animate();
updateTimer();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xaee8ff);

  camera = initCamera();

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
  dirLight.position.set(5, 10, 7);
  dirLight.castShadow = true;
  scene.add(dirLight);

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
  hemiLight.position.set(0, 20, 0);
  scene.add(hemiLight);

  renderer = initRenderer();

  // OrbitControls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.rotateSpeed = 0.3;
  controls.target.set(0, 0, 0);
  controls.minDistance = 5;
  controls.maxDistance = 20;
  controls.minPolarAngle = 0.4;
  controls.maxPolarAngle = Math.PI / 3;
  controls.enablePan = false;
  controls.update();

  // Load Textures
  const textureLoader = new THREE.TextureLoader();
  const grassTexture = textureLoader.load('assets/grass.jpg');
  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set(4, 4);

  const dirtTexture = textureLoader.load('assets/dirt_texture.png');
  dirtTexture.wrapS = dirtTexture.wrapT = THREE.RepeatWrapping;
  dirtTexture.repeat.set(2, 2);

  // Create Rounded Ground Cube
  const WIDTH = 10, HEIGHT = 12, DEPTH = 10;

  const dirtMat = new THREE.MeshStandardMaterial({ map: dirtTexture, color: 0x888888 });
  const grassMat = new THREE.MeshStandardMaterial({ map: grassTexture });

  const materials = [
    dirtMat, // +X
    dirtMat, // -X
    grassMat, // +Y
    dirtMat, // -Y
    dirtMat, // +Z
    dirtMat  // -Z
  ];

  const geometry = new RoundedBoxGeometry(WIDTH, HEIGHT, DEPTH, 4, 0.2);
  const ground = new THREE.Mesh(geometry, materials);
  ground.position.y = -HEIGHT / 2 + 0.2;
  ground.receiveShadow = true;
  scene.add(ground);

  game = new GameManager(scene, PLANE_SIZE);
  resourceManager = new ResourceManager();
  uiManager = new UIManager();

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects([
      ...game.chickens.map(c => c.hitbox),
      ...game.eggs.map(e => e.mesh),
    ]);

    hoveredChicken = null;
    hoveredEgg = null;

    if (intersects.length > 0) {
      const hit = intersects[0].object;
      hoveredChicken = game.chickens.find(c => c.hitbox === hit) || null;
      hoveredEgg = game.eggs.find(e => e.mesh === hit) || null;
    }
  });

  window.addEventListener('click', () => {
    if (hoveredEgg && !hoveredEgg.isHarvested) {
      hoveredEgg.isHarvested = true;
      hoveredEgg.dispose();
      const reward = hoveredEgg.isGolden ? 15 : 5;
      resourceManager.money += reward;
      game.eggs = game.eggs.filter(e => e !== hoveredEgg);
    }

    if (hoveredChicken && resourceManager.spend(5)) {
      hoveredChicken.feed();
    }
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

function animate() {
  if (gameOver) return;
  requestAnimationFrame(animate);

  const deltaTime = clock.getDelta();
  resourceManager.update(deltaTime);

  const timeLeft = resourceManager.getTime();
  game.update(deltaTime, timeLeft);
  uiManager.update(resourceManager.getMoney(), timeLeft);

  updateHoverUI();

  if (timeLeft <= 0) {
    handleGameOver();
    gameOver = true;
    return;
  }

  controls.update();
  renderer.render(scene, camera);
}

function updateHoverUI() {
  if (hoveredChicken) {
    const pos = new THREE.Vector3();
    hoveredChicken.hitbox.getWorldPosition(pos);
    const screenPos = pos.project(camera);

    const x = (screenPos.x * 0.5 + 0.5) * window.innerWidth;
    const y = (-screenPos.y * 0.5 + 0.5) * window.innerHeight;

    uiManager.updateHoverHunger3D(hoveredChicken.hunger, x, y);
  } else {
    uiManager.updateHoverHunger3D(null);
  }
}

function handleGameOver() {
  console.log('💀 Game Over!');
  uiManager.showGameOver(game.chickens.length);
}

function updateTimer() {
  const remaining = resourceManager.getTime();
  const ratio = remaining / TOTAL_TIME;
  uiManager.updateTimeBar(ratio);

  if (remaining <= 0) {
    handleGameOver();
    gameOver = true;
  } else {
    requestAnimationFrame(updateTimer);
  }
}
