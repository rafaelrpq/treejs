import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Box } from './Box.js';
import { Input, spawnEnemy, boxCollision } from './utils.js';

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.set (0,16,16)

const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
    logarithmicDepthBuffer: true,
})

const light = new THREE.PointLight(0xffffff, 1)
light.position.x = 0
light.position.y = 10
light.position.z = 0
light.castShadow = true


const ambient = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambient)
scene.add(light) 

renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
// renderer.shadowMap.type = THREE.PCFSoftShadowMap
// renderer.setPixelRatio(window.devicePixelRatio)


const controls = new OrbitControls( camera, renderer.domElement );
// const loader = new GLTFLoader();

document.body.appendChild(renderer.domElement)
const textCanvas = document.createElement('canvas')
textCanvas.style.position = 'absolute'
textCanvas.style.top = '0'
// textCanvas.style.pointerEvents = 'none'

textCanvas.width = window.innerWidth
textCanvas.height = window.innerHeight

const ctx = textCanvas.getContext('2d')

document.body.append (textCanvas)

const ground = new Box({
    width  : 10, 
    height : 0.25, 
    depth  : 100,
    // map ,
    color: 0xf0f0f0,
    position: {x: 0, y: -2, z: -40},
    transparent: true,
    opacity: .01
})
ground.castShadow = true
ground.receiveShadow = true

const box = new Box({
    width : 1,
    height: 1,
    depth : 1,
    color : 0x0000ff,
    velocity: {x: 0, y: -0.01, z: 0},
    position: {x: 0, y: 0, z: 10}
})
box.castShadow = true

scene.add(box)
scene.add(ground)

addEventListener('keydown', Input.listener)
addEventListener('keyup', Input.listener)

const shots = []
let shotsMax = 10

function handler (cube) {
    if (Input.keys.UP) {
        cube.velocity.z -= 0.001
    } else if (Input.keys.DOWN) {
        cube.velocity.z += 0.001
    } else {
        cube.velocity.z = 0 // Reset Z position if no input
    }
    
    if (Input.keys.LEFT) {
        if (cube.position.x < -4) {
            cube.velocity.x = 0 // Prevent moving left beyond a certain point
            return;
        }
        cube.velocity.x -= 0.001
    } else if (Input.keys.RIGHT) {
        if (cube.position.x > 4) {
            cube.velocity.x = 0 // Prevent moving left beyond a certain point
            return;
        }
        cube.velocity.x += 0.001
    } else {
        cube.velocity.x = 0 // Reset X position if no input
    }

    if (Input.keys.SPACE) {
        Input.keys.SPACE = false
        if (shots.length < shotsMax) {
            const shot = cube.shot ();
            shots.push(shot)
            scene.add(shot)
            // return; 
        }
    }  
}
Input.handler = handler;

const enemies = []
let frames = 0, loop = 0

function shotMeter () {
    ctx.strokeStyle = 'white'
    ctx.lineWidth = 2
    const meterWidth = textCanvas.width/2 - 10
    ctx.strokeRect(textCanvas.width/2, 10, meterWidth, 20 )
    ctx.fillStyle = 'rgba(255,0,0,0.7)'
    let meter = (meterWidth - 4) * shots.length / shotsMax 
    ctx.fillRect(textCanvas.width/2 + 2, 10 +2, meter , 20 - 4 )    
}

function animate() {
    ctx.clearRect(0, 0, textCanvas.width, textCanvas.height)

    ctx.fillStyle = 'white'
    ctx.font = '24px Arial'
    ctx.fillText(`FPS: ${Math.round(renderer.info.render.frame / (performance.now() / 1000))}`, 10, 30)

    
    shotMeter()
    

    loop = requestAnimationFrame(animate)
    renderer.render(scene, camera)
    
    box.update(ground)
    box.rotation.x += 0.05
    box.rotation.y += 0.05

    Input.handler(box)

    shots.forEach((item, index) => {
        item.update(ground)
        if (item.position.z < -50) {
            scene.remove(item)
            shots.splice(index, 1)
        }
    }) 

    enemies.forEach((enemy, i) => {
        enemy.rotation.x += 0.05
        enemy.rotation.y += 0.05
        enemy.update(ground)
        if (boxCollision(enemy, box)) {
            ctx.textAlign='center'
            ctx.fillStyle= "red"
            ctx.font = "bold 60px Arial"
            ctx.fillText ("GAME OVER", textCanvas.width / 2, textCanvas.height / 2)
             cancelAnimationFrame(loop)
        }

        if (enemy.position.z > 14) {
            scene.remove(enemy)
            enemies.splice(i, 1)
        }

        shots.forEach((item, index) => {
            if (boxCollision(enemy, item)) {
                scene.remove(enemy)
                enemies.splice(i, 1)
                scene.remove(item)
                shots.splice(index, 1)
            }
        })         
    })
            
    frames++
    if (frames % 60 === 0) {
        const enemy = spawnEnemy()  
        enemies.push(enemy)
        scene.add(enemy) 
    }    
}     

animate()