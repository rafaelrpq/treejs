// js/main.js
import * as THREE from 'three'; // Necessário se você usar THREE diretamente aqui
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { setupSceneAndCamera, setupRenderer, handleWindowResize } from './sceneSetup.js';
import { createCube } from './createCube.js';
import { addObjectToAnimate, startAnimationLoop, setControlsForUpdate } from './animation.js';

// 1. Configurar Cena, Câmera e Renderer
const { scene, camera } = setupSceneAndCamera();
const renderer = setupRenderer();
handleWindowResize(camera, renderer); // Adiciona listener para redimensionamento

// 2. Criar e Adicionar Objetos
const cube = createCube(0x00ccff, { x: 1.5, y: 1.5, z: 1.5 }); // Cor e tamanho diferentes
scene.add(cube);

// Adicionar uma luz ambiente para materiais que não são MeshBasicMaterial
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);


// 3. Configurar Controles (Opcional, mas comum)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Efeito de "amortecimento" suave
controls.dampingFactor = 0.05;
setControlsForUpdate(controls); // Para que o loop de animação o atualize

// 4. Definir Animações para Objetos
function rotateCube(cubeInstance) {
    cubeInstance.rotation.x += 0.005;
    cubeInstance.rotation.y += 0.007;
}
addObjectToAnimate(cube, rotateCube);

// Adicionar outro objeto para demonstrar
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 16),
    new THREE.MeshStandardMaterial({ color: 0xff00ff, roughness: 0.5, metalness: 0.1 })
);
sphere.position.x = -2.5;
scene.add(sphere);

function bounceSphere(sphereInstance) {
    // Math.sin para um movimento suave de subida e descida
    sphereInstance.position.y = Math.sin(Date.now() * 0.002) * 0.5;
}
addObjectToAnimate(sphere, bounceSphere);


// 5. Iniciar o Loop de Animação
startAnimationLoop(renderer, scene, camera);

console.log("Three.js app inicializada e modularizada!");