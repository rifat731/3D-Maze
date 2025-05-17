import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { MazeGenerator } from './mazeGenerator.js';
import { Player } from './player.js';
import { GameUI } from './gameUI.js';

class Game {
    constructor() {
        this.currentLevel = 1;
        this.initialize();
    }

    initialize() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB);

        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.y = 1.6;
        this.mapCamera = new THREE.PerspectiveCamera(75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        document.body.appendChild(this.renderer.domElement);

        this.setupLighting();

        this.controls = new PointerLockControls(this.camera, document.body);

        this.player = new Player(this.camera, this.scene);
        this.mesh = (new THREE.Mesh(new THREE.BoxGeometry(5, 1, 1), new THREE.MeshBasicMaterial()));
        //this.camera.add(this.mesh);
        this.camera.add(this.mesh);
         this.mesh.position.set(this.camera.position);
        

        this.setupMaze();

        this.gameUI = new GameUI();

        this.setupEventListeners();
        this.mapCamera.position.y = 50;
        //this.mapCamera.lookAt(0,0,0);


        this.animate();

        document.getElementById('loading-screen').style.display = 'none';
    }

    setupMaze() {
        const baseSize = 15;
        const mazeSize = baseSize + (this.currentLevel - 1) * 2;
        this.mapCamera.position.set(mazeSize/8 , 50,1);
        this.mapCamera.lookAt(mazeSize/8, 0, 1);
        
        
        this.mazeGenerator = new MazeGenerator(mazeSize, mazeSize);
        
        const maze = this.mazeGenerator.generate();
        this.scene.add(maze);
        

        const { start } = this.mazeGenerator.getStartAndEnd();
        this.mesh.position.set(start);
        this.camera.position.set(start.x, start.y, start.z);
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

        document.addEventListener('click', () => {
            if (!this.controls.isLocked) {
                this.controls.lock();
            }
        });

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

        if (playerX === Math.round(end.x / this.mazeGenerator.cellSize) && 
            playerZ === Math.round(end.z / this.mazeGenerator.cellSize)) {
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
        
        this.gameUI.updateLevel(this.currentLevel);
        this.gameUI.resetTimer();
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        if (this.controls.isLocked) {
            this.player.update();
            
            this.checkEndReached();
        }

        this.gameUI.update();
        this.mesh.position.set(this.camera.position);
        this.renderer.render(this.scene, this.camera);
    }
}

new Game(); 