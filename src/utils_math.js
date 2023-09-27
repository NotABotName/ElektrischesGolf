// Physics Functions
export function calculateUnitVector(vector) {
    const magnitude = Math.sqrt(vector.x ** 2 + vector.y ** 2);
    const ux = vector.x / magnitude;
    const uy = vector.y / magnitude;
    return { x: ux, y: uy };
}

export function calculateElectricForceVector(objectA, objectB) {
    // Coulomb's constant
    const k = 8.99e9;
    
    // Calculate the displacement vector from object B to object A
    const displacementX = objectA.x - objectB.x;
    const displacementY = objectA.y - objectB.y;

    // Calculate the distance between the two objects
    const distance = Math.sqrt(displacementX ** 2 + displacementY ** 2);

    // Calculate the electric field magnitude due to object B
    const electricFieldMagnitude = (k * objectB.charge) / (distance ** 2);

    // Calculate the electric field vector components
    const electricFieldX = electricFieldMagnitude * (displacementX / distance);
    const electricFieldY = electricFieldMagnitude * (displacementY / distance);

    // Calculate the electric force vector on object A
    const electricForceX = objectA.charge * electricFieldX;
    const electricForceY = objectA.charge * electricFieldY;

    // Return the electric force vector
    return { x: electricForceX, y: electricForceY };
}