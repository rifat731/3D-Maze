import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { MazeGenerator } from './mazeGenerator.js';
import { Player } from './player.js';
import { GameUI } from './gameUI.js';

class Game {
    constructor() {
        this.currentLevel = 1;
        this.amountOfFloors = 1;
        this.initialize();
        this.loadingLevel = false;
        this.clipPlane;
        this.clipPlane2;
        this.frameCount = 0;
        this.frameINterval =  30;
        this.previousDirection = new THREE.Vector3();

    }
    

    initialize() {
        this.scene = new THREE.Scene();
        this.UISCENE = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB);

        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            500
        );
        this.camera.position.y = 1.6;
        this.uiCamera = new THREE.OrthographicCamera(-window.innerWidth / 2,
            window.innerWidth / 2,
            window.innerHeight / 2,
            -window.innerHeight / 2,
            0,
            10
        );
        this.scene.fog = new THREE.Fog(0xcccccc, 10, 30);
      

        this.renderer = new THREE.WebGLRenderer({ antialias: true, stencil:true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.localClippingEnabled = true;
        this.renderer.shadowMap.enabled = true;
        this.renderer.autoClear = false;
        document.body.appendChild(this.renderer.domElement);
        const clipHeight = 10; 
        this.clipPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0);
        
       // this.renderer.clippingPlanes = [this.clipPlane];

        this.setupLighting();

        this.controls = new PointerLockControls(this.camera, document.body);

        this.player = new Player(this.camera, this.scene);
        //this.camera.add(clipPlane);

        

        this.setupMaze();
        

        this.gameUI = new GameUI();
        this.gameUI.createButtons(this.UISCENE, this);

        this.setupEventListeners();
        

        this.animate();

        document.getElementById('loading-screen').style.display = 'none';
        
    }

    setupMaze() {
        const baseSize = 15;
        const mazeSize = baseSize + (this.currentLevel - 1) * 2;

        
        
        this.mazeGenerator = new MazeGenerator(mazeSize, mazeSize, this.scene, this.amountOfFloors, this.clipPlane);
        
        this.maze = this.mazeGenerator.generate();
        this.player.maxJumpHeight = (this.mazeGenerator.amountOfLevels * this.mazeGenerator.wallHeight) - this.player.playerHeight* 2.5;

        const { start } = this.mazeGenerator.getStartAndEnd();

        this.camera.position.set(start.x, start.y, start.z);
        this.camera.position.y = start.y;
        this.camera.position.x = start.x;
        this.camera.position.z = start.z;
    }

    setupLighting() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(50, 50, 0);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);

        const hemisphereLight = new THREE.HemisphereLight(0x87CEEB, 0x404040, 0.6);
        this.scene.add(hemisphereLight);
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
        const raycasterer = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        document.addEventListener('click', (event) => {
            
            console.log("we have clicked here");
            console.log(this.controls.isLocked);
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

            raycasterer.setFromCamera(mouse, this.uiCamera);
            const intersectser = raycasterer.intersectObjects(this.gameUI.buttons);

            if (intersectser.length ==1) {
                console.log("You clicked:", intersectser[0].object.name || "an object");
                if (intersectser[0].object.name == "ResetLevel") {
                    this.gameUI.ResetButton();
                }
                else if (intersectser[0].object.name == "LessFloors") {
                    this.gameUI.lessFloorsButton();
                }
                else if (intersectser[0].object.name == "MoreFloors") {
                    this.gameUI.MoreFloorsButton();
                }
                else if (intersectser[0].object.name == "Resume")
                {
                    if (!this.controls.isLocked) {
                        this.controls.lock();
                    }
                }
            }
            
           /* else if (!this.controls.isLocked) {
                this.controls.lock();
            }*/
        }
        );

        this.controls.addEventListener('lock', () => {
            this.gameUI.showGameUI();
        });

        this.controls.addEventListener('unlock', () => {
            this.gameUI.showMenuUI();
        });

        document.addEventListener('keydown', (event) => {
            this.player.handleKeyDown(event);
        });

        document.addEventListener('keyup', (event) => {
            this.player.handleKeyUp(event);
        });
    }

    checkEndReached() {
        const { end } = this.mazeGenerator.getStartAndEnd();
        const playerX = Math.round(this.camera.position.x / this.mazeGenerator.cellSize);
        const playerZ = Math.round(this.camera.position.z / this.mazeGenerator.cellSize);
        const playerY = Math.round(this.camera.position.y);

        if (playerX === Math.round(end.x / this.mazeGenerator.cellSize) && 
            playerZ === Math.round(end.z / this.mazeGenerator.cellSize) && (playerY >= Math.round(end.y - this.mazeGenerator.wallHeight / 1.3))) {
            
            this.nextLevel();
            
        }
    }

    nextLevel() {
        
        this.currentLevel++;
        
        while(this.scene.children.length > 0){ 
            this.scene.remove(this.scene.children[0]); 
        }

        this.setupLighting();
        
        this.setupMaze();
        document.getElementById('loading-screen').style.display = 'block';
        
        this.gameUI.updateLevel(this.currentLevel);
        this.gameUI.resetTimer();
        this.loadingLevel = true;
       // document.getElementById('loading-screen').style.display = 'none';
    }
    resetGame()
    {
        
        this.currentLevel = 1;
        
        while (this.scene.children.length > 0) {
            this.scene.remove(this.scene.children[0]);
        }

        this.setupLighting();

        this.setupMaze();
        
        document.getElementById('loading-screen').style.display = 'block';

        this.gameUI.updateLevel(this.currentLevel);
        this.gameUI.resetTimer();
       // document.getElementById('loading-screen').style.display = 'none';
        this.loadingLevel = true;
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        
        this.gameUI.update();
        this.renderer.clear();
        this.renderer.render(this.scene, this.camera);
        this.renderer.clearDepth();
        
        if (this.controls.isLocked) {
            this.player.update();
            this.checkEndReached();
            this.clipPlane.constant = this.camera.position.y + 20;
            this.frameCount++;
            var camDirection = new THREE.Vector3();
            this.camera.getWorldDirection(camDirection);

            const angleChange = this.previousDirection.dot(camDirection);


            const angle = Math.acos(THREE.MathUtils.clamp(angleChange, -1, 1)); // clamp to avoid NaNs


            if (angle > 0.05) {
                console.log('Sudden camera turn detected!');
                this.frameCount = this.frameINterval;
            }
            this.previousDirection.copy(camDirection);
            if (this.frameCount % this.frameINterval === 0) {
                this.scene.traverse((object) => {
                    if (object.isMesh && object.name != "endMarker" && object.name != "Floor") {
                        const distance = this.camera.position.distanceTo(object.position);
                        const toObject = new THREE.Vector3().subVectors(object.position, this.camera.position).normalize();
                        const dot = camDirection.dot(toObject);
                        const playerY = new THREE.Vector3(0,this.camera.position.y,0);
                        const objectY = new THREE.Vector3(0,object.position.y,0);
                        const ydistance = playerY.distanceTo(objectY);
                        if(ydistance > 15)
                        {
                            object.visible = false;
                        }
                        else if(dot < 0)
                        {
                            if(distance > 30)
                            {
                            object.visible = false;
                            }
                            else
                            {
                                object.visible = true;
                            }
                        }
                        else if(dot > 0 && distance > 100)
                        {
                            object.visible = false;
                        }
                        else
                        {
                            object.visible = true;
                        }
                        
                        //object.visible = distance < 50;
                       // console.log("THIS IS WHAT WE DID " + distance < 50);
                    }
                });
            }
        }
        else
        {
            this.renderer.render(this.UISCENE, this.uiCamera);
        }
        if(this.loadingLevel == true)
        {
            this.loadingLevel = false;
            this.frameCount = this.frameINterval;
            document.getElementById('loading-screen').style.display = 'none';
        }

    }
}

new Game(); 
