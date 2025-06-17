// js/sceneSetup.js
import * as THREE from 'three';

export function setupSceneAndCamera() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xbfd1e5); // Cor de fundo opcional

    const camera = new THREE.PerspectiveCamera(
        75, // fov
        window.innerWidth / window.innerHeight, // aspect
        0.1, // near
        1000 // far
    );
    camera.position.z = 5; // Posição inicial da câmera

    return { scene, camera };
}

export function setupRenderer() {
    const renderer = new THREE.WebGLRenderer({ antialias: true }); // antialias para bordas mais suaves
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio); // Melhor qualidade em telas de alta densidade
    document.body.appendChild(renderer.domElement);
    return renderer;
}

export function handleWindowResize(camera, renderer) {
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
    });
}