import * as THREE from 'three';

export class Player {
    constructor(camera, scene) {
        this.camera = camera;
        this.scene = scene;
        this.moveSpeed = 0.08;
        this.jumpForce = 0.2;
        this.gravity = 0.01;
        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();
        this.moveDirection = new THREE.Vector3();
        this.forward = new THREE.Vector3();
        this.right = new THREE.Vector3();
        
        // 移动标志
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.canJump = true;

        // 碰撞检测参数
        this.collisionDistance = 1.2;
        this.playerRadius = 0.6;
        this.playerHeight = 1.6;
        this.maxJumpHeight = 2.0;

        // 射线检测器
        this.raycaster = new THREE.Raycaster();
        this.groundCheckRay = new THREE.Vector3(0, -1, 0);
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
            // 计算射线方向
            const rayDirection = new THREE.Vector3(
                Math.cos(angle),
                0,
                Math.sin(angle)
            );
            
            // 设置射线起点（从玩家位置开始）
            const rayStart = position.clone();
            rayStart.y = this.camera.position.y - this.playerHeight / 2;
            
            this.raycaster.set(rayStart, rayDirection);
            const intersects = this.raycaster.intersectObjects(this.scene.children, true);
            
            if (intersects.length > 0) {
                const distance = intersects[0].distance;
                if (distance < this.playerRadius) {
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
        // 应用重力
        this.velocity.y -= this.gravity;
        
        // 检查地面碰撞
        this.raycaster.set(this.camera.position, this.groundCheckRay);
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);
        
        if (intersects.length > 0 && intersects[0].distance < 2) {
            if (this.velocity.y < 0) {
                this.velocity.y = 0;
                this.camera.position.y = intersects[0].point.y + this.playerHeight;
                this.canJump = true;
            }
        }

        // 重置移动方向
        this.moveDirection.set(0, 0, 0);

        // 计算前进方向（相机的-z方向）
        this.forward.set(0, 0, -1);
        this.forward.applyQuaternion(this.camera.quaternion);
        this.forward.y = 0;
        this.forward.normalize();

        // 计算右方向（相机的x方向）
        this.right.set(1, 0, 0);
        this.right.applyQuaternion(this.camera.quaternion);
        this.right.y = 0;
        this.right.normalize();

        // 根据按键状态计算移动方向
        if (this.moveForward) this.moveDirection.add(this.forward);
        if (this.moveBackward) this.moveDirection.sub(this.forward);
        if (this.moveRight) this.moveDirection.add(this.right);
        if (this.moveLeft) this.moveDirection.sub(this.right);

        // 如果有移动输入
        if (this.moveDirection.lengthSq() > 0) {
            this.moveDirection.normalize();
            
            // 计算下一个位置
            const nextPosition = this.camera.position.clone();
            nextPosition.addScaledVector(this.moveDirection, this.moveSpeed);

            // 检查碰撞
            const collisionResult = this.checkCollision(this.camera.position, this.moveDirection);
            
            if (!collisionResult.collision) {
                // 没有碰撞，正常移动
                this.camera.position.copy(nextPosition);
            } else {
                // 有碰撞，尝试滑动
                const slideDirection1 = new THREE.Vector3(-this.moveDirection.z, 0, this.moveDirection.x);
                const slideDirection2 = new THREE.Vector3(this.moveDirection.z, 0, -this.moveDirection.x);
                
                // 尝试向两个垂直方向滑动
                const nextPosition1 = this.camera.position.clone().addScaledVector(slideDirection1, this.moveSpeed);
                const nextPosition2 = this.camera.position.clone().addScaledVector(slideDirection2, this.moveSpeed);
                
                const collision1 = this.checkCollision(nextPosition1, slideDirection1);
                const collision2 = this.checkCollision(nextPosition2, slideDirection2);
                
                // 选择没有碰撞或距离墙较远的方向
                if (!collision1.collision || collision1.distance > this.playerRadius) {
                    this.camera.position.copy(nextPosition1);
                } else if (!collision2.collision || collision2.distance > this.playerRadius) {
                    this.camera.position.copy(nextPosition2);
                }
            }
        }

        // 应用垂直移动（跳跃/重力）
        const nextHeight = this.camera.position.y + this.velocity.y;
        if (nextHeight <= this.maxJumpHeight) {
            this.camera.position.y = nextHeight;
        } else {
            this.velocity.y = 0;
        }

        // 防止掉出地图
        if (this.camera.position.y < this.playerHeight) {
            this.camera.position.y = this.playerHeight;
            this.velocity.y = 0;
            this.canJump = true;
        }
    }
} 