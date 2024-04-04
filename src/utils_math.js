// Physics Functions
export function calculateUnitVector(vector) {
    const magnitude = Math.sqrt(vector.x ** 2 + vector.y ** 2);
    const ux = vector.x / magnitude;
    const uy = vector.y / magnitude;
    return { x: ux, y: uy };
}

export function calculateElectricForceVector(chargeA, positionA, chargeB, positionB) {
    if(positionB === undefined) positionB = {x: 0, y: 0};

    // Coulomb's constant
    const k = 8.99e9;

    // Calculate the displacement vector from object B to object A
    const displacementX = positionA.x - positionB.x;
    const displacementY = positionA.y - positionB.y;

    // Calculate the distance between the two objects
    const distance = Math.sqrt(displacementX ** 2 + displacementY ** 2);

    // Calculate the electric field magnitude due to object B
    var electricFieldMagnitude = (k * chargeB) / (distance ** 2);

    // Adjust the electric field magnitude if the distance is less than 10
    var minimumDistance = 50
    if (distance < minimumDistance) {
        const adjustedMagnitude = (distance / minimumDistance) ** 5;
        electricFieldMagnitude *= adjustedMagnitude;
        
        // Ensure the final value is not less than the threshold
        // electricFieldMagnitude = Math.min(electricFieldMagnitude, - 300000);
        // console.log(electricFieldMagnitude)
    }

    // Calculate the electric field vector components
    const electricFieldX = electricFieldMagnitude * (displacementX / distance);
    const electricFieldY = electricFieldMagnitude * (displacementY / distance);

    // Calculate the electric force vector on object A
    const electricForceX = -chargeA * electricFieldX;
    const electricForceY = -chargeA * electricFieldY;

    // Return the electric force vector
    return { x: electricForceX, y: electricForceY };
}

// Helper function to clamp a value within a range
export function clamp(value, min, max) {
    return Math.max(min, Math.min(value, max));
}

// Helper function to check collision between circle and rectangle
export function circleRectCollision(circle, rect) {
    const circleX = circle.x;
    const circleY = circle.y;
    const circleRadius = circle.radius;

    const rectX = rect.x;
    const rectY = rect.y;
    const rectWidth = rect.width;
    const rectHeight = rect.height;

    const closestX = clamp(circleX, rectX, rectX + rectWidth);
    const closestY = clamp(circleY, rectY, rectY + rectHeight);

    const distanceX = circleX - closestX;
    const distanceY = circleY - closestY;

    const distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);

    return distanceSquared < (circleRadius * circleRadius);
}
