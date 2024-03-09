import { _decorator, Component, Node, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

export function makeSmoothCurve(arrayToCurve: Vec3[], smoothness: number = 5): Vec3[] {
    if (smoothness < 1.0)
        smoothness = 1.0;

    const pointsLength = arrayToCurve.length;

    const curvedLength = (pointsLength * Math.round(smoothness)) - 1;
    const curvedPoints: Vec3[] = [];

    for (let pointInTimeOnCurve = 0; pointInTimeOnCurve < curvedLength + 1; pointInTimeOnCurve++) {
        const t = inverseLerp(0, curvedLength, pointInTimeOnCurve);

        const points: Vec3[] = [...arrayToCurve];

        for (let j = pointsLength - 1; j > 0; j--) {
            for (let i = 0; i < j; i++) {
                points[i] = points[i].clone().multiplyScalar(1 - t).add(points[i + 1].clone().multiplyScalar(t));
            }
        }

        curvedPoints.push(points[0]);
    }
    return curvedPoints;
}

export function inverseLerp(a: number, b: number, value: number): number {
    return a !== b ? clamp01((value - a) / (b - a)) : 0.0;
}

function clamp01(value: number): number {
    return Math.min(Math.max(value, 0), 1);
}