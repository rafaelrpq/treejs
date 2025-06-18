import * as THREE from 'three';
import { boxCollision } from './utils.js';

export class Box extends THREE.Mesh {
    constructor({
        width, height, depth, color=0x00ff00, map = null, 
        velocity = {x: 0, y: 0, z: 0},
        position = {x: 0, y: 0, z: 0},
        zAcceleration,
        transparent = false,
        opacity = 1
    }) {

        super (
            new THREE.BoxGeometry(width, height, depth), 
            new THREE.MeshStandardMaterial({ color, map, transparent, opacity })
        )
        this.height = height
        this.width  = width
        this.depth  = depth
        
        this.position.set(position.x, position.y, position.z)

        this.bottom = this.position.y - this.height / 2
        this.top    = this.position.y + this.height / 2

        this.left   = this.position.x - this.width / 2
        this.right  = this.position.x + this.width / 2

        this.front  = this.position.z + this.depth / 2
        this.back   = this.position.z - this.depth / 2


        this.velocity = velocity
        this.gravity = -0.005

        this.zAcceleration = zAcceleration || 0

    }

    updateSides () {
        this.bottom = this.position.y - this.height / 2
        this.top    = this.position.y + this.height / 2

        this.left   = this.position.x - this.width / 2
        this.right  = this.position.x + this.width / 2

        this.front  = this.position.z + this.depth / 2
        this.back   = this.position.z - this.depth / 2
    }

    update(ground) {
        this.updateSides()

        this.velocity.z += this.zAcceleration

        this.position.x += this.velocity.x
        this.position.z += this.velocity.z
        
        // this.applyGravity(ground)
    }

    applyGravity(ground) {
        this.velocity.y += this.gravity
        
        if (boxCollision(this, ground)) {
            this.velocity.y *= 0.5
            this.velocity.y *= -1
        } else {
            this.position.y += this.velocity.y 
        }         
    }

    shot(enemy) {
        let dir = 1
        let color = 0xff0000
        if (enemy) {
            dir = -1
            color = 0x00ff00
        }

        return (new Box({
            width: 0.1, 
            height: 0.1, 
            depth: 0.1, 
            color,
            position: {x: this.position.x, y: this.position.y, z: this.position.z},
            velocity: {x: 0, y: 0, z: -0.25 * dir}
        }))        
    }
}