// Egg object

import * as THREE from 'three';

export class Egg {
  constructor(scene, position, isGolden = false) {
    this.scene = scene;
    this.mesh = this._createMesh(isGolden);
    this.mesh.position.copy(position);
    this.scene.add(this.mesh);

    this.hatchTime = Date.now() + this._randomHatchDelay();
    this.hatched = false;
    this.isHarvested = false;
    this.isGolden = isGolden;
  }

  _createMesh(isGolden) {
    const geometry = new THREE.SphereGeometry(0.15, 12, 12);
    const material = new THREE.MeshToonMaterial({ 
      color: isGolden ? 0xffd700 : 0xffffff 
    });
    return new THREE.Mesh(geometry, material);
  }

  // 랜덤하게 부화 시간을 결정
  _randomHatchDelay() {
    return 15000 + Math.random() * 15000; // 15~30초
  }

  update() {
    if (this.hatched) return;

    if (Date.now() >= this.hatchTime) {
      this.hatched = true;
      return 'hatch';
    }
  }

  dispose() {
    this.scene.remove(this.mesh);
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
  }
}