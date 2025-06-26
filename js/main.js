import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Box } from './Box.js';
import { Input, spawnEnemy, boxCollision } from './utils.js';
import { input } from './input.js';



const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    1000
)
camera.position.set(0, 16, 16)

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
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setClearColor(0x000000, 0)



const controls = new OrbitControls(camera, renderer.domElement);
// const loader = new GLTFLoader();

document.body.appendChild(renderer.domElement)
const textCanvas = document.createElement('canvas')
textCanvas.style.position = 'absolute'
textCanvas.style.top = '0'
// textCanvas.style.pointerEvents = 'none'

textCanvas.width = window.innerWidth
textCanvas.height = window.innerHeight

textCanvas.imageSmoothingEnabled = false

const ctx = textCanvas.getContext('2d')

document.body.append(textCanvas)

const ground = new Box({
    width: 10,
    height: 0.25,
    depth: 100,
    // map ,
    color: 0xf0f0f0,
    position: { x: 0, y: -2, z: -40 },
    transparent: true,
    opacity: .01
})
ground.castShadow = true
ground.receiveShadow = true

const box = new Box({
    width: 1,
    height: 1,
    depth: 1,
    color: 0x5555ff,
    velocity: { x: 0, y: -0.01, z: 0 },
    position: { x: 0, y: 0, z: 10 }
})
box.castShadow = true

scene.add(box)
scene.add(ground)

// addEventListener('keydown', Input.listener)
// addEventListener('keyup', Input.listener)

document.addEventListener('touchstart', input.touchListener, { 'passive': false })
document.addEventListener('touchend', input.touchListener)

const shots = []
let shotsMax = 10
const enemies = []
let frames = 0, loop = 0

function init() {
    location.reload()
}

// function handler (cube) {
//     if (Input.keys.UP) {
//         cube.velocity.z -= 0.001
//     } else if (Input.keys.DOWN) {
//         cube.velocity.z += 0.001
//     } else {
//         cube.velocity.z = 0 // Reset Z position if no input
//     }

//     if (Input.keys.LEFT) {
//         if (cube.position.x < -4) {
//             cube.velocity.x = 0 // Prevent moving left beyond a certain point
//             return;
//         }
//         cube.velocity.x -= 0.001
//     } else if (Input.keys.RIGHT) {
//         if (cube.position.x > 4) {
//             cube.velocity.x = 0 // Prevent moving left beyond a certain point
//             return;
//         }
//         cube.velocity.x += 0.001
//     } else {
//         cube.velocity.x = 0 // Reset X position if no input
//     }

//     if (Input.keys.SPACE) {
//         Input.keys.SPACE = false
//         if (shots.length < shotsMax) {
//             const shot = cube.shot ();
//             shots.push(shot)
//             scene.add(shot)
//             // return; 
//         }
//     }  
// }
// Input.handler = handler;

function handler() {
    const factor = 16

    // console.log (input.axis.y)

    if (box.position.x <= -4 && input.axis.x < 0) {
        box.velocity.x = 0
        return
    } else if (box.position.x >= 4 && input.axis.x > 0) {
        box.velocity.x = 0
        return
    }

    if (box.position.z >= 10 && input.axis.y > 0) {
        box.velocity.z = 0
        return
    } else if (box.position.z < 3 && input.axis.y < 0) {
        box.velocity.z = 0
        return
    }

    if (input.button.S) {
        input.button.S = false
        if (shots.length < shotsMax) {
            const shot = box.shot();
            shots.push(shot)
            scene.add(shot)
            return;
        }
    }

    box.velocity.x = input.axis.x / factor
    box.velocity.z = input.axis.y / factor
}



function shotMeter() {
    ctx.strokeStyle = 'white'
    ctx.lineWidth = 2
    const meterWidth = 150
    ctx.strokeRect(textCanvas.width - meterWidth - 10, 10, meterWidth, 20)
    ctx.fillStyle = 'rgba(255,0,0,0.7)'
    let meter = (meterWidth - 4) * shots.length / shotsMax
    ctx.fillRect(textCanvas.width - meterWidth - 8, 10 + 2, meter, 20 - 4)
}

function debug() {
    ctx.fillStyle = 'white'
    ctx.font = '24px Arial'
    ctx.fillText(`FPS: ${Math.round(renderer.info.render.frame / (performance.now() / 1000))}`, 10, 30)
    // ctx.fillText(`box: ${box.position.x.toFixed(2)}, ${box.position.y.toFixed(2)}, ${box.position.z.toFixed(2)}`, 10, 60)
}


function gameover() {
    ctx.textAlign = 'center';
    ctx.fillStyle = "red";
    ctx.font = "bold 60px Arial";
    ctx.fillText("GAME OVER", textCanvas.width / 2, textCanvas.height / 2);
    cancelAnimationFrame(loop);
    state = State.GAMEOVER
}

const State = {
    INITIALIZING: -1,
    GAMEOVER: 0,
    RUNNING: 1,
    PAUSED: 2
}

let state = State.INITIALIZING;

document.querySelector('[key=Enter]').addEventListener('touchstart', (e) => {
    switch (state) {
        case State.GAMEOVER:
            init()
            break;
        case State.INITIALIZING:
            animate()
            state = State.RUNNING
            break;
        case State.RUNNING:
            ctx.save()
            state = State.PAUSED
            ctx.textAlign = 'center';
            ctx.fillStyle = "white";
            ctx.font = "bold 60px Arial";
            ctx.fillText("PAUSED", textCanvas.width / 2, textCanvas.height / 2);
            ctx.restore()
            cancelAnimationFrame(loop)
            break;
        case State.PAUSED:
            state = State.RUNNING
            animate()
            break;
    }

}, { 'passive': true });

document.addEventListener('keydown', e => {
    if (e.key === 'Enter') pause();
}, { 'passive': false });

const img = new Image();
img.src = 'res/logo2.png'
const wcenter = textCanvas.width / 2
const hcenter = textCanvas.height / 2


img.onload = () => {
    ctx.save()
    ctx.clearRect(0, 0, textCanvas.width, textCanvas.height)
    ctx.drawImage(img, wcenter - img.width / 2, hcenter - img.height / 2, img.width, img.height)
    ctx.textAlign = 'center';
    ctx.fillStyle = "white";
    ctx.font = "bold 10px Arial";
    ctx.fillText("- APERTE START -", wcenter, hcenter - img.height / 2 + 100)
    ctx.restore()
}

function animate() {
    ctx.clearRect(0, 0, textCanvas.width, textCanvas.height)

    ctx.save()
    debug()
    shotMeter()
    ctx.restore()

    loop = requestAnimationFrame(animate)
    renderer.render(scene, camera)

    box.update(ground)
    // box.rotation.x += 0.05
    // box.rotation.y += 0.05

    // Input.handler(box)
    handler()



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
            gameover()
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

