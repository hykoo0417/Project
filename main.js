import * as THREE from 'three';
import { GameManager } from './GameManager.js';
import { ResourceManager } from './ResourceManager.js';
import { UIManager } from './UIManager.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 기본 변수
let scene, camera, renderer;
let game, resourceManager, uiManager;
let clock = new THREE.Clock();
let hoveredChicken = null;
let hoveredEgg = null;
let controls;
const PLANE_SIZE = 10;

init();
animate();

function init() {
  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xaee8ff);

  // Camera
  camera = new THREE.PerspectiveCamera(
    60, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    100
  );
  camera.position.set(0, 10, 10);
  camera.lookAt(0, 0, 0);

  // Light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(5, 10, 7);
  scene.add(dirLight);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // 부드러운 움직임을 위해
  controls.dampingFactor = 0.05;
  controls.target.set(0, 0, 0); // 카메라가 바라볼 중심점
  controls.update();

  // 바닥 Plane
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(PLANE_SIZE, PLANE_SIZE),
    new THREE.MeshToonMaterial({ color: 0x88cc88 })
  );
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);

  // Game Manager
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
      ...game.chickens.map(c => c.mesh),
      ...game.eggs.map(e => e.mesh)
    ];

    const intersects = raycaster.intersectObjects(allMeshes);

    hoveredChicken = null;
    hoveredEgg = null;

    if (intersects.length > 0) {
      const hit = intersects[0].object;
      const chicken = game.chickens.find(c => c.mesh === hit);
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

      const reward = hoveredEgg.isGolden? 15 : 5;
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
  requestAnimationFrame(animate);
  const deltaTime = clock.getDelta();

  
  game.update(deltaTime);
  resourceManager.update(deltaTime);
  uiManager.update(resourceManager.getMoney(), resourceManager.getTime());

  updateHoverUI();
  
  if (game.isGameOver()) {
    console.log('💀 Game Over!');
  }

  controls.update(); // OrbitControls 업데이트
  renderer.render(scene, camera);
}

function updateHoverUI() {
    if (hoveredChicken) {
        // 3D position → 2D screen 좌표 변환
        const pos = hoveredChicken.mesh.position.clone();
        const screenPos = pos.project(camera);  // -1 ~ 1

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
