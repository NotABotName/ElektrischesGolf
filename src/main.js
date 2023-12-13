// Import Shapes
import {
    drawCircle,
    drawRectangle,
    drawLine,
    drawArrow,
} from './utils_canvas.js';

// Import Math / Physics Functions
import {
    calculateUnitVector,
    calculateElectricForceVector,
    clamp,
    circleRectCollision
} from './utils_math.js';

// Runtime variables
var loop = false
var gameOver = false
var gameWon = false; 

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Get references to the buttons using their IDs
const playButton = document.getElementById('playBtn');
const stopButton = document.getElementById('stopBtn');
const restartButton = document.getElementById('restartBtn');

// Add event listeners to the buttons
playButton.addEventListener('click', () => {
    loop = true
});

stopButton.addEventListener('click', () => {
    loop = false
});

restartButton.addEventListener('click', () => {
    if(gameOver) return;
    resetGameState()
});

// Display overlay based on game state
const overlay = document.getElementById('overlay');
const resultText = document.getElementById('resultText');
const retryBtn = document.getElementById('retryBtn');
const nextBtn = document.getElementById('nextBtn');

function updateGameOverScreen() {
    if (!gameOver) {
        overlay.style.display = 'none';
        return
    } else {
        overlay.style.display = 'flex';
    }

    if (gameWon) {
        resultText.innerText = 'Game Won!';
        retryBtn.style.display = 'none';
        nextBtn.style.display = 'block';
    } else {
        resultText.innerText = 'Game Lost';
        retryBtn.style.display = 'block';
        nextBtn.style.display = 'none';
    }
}
updateGameOverScreen()

retryBtn.addEventListener('click', () => {
    if(!gameOver) return;
    resetGameState()
    loop = false
    gameOver = false
    updateGameOverScreen()
    gameLoop()
});

nextBtn.addEventListener('click', () => {
    if(!gameOver) return;
    resetGameState()
    loop = false
    gameOver = false
    updateGameOverScreen()
    gameLoop()
});

// Game Objects

class GameObject {
    constructor(name, x, y, enabled, charge, mass) {
        // Metadata
        this.name = name;

        // Position
        this.x = x
        this.y = y

        // Utils
        this.CombinedVector = {x:0, y:0}
        this.radius = 10 // for collision detection

        // Physics
        this.enabled = enabled
        this.charge = charge 
        this.mass = mass
        this.velocity = {x: 0, y: 0}

        this.mouseMoveable = true

        this.vectors = []
    }

    drawObject(ctx) {
    }

    moveObject(force, time, maxAcceleration) {
        // Calculate unclamped acceleration
        const acceleration = {
            x: force.x / this.mass,
            y: force.y / this.mass
        };
    
        // Calculate the magnitude of the acceleration
        const accelerationMagnitude = Math.sqrt(acceleration.x ** 2 + acceleration.y ** 2);
    
        // Check if the magnitude exceeds the maximum acceleration
        if (accelerationMagnitude > maxAcceleration) {
            // Scale down the acceleration to the maximum acceleration
            const scale = maxAcceleration / accelerationMagnitude;
            acceleration.x *= scale;
            acceleration.y *= scale;
        }
    
        // Update velocity using clamped acceleration
        this.velocity.x += 0.5 * acceleration.x * time * time;
        this.velocity.y += 0.5 * acceleration.y * time * time;
    
        // Calculate new position based on the updated velocity
        this.x += this.velocity.x * time;
        this.y += this.velocity.y * time;
    }
}

class Positive extends GameObject {
    drawObject(ctx) {
        drawCircle(ctx, this.x, this.y, this.radius, "red");
    }
}

class Negative extends GameObject {
    drawObject(ctx) {
        drawCircle(ctx, this.x, this.y, this.radius, "blue");
    }
}

class Collider extends GameObject {
    constructor(name, x, y, enabled, charge, mass, width, height) {
        super(name, x, y, enabled, charge, mass);

        this.mouseMoveable = false

        this.width = width;
        this.height = height;
    }

    drawObject(ctx) {
        drawRectangle(ctx, this.x, this.y, this.width, this.height, 'black');
    }
}

class Goal extends GameObject {
    constructor(name, x, y, enabled, charge, mass, width, height) {
        super(name, x, y, enabled, charge, mass);

        this.mouseMoveable = false

        this.width = width;
        this.height = height;
    }

