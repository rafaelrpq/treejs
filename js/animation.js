// js/animation.js

// Objetos que precisam ser atualizados a cada frame
const animatedObjects = [];
let controlsToUpdate = null; // Para OrbitControls ou similares

export function addObjectToAnimate(object, animationFn) {
    animatedObjects.push({ object, animationFn });
}

export function setControlsForUpdate(controls) {
    controlsToUpdate = controls;
}

export function startAnimationLoop(renderer, scene, camera) {
    function animate() {
        requestAnimationFrame(animate);

        // Atualiza os objetos animados
        animatedObjects.forEach(item => {
            if (item.animationFn) {
                item.animationFn(item.object);
            }
        });

        // Atualiza controles (ex: OrbitControls damping)
        if (controlsToUpdate && controlsToUpdate.update) {
            controlsToUpdate.update();
        }

        renderer.render(scene, camera);
    }
    animate();
}