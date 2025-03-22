export class GameUI {
    constructor() {
        this.levelInfo = document.getElementById('level-info');
        this.timer = document.getElementById('timer');
        this.instructions = document.getElementById('instructions');
        this.startTime = Date.now();
        this.currentLevel = 1;
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