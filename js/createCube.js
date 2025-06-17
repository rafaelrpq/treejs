// js/createCube.js
import * as THREE from 'three';

export function createCube(color = 0x00ff00, size = { x: 1, y: 1, z: 1 }) {
    const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
    const material = new THREE.MeshBasicMaterial({ color: color });
    const cube = new THREE.Mesh(geometry, material);
    return cube;
}