import * as THREE from 'three';
import { GameManager } from './GameManager.js';
import { ResourceManager } from './ResourceManager.js';
import { UIManager } from './UIManager.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { initCamera, initRenderer } from './util/util.js';

let scene, camera, renderer;
let game, resourceManager, uiManager;
let clock = new THREE.Clock();
let hoveredChicken = null;
let hoveredEgg = null;
let controls;
let gameOver = false;
const PLANE_SIZE = 10;
const TOTAL_TIME = 300; // 5분

init();
animate();
updateTimer();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xaee8ff);
  camera = initCamera();

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

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.rotateSpeed = 0.3;
  controls.target.set(0, 0, 0);
  controls.update();

  // ✅ 카메라 제한 설정
  controls.minDistance = 5;
  controls.maxDistance = 20;
  controls.minPolarAngle = 0.4;               // 너무 위에서 보는 시점 방지 (~23도)
  controls.maxPolarAngle = Math.PI / 2.3;     // 평면과 평행한 시점 방지 (~78도)
  controls.enablePan = false;

  const textureLoader = new THREE.TextureLoader();
  const grassTexture = textureLoader.load('assets/grass.jpg');
  grassTexture.wrapS = THREE.RepeatWrapping;
  grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set(4, 4);

  const planeMaterial = new THREE.MeshStandardMaterial({
    map: grassTexture,
    color: 0xcccccc
  });
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(PLANE_SIZE, PLANE_SIZE),
    planeMaterial
  );
  plane.rotation.x = -Math.PI / 2;
  plane.position.y += 0.15;
  plane.receiveShadow = true;
  scene.add(plane);

  game = new GameManager(scene, PLANE_SIZE);
  resourceManager = new ResourceManager();
  uiManager = new UIManager();

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  window.addEventListener('mousemove', (event) => {
    const { innerWidth, innerHeight } = window;
    mouse.x = (event.clientX / innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const allMeshes = [
      ...game.chickens.map(c => c.hitbox),
      ...game.eggs.map(e => e.mesh)
    ];

    const intersects = raycaster.intersectObjects(allMeshes);

    hoveredChicken = null;
    hoveredEgg = null;

    if (intersects.length > 0) {
      const hit = intersects[0].object;
      const chicken = game.chickens.find(c => c.hitbox === hit);
      if (chicken){
        hoveredChicken = chicken;
      }

      const egg = game.eggs.find(e => e.mesh === hit);
      if (egg){
        hoveredEgg = egg;
      }
    }
  });

  window.addEventListener('click', () => {
    if (hoveredEgg && !hoveredEgg.isHarvested){
      hoveredEgg.isHarvested = true;
      hoveredEgg.dispose();

      const reward = hoveredEgg.isGolden ? 15 : 5;
      resourceManager.money += reward;

      game.eggs = game.eggs.filter(e => e !== hoveredEgg);
      return;
    }
    if (hoveredChicken && resourceManager.spend(5)) {
      hoveredChicken.feed();
    }
  });

  window.addEventListener('resize', onWindowResize);
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

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
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
