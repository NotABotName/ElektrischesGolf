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
} from './utils_math.js';

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game Objects
const gameObjects = [];

class GameObject {
    constructor(name, x, y, enabled, charge, mass) {
        // Metadata
        this.name = name;

        // Position
        this.x = x
        this.y = y

        // Utils
        this.CombinedVector
        this.radius = 10 // for collision detection

        // Physics
        this.enabled = enabled
        this.charge = charge // Coulombs
        this.mass = mass // kilograms
        this.velocity = {x: 0, y: 0}

        this.mouseMoveable = true
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
        this.velocity.x += acceleration.x * time;
        this.velocity.y += acceleration.y * time;
    
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

const Collider1 = new Collider('Collider', 300, 200, false, 0, 0, 25, 100)

const Positive1 = new Positive('Negative', 100, 300, true, 1, 25)
const Negative1 = new Negative('Positive', 500, 100, false, -1, 1)
const Negative2 = new Negative('Positive', 200, 300, false, -1, 1)
const Negative3 = new Negative('Positive', 300, 200, false, -1, 1)
const Negative4 = new Negative('Positive', 400, 300, false, -1, 1)

gameObjects.push(Positive1, Negative2, Negative1, Negative3, Negative4, Collider1)

// Move Game Objects

// Inside your script after getting the canvas and context
canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('mouseup', handleMouseUp);

canvas.addEventListener('touchstart', handleTouchStart);
canvas.addEventListener('touchmove', handleTouchMove);
canvas.addEventListener('touchend', handleTouchEnd);

let selectedObject = null;
let offset = { x: 0, y: 0 }; // Offset between mouse/touch position and object center

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

// Should Loop Variable
var loop = true

// Collision

function checkForCollision(ctx, gameObjects, staticObjects) {
    const colliders = []
    gameObjects.forEach(object => {
        if (object.enabled) {
            colliders.forEach(collider => {
            })
        }
    });

    return false
}

// Main Game Loop
let lastUpdate = Date.now();

function updateGameObjects(gameObjects, staticObjects, dt) {
    
    gameObjects.forEach(object => {
        if (object.enabled) {
            const CombinedVector = { x: 0, y: 0 };
            
            // Calculate Vectors for every staticObject
            const vectors = staticObjects.map(staticObject => {
                return calculateElectricForceVector(staticObject, object);
            });
            
            // Calculate Combined Vector
            vectors.forEach(vector => {
                CombinedVector.x += vector.x;
                CombinedVector.y += vector.y;
            });
            
            object.CombinedVector = CombinedVector
            
            object.moveObject({ x: CombinedVector.x * -0.000000001, y: CombinedVector.y * -0.00000001 }, dt, 0.025);
        }
    });

    if (checkForCollision(ctx, gameObjects, staticObjects)) {
        loop = false;
    }
}

function drawGameObjects(ctx, gameObjects, staticObjects) {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw game elements
    gameObjects.forEach(object => {
        object.drawObject(ctx);

        if (object.enabled) {
            staticObjects.forEach(staticObject => {
                const fieldVector = calculateElectricForceVector(staticObject, object);
                drawArrow(ctx, object.x, object.y, { x: fieldVector.x / 5000, y: fieldVector.y / 5000 }, `${staticObject.charge > 0 ? 'red' : 'blue'}`, 5, 15);
            });

            drawArrow(ctx, object.x, object.y, { x: object.CombinedVector.x / 5000, y: object.CombinedVector.y / 5000 }, 'orange', 5, 15);
        }
    });
}

function gameLoop() {

    // Check if should loop
    if (!loop) return;

    // Get Delta Time DT
    const now = Date.now();
    const dt = now - lastUpdate;
    lastUpdate = now;

    // Update game logic
    var staticObjects = gameObjects.filter(object => !object.enabled);
    staticObjects = staticObjects.filter(object => !(object instanceof Collider));
    updateGameObjects(gameObjects, staticObjects, dt);

    // Draw game objects
    drawGameObjects(ctx, gameObjects, staticObjects);

    // Handle Loop
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();