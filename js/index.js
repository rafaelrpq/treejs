import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.set(0, 16, 16)

const renderer = new THREE.WebGLRenderer({
    alpha: false,
    antialias: true,
    powerPreference: 'high-performance',
    logarithmicDepthBuffer: true,
})

// const light = new THREE.PointLight(0xffffff, 1)
const light = new THREE.DirectionalLight(0xffffff, .3)
light.position.set(0, 10, 0)
light.target.position.set(0, 0, 0)
light.castShadow = true
light.shadow.mapSize.width = 2048*4 // Aumentado para maior definição
light.shadow.mapSize.height = 2048*4 // Aumentado para maior definição
light.shadow.camera.near = 1
light.shadow.camera.far = 50
// Frustum da câmera de sombra ajustado para focar melhor no objeto
light.shadow.camera.left = -80
light.shadow.camera.right = 80
light.shadow.camera.top = 80
light.shadow.camera.bottom = -80
light.shadow.bias = -0.001  


const ambient = new THREE.AmbientLight(0xffffff, 0.75)
scene.add(ambient)
scene.add(light)

renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
// renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setClearColor(0x666666, 1)

document.body.appendChild(renderer.domElement)



const controls = new OrbitControls(camera, renderer.domElement);
// const loader = new GLTFLoader();

const planeGeometry = new THREE.PlaneGeometry(144, 100, 1, 1)
const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0x66aa66,
    side: THREE.DoubleSide,
    roughness: 1,
    transparent: false,
    metalness: 0,
    transparent: false,
    // opacity: 0.5, // Ajuste a opacidade conforme necessário
    depthWrite: false // Desativa a escrita de profundidade para evitar problemas de sombra
})
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.rotation.x = -Math.PI / 2
plane.receiveShadow = true
scene.add(plane)


// 1. Carregador de Textura
const textureLoader = new THREE.TextureLoader();

// 2. Carregar a imagem PNG
const imageTexture = textureLoader.load('res/macwriter.png');

// 3. Criar a geometria para a imagem (ajuste o tamanho conforme a proporção)
const imageGeometry = new THREE.PlaneGeometry(144, 100); // Aumentado para ser mais visível

// 4. Criar o material com a textura
const imageMaterial = new THREE.MeshStandardMaterial({
    map: imageTexture,
    color: 0x333333, // Adicione esta linha para tingir a imagem de verde.
    transparent: true, // Essencial para a transparência do PNG
    side: THREE.DoubleSide, // Para a imagem ser visível de ambos os lados
    alphaTest: 0.5 // Evita que partes totalmente transparentes projetem sombra
});

// 5. Criar o Mesh (o objeto 3D)
const imagePlane = new THREE.Mesh(imageGeometry, imageMaterial);

// 6. Habilitar a projeção de sombra
imagePlane.castShadow = true;

// 7. Posicionar o objeto na cena (acima do plano para a sombra ser visível)
imagePlane.position.set(0, 0.25, 0); // Posicionado em pé, com a base no chão (y = altura/2)
imagePlane.rotation.x = -Math.PI / 2; 

// 8. Adicionar o objeto à cena
scene.add(imagePlane);


function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)    
}

animate()
