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
        // 创建场景
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); // 天蓝色背景

        // 创建相机
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.y = 1.6;

        // 创建渲染器
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        document.body.appendChild(this.renderer.domElement);

        // 添加光源
        this.setupLighting();

        // 初始化控制器
        this.controls = new PointerLockControls(this.camera, document.body);

        // 创建玩家
        this.player = new Player(this.camera, this.scene);

        // 创建并生成迷宫
        this.setupMaze();

        // 创建UI
        this.gameUI = new GameUI();

        // 事件监听
        this.setupEventListeners();

        // 开始游戏循环
        this.animate();

        // 移除加载屏幕
        document.getElementById('loading-screen').style.display = 'none';
    }

    setupMaze() {
        // 根据关卡增加迷宫大小
        const baseSize = 15;
        const mazeSize = baseSize + (this.currentLevel - 1) * 2;
        
        // 创建迷宫生成器
        this.mazeGenerator = new MazeGenerator(mazeSize, mazeSize);
        
        // 生成迷宫并添加到场景
        const maze = this.mazeGenerator.generate();
        this.scene.add(maze);

        // 获取起点位置并设置玩家位置
        const { start } = this.mazeGenerator.getStartAndEnd();
        this.camera.position.set(start.x, start.y, start.z);
    }

    setupLighting() {
        // 环境光
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        // 方向光（模拟太阳光）
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(50, 50, 0);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);

        // 半球光（为了更好的环境光效果）
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
        
        // 清除当前迷宫
        while(this.scene.children.length > 0){ 
            this.scene.remove(this.scene.children[0]); 
        }

        // 重新设置光照
        this.setupLighting();
        
        // 生成新迷宫
        this.setupMaze();
        
        // 更新UI
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
        this.renderer.render(this.scene, this.camera);
    }
}

// 启动游戏
new Game(); 