    drawObject(ctx) {
        drawRectangle(ctx, this.x, this.y, this.width, this.height, 'green');
    }
}

// Change Game States
function callGameLost() {
    loop = false;
    gameOver = true;
    gameWon = false;
    updateGameOverScreen()
}

function callGameWon() {
    loop = false;
    gameOver = true;
    gameWon = true;
    updateGameOverScreen()
}

var gameObjects = [];

function initializeGameState() {
    
    const Positive1 = new Positive('Positive main', 100, 300, true, 1, 25)

    const Collider1 = new Collider('Collider 1', 200, 150, false, 0, 0, 25, 100)
    const Collider2 = new Collider('Collider 1', 400, 250, false, 0, 0, 25, 100)
    const Collider3 = new Collider('Collider 2', 600, 350, false, 0, 0, 25, 100)

    const Goal1 = new Goal('Goal 1', 700, 250, false, 0, 0, 25, 100)
    
    const Negative1 = new Negative('Negative 1', 500, 100, false, -1, 1)
    const Negative2 = new Negative('Negative 2', 200, 300, false, -1, 1)
    const Negative3 = new Negative('Negative 3', 300, 200, false, -1, 1)
    const Negative4 = new Negative('Negative 4', 400, 300, false, -1, 1)
    const Negative5 = new Negative('Negative 5', 500, 500, false, -1, 1)
    const Negative6 = new Negative('Negative 6', 400, 400, false, -1, 1)

    gameObjects = []

    gameObjects.push(Positive1, Negative2, Negative1, Negative3, Negative4, Negative6, Negative5, Collider1, Collider2, Collider3, Goal1)

    // Bounds
    const Bound1 = new Collider('Collider 1', 0, 0, false, 0, 0, 5, 600)
    const Bound2 = new Collider('Collider 2', 800-5, 0, false, 0, 0, 5, 600)
    const Bound3 = new Collider('Collider 3', 0, 0, false, 0, 0, 800, 5)
    const Bound4 = new Collider('Collider 3', 0, 600-5, false, 0, 0, 800, 5)


    gameObjects.push(Bound1,Bound2, Bound3, Bound4)
}
initializeGameState()

function resetGameState() {
    gameObjects = gameObjects.filter(object => !(object instanceof Positive));

    const Positive1 = new Positive('Positive main', 100, 300, true, 1, 25)
    
    gameObjects.push(Positive1);
}

console.log('game objects: ', gameObjects)

// Move Game Objects
canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('mouseup', handleMouseUp);

canvas.addEventListener('touchstart', handleTouchStart);
canvas.addEventListener('touchmove', handleTouchMove);
canvas.addEventListener('touchend', handleTouchEnd);

let selectedObject = null;
let offset = { x: 0, y: 0 };

function handleMouseDown(event) {
    console.log('MouseDown')
    const mouseX = event.clientX - canvas.getBoundingClientRect().left;
    const mouseY = event.clientY - canvas.getBoundingClientRect().top;

    // Check if any game object is clicked
    selectedObject = gameObjects.find(object => {
        if (object.enabled || !object.mouseMoveable) return
        const distance = Math.sqrt((mouseX - object.x) ** 2 + (mouseY - object.y) ** 2);
        return distance <= object.radius;
    });

    if (selectedObject) {
        offset.x = selectedObject.x - mouseX;
        offset.y = selectedObject.y - mouseY;
    }
}

function handleMouseMove(event) {
    if (selectedObject) {
        const mouseX = event.clientX - canvas.getBoundingClientRect().left;
        const mouseY = event.clientY - canvas.getBoundingClientRect().top;

        // Update the selected object's position based on the mouse position and offset
        selectedObject.x = mouseX + offset.x;
        selectedObject.y = mouseY + offset.y;
    }
}

function handleMouseUp() {
    selectedObject = null;
}

function handleTouchStart(event) {
    console.log('TouchStart')
    event.preventDefault();
    const touch = event.touches[0];
    handleMouseDown(touch);
}

function handleTouchMove(event) {
    event.preventDefault();

    const touch = event.touches[0];
    handleMouseMove(touch);
}

function handleTouchEnd(event) {
    event.preventDefault();
    handleMouseUp();
}

// Collision
function checkForCollision(gameObjects, staticObjects) {
    var collisionDetected = false;

    gameObjects.forEach(object => {
        if (object.enabled) {
            staticObjects.forEach(collider => {
                if (circleRectCollision(object, collider)) {
                    collisionDetected = true;
                }
            });
        }
    });

    return collisionDetected;
}

