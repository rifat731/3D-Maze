
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
        
        /*const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        context.font = 'Bold 40px Arial';
        context.fillStyle = 'white'; THIS IS FOR ADDING TEXT TO BUTTONS
        context.fillText('Hello', 0, 40);
        const texture = new THREE.CanvasTexture(canvas);*/
        //scene.add(context);


        const material = new THREE.SpriteMaterial();
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(100, 100, 1);
        sprite.position.set(window.innerWidth / 2 - 60, 0, 0);
        sprite.name = "ResetLevel";
        sprite.position.set((window.innerWidth / 2) - 60, 0, 0);
        scene.add(sprite);
       // sprite.style.display = 'menu';
       this.buttons.push(sprite);
        const canvas1 = document.createElement('canvas');
        const context1 = canvas1.getContext('2d');
        context1.font = 'Bold 40px Arial';
        context1.fillStyle = 'black';
        context1.fillText('Reset', 0, 40);

        const texture1 = new THREE.CanvasTexture(canvas1);
        const material1Text = new THREE.SpriteMaterial({ map: texture1 });
        const sprite1Text = new THREE.Sprite(material1Text);
        sprite1Text.scale.set(100, 100, 1);
        //sprite4Text.position.set(window.innerWidth / 2 - 60, 375, 0);
        sprite1Text.name = "boo";

        //this.buttons.push(sprite4);
        //sprite4Text.position.set((window.innerWidth / 2) - 60, 375, 0);
        scene.add(sprite1Text);
        sprite1Text.position.copy(sprite.position).add(new THREE.Vector3(0, 2, 0)); // offset

        

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
        


        const material4 = new THREE.SpriteMaterial();
        const sprite4 = new THREE.Sprite(material4);
        sprite4.scale.set(200, 50, 1);
       // sprite4.position.set(window.innerWidth / 2 - 60, 375, 0);
        sprite4.name = "Resume";
        this.buttons.push(sprite4);
        scene.add(sprite4);
        
        const canvas4 = document.createElement('canvas');
        const context4 = canvas4.getContext('2d');
        context4.font = 'Bold 40px Arial';
        context4.fillStyle = 'black';
        context4.fillText('Return', 0, 40);

        const texture4 = new THREE.CanvasTexture(canvas4);
        const material4Text = new THREE.SpriteMaterial({ map: texture4 });
        const sprite4Text = new THREE.Sprite(material4Text);
        sprite4Text.scale.set(100, 100, 1);

        sprite4Text.name = "boo";

        scene.add(sprite4Text);
        sprite4Text.position.copy(sprite4.position).add(new THREE.Vector3(0, 2, 0)); 


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
        if(this.main.amountOfFloors < 10)
        {
            this.main.amountOfFloors += 1;
            console.log("amount of levels increased by 1");
        }
    }
    //ResumeButton();
    

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