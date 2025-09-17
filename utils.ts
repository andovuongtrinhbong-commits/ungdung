import { BrushShape } from './types';

export const drawMaskShapeOnContext = (
    ctx: CanvasRenderingContext2D,
    centerPoint: { x: number, y: number },
    size: number,
    shape: BrushShape,
    roughness: number
) => {
    if (shape === 'edge') {
        const numVertices = Math.max(3, roughness); // Use roughness as number of edges, min 3
        const radius = size / 2;
        ctx.beginPath();
        for (let i = 0; i < numVertices; i++) {
            const angle = (i / numVertices) * Math.PI * 2;
            const randomizedRadius = radius * (0.6 + Math.random() * 0.4);
            const vx = centerPoint.x + Math.cos(angle) * randomizedRadius;
            const vy = centerPoint.y + Math.sin(angle) * randomizedRadius;
            if (i === 0) ctx.moveTo(vx, vy);
            else ctx.lineTo(vx, vy);
        }
        ctx.closePath();
        ctx.fill();
    } else if (roughness > 0) { // rough circle/square
        const numDabs = 5 + Math.floor(roughness / 5);
        const scatterRadius = size / 2 * (roughness / 100);
        for (let i = 0; i < numDabs; i++) {
            const dabSize = size / 4 + (size / 4 * Math.random());
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.pow(Math.random(), 0.5) * scatterRadius;
            const x = centerPoint.x + Math.cos(angle) * radius;
            const y = centerPoint.y + Math.sin(angle) * radius;
            ctx.beginPath();
            ctx.arc(x, y, dabSize / 2, 0, Math.PI * 2);
            ctx.fill();
        }
    } else { // normal circle/square
        if (shape === 'circle') {
            ctx.beginPath();
            ctx.arc(centerPoint.x, centerPoint.y, size / 2, 0, Math.PI * 2);
            ctx.fill();
        } else { // square
            const offsetX = centerPoint.x - size / 2;
            const offsetY = centerPoint.y - size / 2;
            ctx.fillRect(offsetX, offsetY, size, size);
        }
    }
};
