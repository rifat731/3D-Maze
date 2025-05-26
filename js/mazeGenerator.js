

import * as THREE from 'three';

export class MazeGenerator {
    constructor(width, height, scene) {
        this.width = width;
        this.height = height;
        this.cellSize = 5;
        this.wallHeight = 10;
        this.wallThickness = 0.5;
        this.maze = Array(height).fill().map(() => Array(width).fill(1));
        this.visited = Array(height).fill().map(() => Array(width).fill(false));
        this.specialRooms = [];
        this.mazeLevels = [];
        this.amountOfLevels =5;
        this.roomSizes = Math.floor(height/4);
        this.canGoUp = true;
        this.scene = scene;
        this.starts = [];
        this.ends = [];
        this.generateStartAndEnd();
    }

    generateStartAndEnd() {
        const safeDistance = 2;
        
        this.startPos = {
            x: safeDistance + Math.floor(Math.random() * (this.width - 2 * safeDistance)),
            y: safeDistance + Math.floor(Math.random() * (this.height - 2 * safeDistance)),
            z:1
        };
        this.starts.push({
            x: this.startPos.x,
            y: this.startPos.y,
            z: 1
});
        let maxDistance = 0;
        var bestEndPos = null;

        for (let i = 0; i < 20; i++) {
            const testEndPos = {
                x: safeDistance + Math.floor(Math.random() * (this.width - 2 * safeDistance)),
                y: safeDistance + Math.floor(Math.random() * (this.height - 2 * safeDistance)),
                z:1
            };

            const distance = Math.sqrt(
                Math.pow(testEndPos.x - this.startPos.x, 2) +
                Math.pow(testEndPos.y - this.startPos.y, 2)
            );

            if (distance > maxDistance) {
                maxDistance = distance;
                bestEndPos = testEndPos;
            }
        }

        this.endPos = bestEndPos;
        this.ends.push(bestEndPos);
        

        this.clearArea(this.startPos.x, this.startPos.y, 1);
        this.clearArea(this.endPos.x, this.endPos.y, 1);
  
    }

    generateStartEndAfterFirstLevel()
    {
        const safeDistance = 2;
        var tempStartPos = 
        {
            x: this.ends[this.ends.length - 1].x,
            y: this.ends[this.ends.length - 1].y,
            z: this.ends[this.ends.length - 1].z 
        };

        this.starts.push(
            {x: tempStartPos.x,
            y: tempStartPos.y,
            z: tempStartPos.z
    });
        let maxDistance = 0;
        let bestEndPos = null;

        for (let i = 0; i < 20; i++) {
            const testEndPos = {
                x: safeDistance + Math.floor(Math.random() * (this.width - 2 * safeDistance)),
                y: safeDistance + Math.floor(Math.random() * (this.height - 2 * safeDistance)),
                z: this.wallHeight * (this.mazeLevels.length - 1) 
            };

            const distance = Math.sqrt(
                Math.pow(testEndPos.x - this.starts[this.starts.length - 1].x, 2) +
                Math.pow(testEndPos.y - this.starts[this.starts.length - 1].y, 2)
            );

            if (distance > maxDistance) {
                maxDistance = distance;
                bestEndPos = testEndPos;
            }
        }

        this.endPos = bestEndPos;
        this.ends.push(bestEndPos);
        //this.startPos = this.starts[this.starts.length - 1];

        this.clearArea(this.startPos.x, this.startPos.y, 1);
        this.clearArea(this.endPos.x, this.endPos.y, 1);

        this.clearArea(this.startPos.x, this.startPos.y, 2);
        this.clearArea(this.endPos.x, this.endPos.y, 2);
    }

