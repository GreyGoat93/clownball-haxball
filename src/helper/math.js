const getAngleBetweenTwoDiscs = (disc1, disc2) => {
    return Math.atan2(disc1.y - disc2.y, disc1.x - disc2.x) * 180 / Math.PI;
}

const drawLineByAngleAndLength = (point, angle, length) => {
    const x = point.x + (length * Math.cos(angle * Math.PI / 180))
    const y = point.y + (length * Math.sin(angle * Math.PI / 180))
    return {x, y};
}

const drawTriangleByPointAndAngle = (point, angle, length) => {
    const secondPoint = drawLineByAngleAndLength(point, angle - 20, length);
    const thirdPoint = drawLineByAngleAndLength(point, angle + 20, length);
    return {first: point, second: secondPoint, third: thirdPoint};
}

const distanceBetweenDiscs = (disc1, disc2, disc1Radius = 15, disc2Radius = 15) => {
    return Math.sqrt(Math.pow(disc2.x - disc1.x, 2) + Math.pow(disc2.y - disc1.y, 2)) - (disc2Radius + disc1Radius);
}

const sign = (p1, p2, p3) => {
    return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
}

const checkIfInTriangle = (point, v1, v2, v3) => {
    const d1 = sign(point, v1, v2)
    const d2 = sign(point, v2, v3)
    const d3 = sign(point, v3, v1)
    const hasNeg = (d1 < 0) || (d2 < 0) || (d3 < 0);
    const hasPos = (d1 > 0) || (d2 > 0) || (d3 > 0);
    return !(hasNeg && hasPos);
}

export {
    getAngleBetweenTwoDiscs,
    drawLineByAngleAndLength,
    drawTriangleByPointAndAngle,
    distanceBetweenDiscs,
    checkIfInTriangle,
}