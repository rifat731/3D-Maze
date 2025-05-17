import * as THREE from 'three';

export class MazeGenerator {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.cellSize = 5;
        this.wallHeight = 5;
        this.wallThickness = 0.5;
        this.maze = Array(height).fill().map(() => Array(width).fill(1));
        this.visited = Array(height).fill().map(() => Array(width).fill(false));
        this.specialRooms = [];
        this.roomSizes = Math.floor(width/5);
        this.generateStartAndEnd();
    }

    generateStartAndEnd() {
        const safeDistance = 2;
        
        this.startPos = {
            x: safeDistance + Math.floor(Math.random() * (this.width - 2 * safeDistance)),
            y: safeDistance + Math.floor(Math.random() * (this.height - 2 * safeDistance))
        };

        let maxDistance = 0;
        let bestEndPos = null;

        for (let i = 0; i < 20; i++) {
            const testEndPos = {
                x: safeDistance + Math.floor(Math.random() * (this.width - 2 * safeDistance)),
                y: safeDistance + Math.floor(Math.random() * (this.height - 2 * safeDistance))
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

        this.clearArea(this.startPos.x, this.startPos.y, 1);
        this.clearArea(this.endPos.x, this.endPos.y, 1);
  
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
        this.initializeMaze();
       

         //this.generateMaze(this.startPos.x, this.startPos.y);
      var safeDistance = 2;
        this.generateMaze(this.startPos.x, this.startPos.y);

        for (let e = 0; e < this.specialRooms.length; e++) {

            this.ensureRoomReachable(this.specialRooms[e]);
        }
        this.ensureEndReachable();
      // this.generateMaze(this.startPos.x, this.startPos.y);

        return this.createMazeGeometry();
    }

    initializeMaze() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.maze[y][x] = 1;
                this.visited[y][x] = false;
            }
        }

        this.clearArea(this.startPos.x, this.startPos.y, 1);
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
            const directions = [[0,1], [1,0], [0,-1], [-1,0]];
            
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
        if(this.specialRooms.indexOf(doorPos)+1 != this.specialRooms.length)
        {
            aimedPosition = this.specialRooms[this.specialRooms.indexOf(doorPos) +1];
        }
        else
        {
            aimedPosition = this.startPos;
        }
   //     else {
     //       aimedPosition = (this.specialRooms[this.specialRooms.indexOf(doorPos) - 1].x, this.specialRooms[this.specialRooms.indexOf(doorPos)-1].y);
     //   }
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
            const {x, y} = path[path.length - 1];
            
            if (x === end.x && y === end.y) {
                return path;
            }
            
            const directions = [[0,1], [1,0], [0,-1], [-1,0]];
            for (const [dx, dy] of directions) {
                const newX = x + dx;
                const newY = y + dy;
                const key = `${newX},${newY}`;
                
                if (this.isValid(newX, newY) && !visited.has(key)) {
                    visited.add(key);
                    const newPath = [...path, {x: newX, y: newY}];
                    queue.push(newPath);
                }
            }
        }
        
        return null;
    }

    isValid(x, y) {
        return x > 0 && x < this.width - 1 && y > 0 && y < this.height - 1;
    }

    createMazeGeometry() {
        const group = new THREE.Group();

        const floorGeometry = new THREE.PlaneGeometry(
            this.width * this.cellSize,
            this.height * this.cellSize
        );
        const floorMaterial = new THREE.MeshStandardMaterial({
            color: 0x2E4053,
            roughness: 0.9,
            metalness: 0.1
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.set(
            (this.width * this.cellSize) / 2 - this.cellSize / 2,
            0,
            (this.height * this.cellSize) / 2 - this.cellSize / 2
        );
        group.add(floor);

        const wallMaterial = new THREE.MeshStandardMaterial({
            color: 0xD5DBDB,
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

        const walls = new THREE.Group();
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.maze[y][x] === 1) {
                    const wallGeometry = new THREE.BoxGeometry(
                        this.cellSize,
                        this.wallHeight,
                        this.cellSize
                    );
                    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
                    wall.position.set(
                        x * this.cellSize,
                        this.wallHeight / 2,
                        y * this.cellSize
                    );
                    walls.add(wall);

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

                    const leftWall = new THREE.Mesh(sideGeometry, wallMaterial);
                    leftWall.position.set(
                        x * this.cellSize - this.cellSize/2 + this.wallThickness/2,
                        this.wallHeight / 2,
                        y * this.cellSize
                    );
                    walls.add(leftWall);

                    const rightWall = new THREE.Mesh(sideGeometry, wallMaterial);
                    rightWall.position.set(
                        x * this.cellSize + this.cellSize/2 - this.wallThickness/2,
                        this.wallHeight / 2,
                        y * this.cellSize
                    );
                    walls.add(rightWall);

                    const frontWall = new THREE.Mesh(frontGeometry, wallMaterial);
                    frontWall.position.set(
                        x * this.cellSize,
                        this.wallHeight / 2,
                        y * this.cellSize - this.cellSize/2 + this.wallThickness/2
                    );
                    walls.add(frontWall);

                    const backWall = new THREE.Mesh(frontGeometry, wallMaterial);
                    backWall.position.set(
                        x * this.cellSize,
                        this.wallHeight / 2,
                        y * this.cellSize + this.cellSize/2 - this.wallThickness/2
                    );
                    walls.add(backWall);
                } else if (x === this.startPos.x && y === this.startPos.y) {
                    const startMarker = new THREE.Mesh(
                        new THREE.BoxGeometry(this.cellSize, 0.1, this.cellSize),
                        startMaterial
                    );
                    startMarker.position.set(
                        x * this.cellSize,
                        0.05,
                        y * this.cellSize
                    );
                    group.add(startMarker);
                } else if (x === this.endPos.x && y === this.endPos.y) {
                    const endMarker = new THREE.Mesh(
                        new THREE.BoxGeometry(this.cellSize, 0.1, this.cellSize),
                        endMaterial
                    );
                    endMarker.position.set(
                        x * this.cellSize,
                        0.05,
                        y * this.cellSize
                    );
                    group.add(endMarker);
                }
            }
        }
        group.add(walls);

        return group;
    }

    getStartAndEnd() {
        return {
            start: {
                x: this.startPos.x * this.cellSize,
                y: 1,
                z: this.startPos.y * this.cellSize
            },
            end: {
                x: this.endPos.x * this.cellSize,
                y: 0,
                z: this.endPos.y * this.cellSize
            }
        };
    }
} 