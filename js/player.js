import * as THREE from 'three';

export class Player {
    constructor(camera, scene) {
        this.camera = camera;
        this.scene = scene;
        this.moveSpeed = 0.1;
        this.jumpForce = 60;
        this.gravity = 1;
        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();
        this.moveDirection = new THREE.Vector3();
        this.forward = new THREE.Vector3();
        this.right = new THREE.Vector3();
        this.clock = new THREE.Clock();
        
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.canJump = true;

        this.collisionDistance = 1.2;
        this.playerRadius = 0.6;
        this.playerHeight = 1.6;
        this.maxJumpHeight = 20.0;

        this.raycaster = new THREE.Raycaster();
        this.raycaster2 = new THREE.Raycaster();
        this.groundCheckRay = new THREE.Vector3(0, -1, 0);
        this.roofCheckRay = new THREE.Vector3(0,1,0);
        //this.camera.add(this.groundCheckRay);
        //this.camera.add(this.roofCheckRay);
       // this.camera.add(this.raycaster);
    }

    handleKeyDown(event) {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                this.moveForward = true;
                break;
            case 'ArrowDown':
            case 'KeyS':
                this.moveBackward = true;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                this.moveLeft = true;
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.moveRight = true;
                break;
            case 'Space':
                if (this.canJump && this.camera.position.y < this.maxJumpHeight) {
                    this.velocity.y = this.jumpForce;
                    this.canJump = false;
                }
                break;
        }
    }

    handleKeyUp(event) {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                this.moveForward = false;
                break;
            case 'ArrowDown':
            case 'KeyS':
                this.moveBackward = false;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                this.moveLeft = false;
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.moveRight = false;
                break;
        }
    }

    checkCollision(position, direction) {
        const angles = [0, Math.PI/4, Math.PI/2, 3*Math.PI/4, Math.PI, 5*Math.PI/4, 3*Math.PI/2, 7*Math.PI/4];
        let minDistance = Infinity;
        let collision = false;
        
        for (const angle of angles) {
            const rayDirection = new THREE.Vector3(
                Math.cos(angle),
                0,
                Math.sin(angle)
            );
            
            const rayStart = position.clone();
            rayStart.y = this.camera.position.y - this.playerHeight / 2;
            
            this.raycaster.set(rayStart, rayDirection);
            const intersects = this.raycaster.intersectObjects(this.scene.children, true);
            
            if (intersects.length > 0) {
                const distance = intersects[0].distance;
                //console.log(intersects.length);
                //console.log(intersects[0].object.name);
                
                if (intersects[0].object.name == "endMarker" || intersects[0].object.name === "clipBox")          
                {
                   // console.log("WE FOUND THE END");
                }
                else if (distance < this.playerRadius) {
                    collision = true;
                    minDistance = Math.min(minDistance, distance);
                }
            }
        }
        
        return {
            collision,
            distance: minDistance
        };
    }

    update() {
        this.velocity.y -= this.gravity;
        
        this.raycaster.set(this.camera.position, this.groundCheckRay);
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);
        var ignorefall = false;
        for (var i = 0; i < intersects.length; i++) {
            if (intersects[i].object.name === "clipBox" && intersects[i].distance < this.playerHeight) {
             //   console.log("HEOIHWFGOIHWEG");
                ignorefall = true;
                // break;
            }
        }
        if (intersects.length > 0 && intersects[0].distance < this.playerHeight && !ignorefall) {
            if (this.velocity.y < 0) {
                this.velocity.y = 0;
                this.camera.position.y = intersects[0].point.y + this.playerHeight;
               // console.log("We sjould now be taller");
                this.canJump = true;
            }
        }
        this.raycaster2.set(this.camera.position, this.roofCheckRay);
        const intersects2 = this.raycaster2.intersectObjects(this.scene.children, true);
        var ignoreCollision =  false;
        for (var i = 0; i < intersects2.length; i++) {
            if (intersects2[i].object.name === "clipBox" && intersects2[i].distance < this.playerHeight) {
              //  console.log("HEOIHWFGOIHWEG");
                ignoreCollision = true;
               // break;
            }
            }
         if (intersects2.length > 0 && intersects2[0].distance < this.playerHeight && !ignoreCollision) {
            if (this.velocity.y > 0) {
                this.velocity.y = 0;
             //   console.log("you hit your head");
            }
        }

        this.moveDirection.set(0, 0, 0);

        this.forward.set(0, 0, -1);
        this.forward.applyQuaternion(this.camera.quaternion);
        this.forward.y = 0;
        this.forward.normalize();

        this.right.set(1, 0, 0);
        this.right.applyQuaternion(this.camera.quaternion);
        this.right.y = 0;
        this.right.normalize();

        if (this.moveForward) this.moveDirection.add(this.forward);
        if (this.moveBackward) this.moveDirection.sub(this.forward);
        if (this.moveRight) this.moveDirection.add(this.right);
        if (this.moveLeft) this.moveDirection.sub(this.right);

        if (this.moveDirection.lengthSq() > 0) {
            this.moveDirection.normalize();
            const nextPosition = this.camera.position.clone();
            nextPosition.addScaledVector(this.moveDirection, this.moveSpeed);

            const collisionResult = this.checkCollision(this.camera.position, this.moveDirection);
            
            if (!collisionResult.collision) {
                this.camera.position.copy(nextPosition);
            } else {
                const slideDirection1 = new THREE.Vector3(-this.moveDirection.z, 0, this.moveDirection.x);
                const slideDirection2 = new THREE.Vector3(this.moveDirection.z, 0, -this.moveDirection.x);
                
                const nextPosition1 = this.camera.position.clone().addScaledVector(slideDirection1, this.moveSpeed);
                const nextPosition2 = this.camera.position.clone().addScaledVector(slideDirection2, this.moveSpeed);
                
                const collision1 = this.checkCollision(nextPosition1, slideDirection1);
                const collision2 = this.checkCollision(nextPosition2, slideDirection2);
                
                if (!collision1.collision || collision1.distance > this.playerRadius) {
                    this.camera.position.copy(nextPosition1);
                } else if (!collision2.collision || collision2.distance > this.playerRadius) {
                    this.camera.position.copy(nextPosition2);
                }
            }
        }

        const nextHeight = this.camera.position.y + this.velocity.y *this.clock.getDelta();
        if (nextHeight <= this.maxJumpHeight) {
            this.camera.position.y = nextHeight;
        } else {
            this.velocity.y = 0;
        }

        if (this.camera.position.y < this.playerHeight) {
            this.camera.position.y = this.playerHeight;
            this.velocity.y = 0;
            this.canJump = true;
        }
    }
} 
