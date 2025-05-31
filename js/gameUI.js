
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
        this.levelsText = null;


    }

    createButtons(scene, main)
    {
        const material = new THREE.SpriteMaterial();
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(100, 100, 1);
        sprite.position.set(window.innerWidth / 2 - 60, 0, 0);
        sprite.name = "ResetLevel";
        sprite.position.set((window.innerWidth / 2) - 60, 0, 0);
        scene.add(sprite);
       this.buttons.push(sprite);
        const canvas1 = document.createElement('canvas');
        const context1 = canvas1.getContext('2d');
        context1.font = 'Bold 50px "Press Start 2P"';
        context1.fillStyle = 'black';
        context1.fillText('Reset', 20, 95);

        const texture1 = new THREE.CanvasTexture(canvas1);
        const material1Text = new THREE.SpriteMaterial({ map: texture1 });
        const sprite1Text = new THREE.Sprite(material1Text);
        sprite1Text.scale.set(100, 100, 1);
        sprite1Text.name = "boo";
        scene.add(sprite1Text);
        sprite1Text.position.copy(sprite.position).add(new THREE.Vector3(0, 2, 0));
        this.main = main; 

        const material2 = new THREE.SpriteMaterial();
        const sprite2 = new THREE.Sprite(material2);
        sprite2.scale.set(100, 100, 1);
        sprite2.position.set(window.innerWidth / 2 - 60, 125, 0);
        sprite2.name = "LessFloors";

        this.buttons.push(sprite2);
        sprite2.position.set((window.innerWidth / 2) - 60, 125, 0);
        scene.add(sprite2);
        const canvas2 = document.createElement('canvas');
        const context2 = canvas2.getContext('2d');
        context2.font = 'Bold 140px "Press Start 2P"';
        context2.fillStyle = 'black';
        context2.fillText('_', 90, 90);

        const texture2 = new THREE.CanvasTexture(canvas2);
        const material2Text = new THREE.SpriteMaterial({ map: texture2 });
        const sprite2Text = new THREE.Sprite(material2Text);
        sprite2Text.scale.set(100, 100, 1);
        sprite2Text.name = "boo";
        scene.add(sprite2Text);
        sprite2Text.position.copy(sprite2.position).add(new THREE.Vector3(0, 2, 0));

        const material3 = new THREE.SpriteMaterial();
        const sprite3 = new THREE.Sprite(material3);
        sprite3.scale.set(100, 100, 1);
        sprite3.position.set(window.innerWidth / 2 - 60, 325, 0);
        sprite3.name = "MoreFloors";

        this.buttons.push(sprite3);
        sprite3.position.set((window.innerWidth / 2) - 60, 325, 0);
        scene.add(sprite3);
        const canvas3 = document.createElement('canvas');
        const context3 = canvas3.getContext('2d');
        context3.font = 'Bold 140px "Press Start 2P"';
        context3.fillStyle = 'black';
        context3.fillText('+', 90, 150);
        

        const texture3 = new THREE.CanvasTexture(canvas3);
        const material3Text = new THREE.SpriteMaterial({ map: texture3 });
        const sprite3Text = new THREE.Sprite(material3Text);
        sprite3Text.scale.set(100, 100, 1);
        sprite3Text.name = "boo";
        scene.add(sprite3Text);
        sprite3Text.position.copy(sprite3.position).add(new THREE.Vector3(0, 2, 0));

        const material5 = new THREE.SpriteMaterial();
        const sprite5 = new THREE.Sprite(material5);
        sprite5.scale.set(100, 100, 1);
        sprite5.position.set(window.innerWidth / 2 - 60, 225, 0);
        sprite5.name = "HowManyFloors";

        //this.buttons.push(sprite5);
        sprite5.position.set((window.innerWidth / 2) - 60, 225, 0);
        scene.add(sprite5);
        const canvas5 = document.createElement('canvas');
        const context5 = canvas5.getContext('2d');
        context5.font = 'Bold 100px "Press Start 2P"';
        context5.fillStyle = 'black';
        context5.fillText('1', 90, 150);

        const texture5 = new THREE.CanvasTexture(canvas5);
        const material5Text = new THREE.SpriteMaterial({ map: texture5 });
        
        this.levelsText= new THREE.Sprite(material5Text);
        //context5 = sprite5Text;
        this.levelsText.scale.set(100, 100, 1);
        this.levelsText.name = "AmountOfLevelsText";
        
        scene.add(this.levelsText);
        this.levelsText.position.copy(sprite5.position).add(new THREE.Vector3(0, 2, 0));
        


        const material4 = new THREE.SpriteMaterial();
        const sprite4 = new THREE.Sprite(material4);
        sprite4.scale.set(200, 50, 1);
       // sprite4.position.set(window.innerWidth / 2 - 60, 375, 0);
        sprite4.name = "Resume";
        this.buttons.push(sprite4);
        scene.add(sprite4);
        
        const canvas4 = document.createElement('canvas');
        const context4 = canvas4.getContext('2d');
        context4.font = 'Bold 40px "Press Start 2P"';
        context4.fillStyle = 'black';
        context4.fillText('Resume', 20,100);

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
     //   console.log("EHFWHEIF");
        this.main.resetGame();
    }
    lessFloorsButton()
    {
        if(this.main.amountOfFloors > 1)
        {
        this.main.amountOfFloors -=1;
        var newValue = this.main.amountOfFloors;
        console.log("amount of levels reduced by 1");
         this.updateText(this.levelsText, newValue.toString());
        }
    }
    MoreFloorsButton()
    {
        if(this.main.amountOfFloors < 10)
        {
            this.main.amountOfFloors += 1;
            var newValue = this.main.amountOfFloors;
            console.log("amount of levels increased by 1");
          this.updateText(this.levelsText, newValue.toString());
        }
    }
    updateText(sprite, newText)
    {
        const canvas = sprite.material.map.image;
       const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillText(newText, 90, 150);
        const newTexture = new THREE.CanvasTexture(canvas);
        sprite.material.map = newTexture;

        sprite.material.map.needsUpdate = true;
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