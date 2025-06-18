import { Box } from './Box.js';

export function boxCollision (box1, box2) {
    const xCollision = box1.right >= box2.left && box1.left <= box2.right
    const yCollision = box1.top >= box2.bottom && box1.bottom + box1.velocity.y <= box2.top
    const zCollision = box1.front >= box2.back && box1.back <= box2.front
    return (xCollision && yCollision && zCollision)
}

export const Input = {
    keys: {
        UP: false,
        DOWN: false,
        LEFT: false,
        RIGHT: false,
        SPACE: false,
    },
    mouse: {
        x: 0,
        y: 0,
        down: false
    },
    
    listener: (e) => {
        const state = e.type === 'keydown' ? true : false
        console.log(e.code) 
        switch (e.code) {
            case 'KeyW':
                Input.keys.UP = state
                break
            case 'KeyS':
                Input.keys.DOWN = state
                break
            case 'KeyA':
                Input.keys.LEFT = state
                break
            case 'KeyD':
                Input.keys.RIGHT = state
                break
            case 'Space':
                Input.keys.SPACE = state
                break
        }
    },

    // handler: (cube) =>{
    //     if (Input.keys.UP) {
    //         cube.velocity.z -= 0.001
    //     } else if (Input.keys.DOWN) {
    //         cube.velocity.z += 0.001
    //     } else {
    //         cube.velocity.z = 0 // Reset Z position if no input
    //     }
        
    //     if (Input.keys.LEFT) {
    //         cube.velocity.x -= 0.001
    //     } else if (Input.keys.RIGHT) {
    //         cube.velocity.x += 0.001
    //     } else {
    //         cube.velocity.x = 0 // Reset X position if no input
    //     }

    //     if (Input.keys.SPACE) {
    //         Input.keys.SPACE = !Input.keys.SPACE  // Reset SPACE key after jump            
    //         cube.velocity.y += 0.125  
    //     }  
    // }
        
    handler: null,
}

export function spawnEnemy() {
    const enemy = new Box({
        width  : 1, 
        height : 1, 
        depth  : 1,
        color  : 0xfd0000,
        velocity: {x: 0, y: -0.01, z: 0.05},
        position: {x: Math.random() * 12 - 6, y: 0, z: -300},
        zAcceleration: 0.0001
    })
    enemy.castShadow = true
    return enemy
}