    clearArea(centerX, centerY, radius) {
        for (let y = centerY - radius; y <= centerY + radius; y++) {
            for (let x = centerX - radius; x <= centerX + radius; x++) {
                if (this.isValid(x, y)) {
                    this.maze[y][x] = 0;
                    this.visited[y][x] = true;
                
                }
                
                if(this.isValid(y,x+1) && x > centerX + radius)
                {
                    this.visited[y][x+1] = true;
                    if (y > centerY + radius)
                    {
                        this.visited[y+1][x + 1] = true;
                    }
                    else if(y==0)
                    {
                        this.visited[y -1][x + 1] = true;
                    }
                }
                if (this.isValid(y, x - 1) && x == 0) {
                    this.visited[y][x - 1] = true;
                    if (y > centerY + radius) {
                        this.visited[y + 1][x - 1] = true;
                    }
                    else if (y == 0) {
                        this.visited[y - 1][x - 1] = true;
                        }
                    }
                if (this.isValid(y+1, x  ) && y > centerY + radius) {
                    this.visited[y+1][x  ] = true;
                    if(x > centerX + radius)
                    {
                        this.visited[y + 1][x + 1] = true;
                    }
                    else if (x == 0) {
                        this.visited[y + 1][x - 1] = true;
                        }
                        }
                if (this.isValid(y-1, x ) && y == 0) {
                    this.visited[y-1][x ] = true;
                    if(x > centerX + radius)
                    {
                        this.visited[y -1 ][x + 1] = true;
                    }
                    else if (x == 0) {
                        this.visited[y - 1][x - 1] = true;
                    }
                            }
            }
        }
    }

    hasSpotBeenVisited(centerX, centerY, radius)
    {
        for (let y = centerY - radius; y <= centerY + radius; y++) {
            for (let x = centerX - radius; x <= centerX + radius; x++) {
                if(this.visited[y][x] == true)
                {
                    return true;
                }
            }
        }
        return false;
    }

    generate() {
        for(let i = 0; i < this.amountOfLevels; i++)
        {
            this.maze.length = 0;
            this.visited.length = 0;
            this.visited = [];
            this.specialRooms = [];
            this.maze = new Array(this.height).fill().map(() => Array(this.width).fill(1));
            this.visited = new Array(this.height).fill().map(() => Array(this.width).fill(false));
            if(i > 0)
            {
                this.generateStartEndAfterFirstLevel();
            }
            
        
        this.initializeMaze();
        this.generateMaze(this.starts[this.starts.length - 1].x, this.starts[this.starts.length - 1].y);

        for (let e = 0; e < this.specialRooms.length; e++) {

            this.ensureRoomReachable(this.specialRooms[e]);
        }
        this.ensureEndReachable();
        this.mazeLevels.push(this.createMazeGeometry());

        }
        return this.mazeLevels[0];
        
    
    }

