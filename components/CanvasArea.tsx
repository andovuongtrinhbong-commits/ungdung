import React from 'react';
import { Tool } from '../types';

interface CanvasAreaProps {
    mapContainerRef: React.RefObject<HTMLDivElement>;
    backgroundCanvasRef: React.RefObject<HTMLCanvasElement>;
    effectsCanvasRef: React.RefObject<HTMLCanvasElement>;
    foregroundCanvasRef: React.RefObject<HTMLCanvasElement>;
    topLayerCanvasRef: React.RefObject<HTMLCanvasElement>;
    brushTopLayerCanvasRef: React.RefObject<HTMLCanvasElement>;
    gridCanvasRef: React.RefObject<HTMLCanvasElement>;
    canvasSize: { width: number, height: number };
    transform: { scale: number, x: number, y: number };
    renderScale: number;
    selectionBox: { x: number, y: number, width: number, height: number } | null;
    currentTool: Tool;
    onMouseDown: (e: React.MouseEvent) => void;
    onMouseUp: (e: React.MouseEvent) => void;
    onMouseMove: (e: React.MouseEvent) => void;
    onMouseEnter: () => void;
    onMouseLeave: (e: React.MouseEvent) => void;
    onWheel: (e: React.WheelEvent) => void;
}

export const CanvasArea: React.FC<CanvasAreaProps> = ({
    mapContainerRef,
    backgroundCanvasRef,
    effectsCanvasRef,
    foregroundCanvasRef,
    topLayerCanvasRef,
    brushTopLayerCanvasRef,
    gridCanvasRef,
    canvasSize,
    transform,
    renderScale,
    selectionBox,
    currentTool,
    onMouseDown,
    onMouseUp,
    onMouseMove,
    onMouseEnter,
    onMouseLeave,
    onWheel
}) => {
    const { width, height } = canvasSize;

    const mainStyle: React.CSSProperties = {
        position: 'absolute',
        top: 0,
        left: 'calc(60px + var(--sidebar-width))',
        right: 'var(--sidebar-width)',
        bottom: 0,
        transition: 'left 0.3s ease-in-out, right 0.3s ease-in-out',
    };

    return (
        <main
            ref={mapContainerRef}
            style={mainStyle}
            className={`map-container tool-${currentTool}`}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onWheel={onWheel}
        >
            {selectionBox && <div className="selection-box" style={{ left: selectionBox.x, top: selectionBox.y, width: selectionBox.width, height: selectionBox.height }} />}
            <div className="map-content" style={{ width: `${width}px`, height: `${height}px`, transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})` }}>
                <canvas ref={backgroundCanvasRef} width={width * renderScale} height={height * renderScale} className="background-canvas" style={{ width: width, height: height }} />
                <canvas ref={effectsCanvasRef} width={width * renderScale} height={height * renderScale} className="effects-canvas" style={{ width: width, height: height }} />
                <canvas ref={foregroundCanvasRef} width={width * renderScale} height={height * renderScale} className="foreground-canvas" style={{ width: width, height: height }} />
                <canvas ref={topLayerCanvasRef} width={width * renderScale} height={height * renderScale} className="top-layer-canvas" style={{ width: width, height: height }} />
                <canvas ref={brushTopLayerCanvasRef} width={width * renderScale} height={height * renderScale} className="brush-top-layer-canvas" style={{ width: width, height: height }} />
                <canvas ref={gridCanvasRef} width={width * renderScale} height={height * renderScale} className="grid-canvas" style={{ width: width, height: height }} />
            </div>
        </main>
    );
};
