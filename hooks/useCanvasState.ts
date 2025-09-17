import { useState, useRef, useCallback } from 'react';
import { MIN_SCALE, MAX_SCALE } from '../constants';

export const useCanvasState = () => {
    const [canvasSize, setCanvasSize] = useState({ width: 512, height: 512 });
    const [inputWidth, setInputWidth] = useState('512');
    const [inputHeight, setInputHeight] = useState('512');
    const [viewportDpi, setViewportDpi] = useState(96);
    const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });

    const mapContainerRef = useRef<HTMLDivElement>(null);
    const backgroundCanvasRef = useRef<HTMLCanvasElement>(null);
    const foregroundCanvasRef = useRef<HTMLCanvasElement>(null);
    const effectsCanvasRef = useRef<HTMLCanvasElement>(null);
    const topLayerCanvasRef = useRef<HTMLCanvasElement>(null); 
    const brushTopLayerCanvasRef = useRef<HTMLCanvasElement>(null);
    const gridCanvasRef = useRef<HTMLCanvasElement>(null);

    const renderScale = viewportDpi / 96;

    const handleApplySize = () => {
        const newWidth = parseInt(inputWidth, 10);
        const newHeight = parseInt(inputHeight, 10);
        if (newWidth > 0 && newHeight > 0) {
            setCanvasSize({ width: newWidth, height: newHeight });
        } else {
            alert("Please enter valid positive numbers for width and height.");
            setInputWidth(String(canvasSize.width));
            setInputHeight(String(canvasSize.height));
        }
    };

    const handleWheel = useCallback((e: React.WheelEvent) => {
      e.preventDefault();
      if (!mapContainerRef.current) return;
      const rect = mapContainerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const zoomFactor = 1.1;
      const newScale = e.deltaY < 0 ? transform.scale * zoomFactor : transform.scale / zoomFactor;
      const clampedScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));
      const newX = mouseX - ((mouseX - transform.x) * clampedScale) / transform.scale;
      const newY = mouseY - ((mouseY - transform.y) * clampedScale) / transform.scale;
      setTransform({ scale: clampedScale, x: newX, y: newY });
    }, [transform]);

    return {
        canvasSize,
        // FIX: Export setCanvasSize to be used in useAppLogic for loading projects.
        setCanvasSize,
        inputWidth,
        setInputWidth,
        inputHeight,
        setInputHeight,
        viewportDpi,
        setViewportDpi,
        transform,
        setTransform,
        renderScale,
        mapContainerRef,
        backgroundCanvasRef,
        foregroundCanvasRef,
        effectsCanvasRef,
        topLayerCanvasRef,
        brushTopLayerCanvasRef,
        gridCanvasRef,
        handleApplySize,
        handleWheel,
    };
};