    initializeMaze() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.maze[y][x] = 1;
                this.visited[y][x] = false;
            }
        }

        this.clearArea(this.starts[this.starts.length - 1].x, this.starts[this.starts.length - 1].y , 1);
        this.clearArea(this.endPos.x, this.endPos.y, 1);
        var safeDistance = 2;
        for (let i = 0; i < this.roomSizes; i++) {
            const roomPos = {
                x: safeDistance + Math.floor(Math.random() * (this.width - 2 * safeDistance)),
                y: safeDistance + Math.floor(Math.random() * (this.height - 2 * safeDistance))
            };
            if(this.hasSpotBeenVisited(roomPos.x, roomPos.y, 1) == false)
            {
            this.generateRoom(roomPos.x, roomPos.y);
            console.log("Generating room here");
            }
        }
        
    }

    generateMaze(x, y) {
        this.visited[y][x] = true;
        this.maze[y][x] = 0;

        const directions = [
            [0, -1],
            [1, 0],
            [0, 1],
            [-1, 0]
        ];

        for (let i = directions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [directions[i], directions[j]] = [directions[j], directions[i]];
        }

        for (const [dx, dy] of directions) {
            const newX = x + dx * 2;
            const newY = y + dy * 2;

            if (this.isValid(newX, newY) && !this.visited[newY][newX]) {

                if (this.isInRoom(newX, newY)) {
          
                    continue;
                }
     
                this.maze[y + dy][x + dx] = 0;
                this.generateMaze(newX, newY);
            }
        }

        if (Math.random() < 0.3) {
            const availableDirections = directions.filter(([dx, dy]) => {
                const targetX = x + dx * 2;
                const targetY = y + dy * 2;
                return this.isValid(targetX, targetY) && this.maze[targetY][targetX] === 0;
            });

            if (availableDirections.length > 0) {
                const [dx, dy] = availableDirections[Math.floor(Math.random() * availableDirections.length)];
                this.maze[y + dy][x + dx] = 0;
            }
        }
    }
    generateRoom(x,y)
    {
        this.clearArea(x,y, 1);
        //this.maze[x][y] = 0;
        //this.visited[x][y] = true;
        //this.ensureRoomReachable((x,y))
        this.specialRooms.push({x,y});
    }
    isInRoom(x,y)
    {
        return this.specialRooms.some(room =>
            x >= room.x && x < room.x + room.width &&
            y >= room.y && y < room.y + room.height
        );
    }

    ensureEndReachable() {
        const visited = Array(this.height).fill().map(() => Array(this.width).fill(false));

        const hasPath = (x, y) => {
            if (x === this.endPos.x && y === this.endPos.y) return true;
            if (!this.isValid(x, y) || this.maze[y][x] === 1 || visited[y][x]) return false;

            visited[y][x] = true;
            const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];

            for (const [dx, dy] of directions) {
                if (hasPath(x + dx, y + dy)) return true;
            }

            return false;
        };
        if(this.specialRooms.length != 0)
        {
            
            if (!hasPath(this.specialRooms[this.specialRooms.length - 1].x, this.specialRooms[this.specialRooms.length - 1].y)) {
                this.createPathToEnd();
            }
        }
        else
        {
            if (!hasPath(this.startPos.x, this.startPos.y)) {
                this.createPathToEnd();
            }
        }
    }

    ensureRoomReachable(doorPos)
    {
        const visited = Array(this.height).fill().map(() => Array(this.width).fill(false));

        var aimedPosition;
        var randomValue = Math.floor(Math.random(0, this.specialRooms.length - 1));
        if (randomValue == this.specialRooms.indexOf(doorPos) )
        {

            randomValue = Math.floor(Math.random(0, this.specialRooms.length ));
        
        }
        if(this.specialRooms.indexOf(doorPos)+1 != this.specialRooms.length)
        {
            aimedPosition = this.specialRooms[randomValue];
        }
        else
        {
            aimedPosition = this.startPos;
        }
        const hasPath = (x, y) => {
            if (x === this.startPos.x && y === this.startPos.y) return true;
            if (!this.isValid(x, y) || this.maze[y][x] === 1 || visited[y][x]) return false;

            visited[y][x] = true;
            const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];

            for (const [dx, dy] of directions) {
                if (hasPath(x + dx, y + dy)) return true;
            }
            return false;
        };
        if (!hasPath(doorPos.x, doorPos.y)) {
            this.createPathToRoom(doorPos, aimedPosition);
        }

    }

    createPathToEnd() {
        var path = null;

             path = this.findShortestPath(this.startPos, this.endPos);
        
        if (path) {
            for (let i = 0; i < path.length - 1; i++) {
                const current = path[i];
                const next = path[i + 1];
                this.maze[current.y][current.x] = 0;
                this.maze[next.y][next.x] = 0;
                const midX = (current.x + next.x) / 2;
                const midY = (current.y + next.y) / 2;
                if (Number.isInteger(midX) && Number.isInteger(midY)) {
                    this.maze[midY][midX] = 0;
                }
            }
        }
    }

    createPathToRoom(doorPos, aimedPos)
    {
        const path = this.findShortestPath(doorPos, aimedPos);
        if (path) {
            for (let i = 0; i < path.length - 1; i++) {
                const current = path[i];
                const next = path[i + 1];
                this.maze[current.y][current.x] = 0;
                this.maze[next.y][next.x] = 0;
                const midX = (current.x + next.x) / 2;
                const midY = (current.y + next.y) / 2;
                if (Number.isInteger(midX) && Number.isInteger(midY)) {
                    this.maze[midY][midX] = 0;
                }
            }
        }
    }

    findShortestPath(start, end) {
        const queue = [[start]];
        const visited = new Set();

        while (queue.length > 0) {
            const path = queue.shift();
            const { x, y } = path[path.length - 1];

            if (x === end.x && y === end.y) return path;

            const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
            for (const [dx, dy] of directions) {
                const newX = x + dx;
                const newY = y + dy;
                const key = `${newX},${newY}`;

                if (this.isValid(newX, newY) && !visited.has(key)) {
                    visited.add(key);
                    queue.push([...path, { x: newX, y: newY }]);
                }
            }
        }

        return null;
    }

    isValid(x, y) {
        return x > 0 && x < this.width - 1 && y > 0 && y < this.height - 1;
    }

    createMazeGeometry() {
        var group = new THREE.Group();
        var floorMaterial = new THREE.MeshStandardMaterial();
        var e = this.starts[this.starts.length -1];
        if(this.mazeLevels.length > 0)
        {
        const stencilMaterial = new THREE.MeshBasicMaterial({
            colorWrite: false,   
            depthWrite: true,  
            depthTest: true,  
            stencilWrite: true,   
            stencilRef: 1,        
            stencilFunc: THREE.AlwaysStencilFunc, 
            stencilFail: THREE.KeepStencilOp,
            stencilZFail: THREE.KeepStencilOp,
            stencilZPass: THREE.ReplaceStencilOp  
        });

        const stencilBox = new THREE.Mesh(
            new THREE.BoxGeometry(this.cellSize * 3, 0.1, this.cellSize*3),
            stencilMaterial
        );
        stencilBox.position.set(
            e.x * this.cellSize,
            (this.mazeLevels.length * this.wallHeight) - this.wallHeight / 2,
            e.y * this.cellSize
        );
        stencilBox.renderOrder = 0;
        stencilBox.name == "clipBox";
        this.scene.add(stencilBox);
    }
        var textureLoader = new THREE.TextureLoader();
        const floorColor = textureLoader.load('textures/f3.jpg');
        const floorNormal = textureLoader.load('textures/f2.png');
        const floorRoughness = textureLoader.load('textures/roughness.png');
        const floormetalness = textureLoader.load('textures/fc.png');

         floorMaterial = new THREE.MeshStandardMaterial({
            map: floorColor,
            roughnessMap: floorRoughness,
            normalMap: floorNormal,
            roughness: 1.0,
            metalness: 0.5,
            side: THREE.DoubleSide
        });
       


floorMaterial.stencilWrite = true;
floorMaterial.stencilFunc = THREE.NotEqualStencilFunc;
floorMaterial.stencilRef = 1;
floorMaterial.stencilFail = THREE.KeepStencilOp;
floorMaterial.stencilZFail = THREE.KeepStencilOp;
floorMaterial.stencilZPass = THREE.KeepStencilOp;
const floorGeometry = new THREE.PlaneGeometry(
    this.width * this.cellSize,
    this.height * this.cellSize
);
var floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
//floor.side = THREE.DoubleSide;
floor.position.set(
    (this.width * this.cellSize) / 2 - this.cellSize / 2,
    0.01 + (this.mazeLevels.length * this.wallHeight) - this.wallHeight/2,
    (this.height * this.cellSize) / 2 - this.cellSize / 2
);

group.add(floor);


 
const wallTexture = new THREE.TextureLoader().load('textures/wall.png'); // Load the wall texture

const wallMaterial = new THREE.MeshStandardMaterial({
    map: wallTexture, // Use the texture instead of a solid color
    roughness: 0.7,
    metalness: 0.2,
    side: THREE.DoubleSide 
});



        const startMaterial = new THREE.MeshStandardMaterial({
            color: 0x2ECC71,
            roughness: 0.4,
            metalness: 0.6,
            emissive: 0x2ECC71,
            emissiveIntensity: 0.2
        });

        const endMaterial = new THREE.MeshStandardMaterial({
            color: 0xE74C3C,
            roughness: 0.4,
            metalness: 0.6,
            emissive: 0xE74C3C,
            emissiveIntensity: 0.2
        });

        var walls = new THREE.Group();
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.maze[y][x] === 1) {
                    const wallGeometry = new THREE.BoxGeometry(
                        this.cellSize,
                        this.wallHeight,
                        this.cellSize
                    );
                    var wall = new THREE.Mesh(wallGeometry, wallMaterial);
                    wall.position.set(
                        x * this.cellSize,
                        (this.wallHeight * (this.mazeLevels.length )),
                        y * this.cellSize
                    );
                    walls.add(wall);
                    var wall2 = new THREE.Mesh(wallGeometry, wallMaterial);
                    wall2.position.set(
                        x * this.cellSize,
                        (this.wallHeight * (this.mazeLevels.length  )),
                        y * this.cellSize
                    );
                    walls.add(wall2);

                    const sideGeometry = new THREE.BoxGeometry(
                        this.wallThickness,
                        this.wallHeight,
                        this.cellSize
                    );
                    const frontGeometry = new THREE.BoxGeometry(
                        this.cellSize,
                        this.wallHeight,
                        this.wallThickness
                    );

                    var leftWall = new THREE.Mesh(sideGeometry, wallMaterial);
                    leftWall.position.set(
                        x * this.cellSize - this.cellSize/2 + this.wallThickness/2,
                        (this.wallHeight * (this.mazeLevels.length )),
                        y * this.cellSize
                    );
                    walls.add(leftWall);

                    var rightWall = new THREE.Mesh(sideGeometry, wallMaterial);
                    rightWall.position.set(
                        x * this.cellSize + this.cellSize/2 - this.wallThickness/2,
                        (this.wallHeight * (this.mazeLevels.length )),
                        y * this.cellSize
                    );
                    walls.add(rightWall);

                    var frontWall = new THREE.Mesh(frontGeometry, wallMaterial);
                    frontWall.position.set(
                        x * this.cellSize,
                        (this.wallHeight * (this.mazeLevels.length )),
                        y * this.cellSize - this.cellSize/2 + this.wallThickness/2
                    );
                    walls.add(frontWall);

                    var backWall = new THREE.Mesh(frontGeometry, wallMaterial);
                    backWall.position.set(
                        x * this.cellSize,
                        (this.wallHeight * (this.mazeLevels.length )),
                        y * this.cellSize + this.cellSize/2 - this.wallThickness/2
                    );
                    walls.add(backWall);
                } else if (x === this.startPos.x && y === this.startPos.y && this.mazeLevels.length === 1)  {
                    const startMarker = new THREE.Mesh(
                        new THREE.BoxGeometry(this.cellSize, 0.1, this.cellSize),
                        startMaterial
                    );
                    startMarker.position.set(
                        x* this.cellSize,
                        0.03 + ((this.mazeLevels.length - 1) * this.wallHeight) - this.wallHeight / 2,
                        y* this.cellSize
                    );
                    group.add(startMarker);
                } else if (x === this.endPos.x && y === this.endPos.y) {
                    if (this.canGoUp == true && this.mazeLevels.length != this.amountOfLevels - 1)
                    {
                        const wallGeometry = new THREE.BoxGeometry(
                            this.cellSize,
                            this.wallHeight,
                            this.cellSize
                        );
                        const wall = new THREE.Mesh(wallGeometry, wallMaterial);
                        wall.position.set(
                            x * this.cellSize,
                            (this.wallHeight * (this.mazeLevels.length)),
                            y * this.cellSize
                        );
                        wall.scale.set(1,2,1);
                        wall.rotation.set(45,0,0);
                        walls.add(wall);
                    }
                    else
                    {
                    const endMarker = new THREE.Mesh(
                        new THREE.BoxGeometry(this.cellSize, 0.1, this.cellSize),
                        endMaterial
                    );
                    endMarker.position.set(
                        x * this.cellSize,
                        0.03 + ((this.mazeLevels.length) * this.wallHeight) - this.wallHeight / 2,
                        y * this.cellSize
                    );
                        endMarker.name = "endMarker";
                    group.add(endMarker);

                  
                    setTimeout(() => {
                        endMarker.scale.y = 1000;
                        endMarker.position.y = 0.05 + (0.1 * 1000) / 2;
                    }, 10000);
                }
                }
            }
        }
        group.add(walls);
        this.scene.add(group);
        console.log(group);
        return group;
    }

    getStartAndEnd() {
        return {
            start: {
                x: this.startPos.x * this.cellSize,
                y:  -this.wallHeight,
                z: this.startPos.y * this.cellSize
            },
            end: {
                x: this.endPos.x * this.cellSize,
                y: 0.03 + (( this.mazeLevels.length) * this.wallHeight ) - this.wallHeight / 2,
                z: this.endPos.y * this.cellSize
            }
        };
    }
}