// Main Game Loop
let lastUpdate = Date.now();

function calculateMovementEndPosition(mass, position, velocity, force, time) {
    const maxAcceleration = 50; // You need to define maxAcceleration

    // Calculate unclamped acceleration
    const acceleration = {
        x: force.x / mass,
        y: force.y / mass
    };

    // Calculate the magnitude of the acceleration
    const accelerationMagnitude = Math.sqrt(acceleration.x ** 2 + acceleration.y ** 2);

    // Check if the magnitude exceeds the maximum acceleration
    if (accelerationMagnitude > maxAcceleration) {
        // Scale down the acceleration to the maximum acceleration
        const scale = maxAcceleration / accelerationMagnitude;
        acceleration.x *= scale;
        acceleration.y *= scale;
    }

    // Calculate new position
    const newPosition = {
        x: position.x + velocity.x + 0.5 * acceleration.x * time * time,
        y: position.y + velocity.y + 0.5 * acceleration.y * time * time
    };

    return newPosition;
}

function updateGameObjects(gameObjects, staticObjects, dt) {

    const colliders = gameObjects.filter(object => object instanceof Collider);
    const goals = gameObjects.filter(object => object instanceof Goal);
    
    gameObjects.forEach(object => {
        if (object.enabled) {
            var objectPosition = {x: object.x, y: object.y}

            for (let time = 0; time <= dt; time += 1) {
                
                const CombinedVector = { x: 0, y: 0 };
                
                // Calculate Vectors for every staticObject
                const vectors = staticObjects.map(staticObject => {
                    const TempNewVector = calculateElectricForceVector(object.charge, objectPosition, staticObject.charge, {x: staticObject.x, y: staticObject.y})
                    return TempNewVector
                });

                object.vectors = vectors.filter(vectors => (vectors.x != 0 || vectors.y != 0))
                
                // Calculate Combined Vector
                vectors.forEach(vector => {
                    CombinedVector.x += vector.x;
                    CombinedVector.y += vector.y;
                });

                object.CombinedVector = CombinedVector
                
                if(loop) {
                    const TempNewPosition = calculateMovementEndPosition(1, objectPosition, {x: 0, y: 0}, { x: CombinedVector.x * -.0000001, y: CombinedVector.y * -.0000001}, 1)
                    // console.log(TempNewPosition)
                    objectPosition = TempNewPosition
                }
            }
            
            object.x = objectPosition.x
            object.y = objectPosition.y
        }
    });

    // First check for collisions with colliders
    if (checkForCollision(gameObjects, colliders)) {
        // Collision with colliders Game Lost
        callGameLost()

        return
    }

    // If no collisions with colliders were found check for collisions with the goal
    if(checkForCollision(gameObjects, goals)) {
        // Collision with Goal Game Won
        callGameWon()
    }
}

function drawGameObjects(ctx, gameObjects, staticObjects) {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw game elements
    gameObjects.forEach(object => {
        object.drawObject(ctx);

        if (object.enabled) {
            object.vectors.forEach(vector => {
                drawArrow(ctx, object.x, object.y, { x: vector.x / 5000, y: vector.y / 5000 }, `${-1 > 0 ? 'red' : 'blue'}`, 5, 15);
            })
            staticObjects.forEach(staticObject => {
                if(staticObject instanceof Negative) {
                    const fieldVector = calculateElectricForceVector(staticObject, object);
                    drawArrow(ctx, object.x, object.y, { x: fieldVector.x / 5000, y: fieldVector.y / 5000 }, `${staticObject.charge > 0 ? 'red' : 'blue'}`, 5, 15);
                }
            });

            drawArrow(ctx, object.x, object.y, { x: object.CombinedVector.x / 5000, y: object.CombinedVector.y / 5000 }, 'orange', 5, 15);
        }
    });
}

function gameLoop() {
    // Check if Game Over
    if(gameOver) return;

    // Get Delta Time DT
    const now = Date.now();
    const dt = now - lastUpdate;
    lastUpdate = now;

    // Update game logic
    var staticObjects = gameObjects.filter(object => !object.enabled);
    
    updateGameObjects(gameObjects, staticObjects, dt);

    // Draw game objects
    drawGameObjects(ctx, gameObjects, staticObjects);

    // Handle Loop
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();