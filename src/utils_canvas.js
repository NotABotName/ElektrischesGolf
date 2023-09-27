// Basic Shapes
export function drawCircle(ctx, x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

export function drawRectangle(ctx, x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

export function drawLine(ctx, x1, y1, x2, y2, color, lineWidth) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    ctx.closePath();
}

export function drawArrow(ctx, x1, y1, vector, color, lineWidth, arrowSize) {
    const x2 = x1 - vector.x;
    const y2 = y1 - vector.y;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    ctx.closePath();

    // Calculate arrowhead points
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const x3 = x2 - arrowSize * Math.cos(angle - Math.PI / 6);
    const y3 = y2 - arrowSize * Math.sin(angle - Math.PI / 6);
    const x4 = x2 - arrowSize * Math.cos(angle + Math.PI / 6);
    const y4 = y2 - arrowSize * Math.sin(angle + Math.PI / 6);

    // Draw arrowhead
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x4, y4);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}