
import * as THREE from 'three';
export class GameUI {
    constructor() {
        this.levelInfo = document.getElementById('level-info');
        this.timer = document.getElementById('timer');
        this.instructions = document.getElementById('instructions');
        this.startTime = Date.now();
        this.currentLevel = 1;
        this.buttons = [];
        this.main = null;


    }

    createButtons(scene, main)
    {
        const material = new THREE.SpriteMaterial();
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(100, 100, 1);
        sprite.position.set(window.innerWidth / 2 - 60, 0, 0);
        sprite.name = "ResetLevel";
       // sprite.style.display = 'menu';
       this.buttons.push(sprite);
        sprite.position.set((window.innerWidth / 2) - 60, 0, 0);
        scene.add(sprite);
        this.main = main; 

        const material2 = new THREE.SpriteMaterial();
        const sprite2 = new THREE.Sprite(material2);
        sprite2.scale.set(100, 100, 1);
        sprite2.position.set(window.innerWidth / 2 - 60, 125, 0);
        sprite2.name = "LessFloors";

        this.buttons.push(sprite2);
        sprite2.position.set((window.innerWidth / 2) - 60, 125, 0);
        scene.add(sprite2);

        const material3 = new THREE.SpriteMaterial();
        const sprite3 = new THREE.Sprite(material3);
        sprite3.scale.set(100, 100, 1);
        sprite3.position.set(window.innerWidth / 2 - 60, 250, 0);
        sprite3.name = "MoreFloors";

        this.buttons.push(sprite3);
        sprite3.position.set((window.innerWidth / 2) - 60, 250, 0);
        scene.add(sprite3);

    }
    ResetButton()
    {
        console.log("EHFWHEIF");
        this.main.resetGame();
    }
    lessFloorsButton()
    {
        if(this.main.amountOfFloors > 1)
        {
        this.main.amountOfFloors -=1;
        console.log("amount of levels reduced by 1");
        }
    }
    MoreFloorsButton()
    {
        this.main.amountOfFloors += 1;
        console.log("amount of levels increased by 1");
    }
    

    showGameUI() {
        document.getElementById('menu').style.display = 'none';
        document.getElementById('game-ui').style.display = 'block';
    }

    showMenuUI() {
        document.getElementById('menu').style.display = 'block';
        document.getElementById('game-ui').style.display = 'none';

    }

    update() {

        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        this.timer.textContent = `Time: ${minutes}:${seconds.toString().padStart(2, '0')}`;

    }

    updateLevel(level) {
        this.currentLevel = level;
        this.levelInfo.textContent = `Level ${level}`;
        this.startTime = Date.now();
    }

    resetTimer() {
        this.startTime = Date.now();
    }
} 