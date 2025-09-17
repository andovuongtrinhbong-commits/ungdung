import { useEffect, useRef, useCallback } from 'react';
import { drawMaskShapeOnContext } from '../utils';
import { Layer, Stamp, StampAsset, Texture } from '../types';

interface DrawingAndEffectsProps {
    canvasSize: { width: number, height: number };
    renderScale: number;
    layers: Layer[];
    setLayers: React.Dispatch<React.SetStateAction<Layer[]>>;
    selectedIds: string[];
    stampAssets: StampAsset[];
    transform: { scale: number, x: number, y: number };
    maskEffects: any; // Simplified for brevity
    showGrid: boolean;
    gridShape: 'square' | 'hexagon';
    gridColumns: number;
    gridRows: number;
    landTexture: Texture;
    seaTexture: Texture;
    brushTextures: Texture[];
    brushSize: number;
    maskBrushMode: 'add' | 'subtract';
    maskBrushShape: 'circle' | 'square' | 'edge';
    maskRoughness: number;
    brushTargetLayer: 'background' | 'foreground' | 'top';
    activeBrushTextureSrc: string | null;
    brushShape: 'circle' | 'square' | 'edge';
    brushOpacity: number;
    brushTextureScale: number;
    brushHue: number;
    brushSaturation: number;
    brushBrightness: number;
    brushContrast: number;
    brushHardness: number;
    backgroundCanvasRef: React.RefObject<HTMLCanvasElement>;
    foregroundCanvasRef: React.RefObject<HTMLCanvasElement>;
    effectsCanvasRef: React.RefObject<HTMLCanvasElement>;
    topLayerCanvasRef: React.RefObject<HTMLCanvasElement>;
    brushTopLayerCanvasRef: React.RefObject<HTMLCanvasElement>;
    gridCanvasRef: React.RefObject<HTMLCanvasElement>;
    mapContainerRef: React.RefObject<HTMLDivElement>;
}

export const useDrawingAndEffects = ({
    canvasSize, renderScale, layers, setLayers, selectedIds, stampAssets, transform, maskEffects, showGrid, gridShape, gridColumns, gridRows,
    landTexture, seaTexture, brushTextures,
    brushSize, maskBrushMode, maskBrushShape, maskRoughness,
    brushTargetLayer, activeBrushTextureSrc, brushShape, brushOpacity, brushTextureScale, brushHue, brushSaturation, brushBrightness, brushContrast,
    brushHardness,
    backgroundCanvasRef, foregroundCanvasRef, effectsCanvasRef, topLayerCanvasRef, brushTopLayerCanvasRef, gridCanvasRef, mapContainerRef
}: DrawingAndEffectsProps) => {
    
    const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const { width, height } = canvasSize;

    const applyCoastlineEffects = useCallback(() => {
        const fgCanvas = foregroundCanvasRef.current;
        const effectsCanvas = effectsCanvasRef.current;
        if (!fgCanvas || !effectsCanvas) return;
    
        const effectsCtx = effectsCanvas.getContext('2d');
        const fgCtx = fgCanvas.getContext('2d', { willReadFrequently: true });
        if (!effectsCtx || !fgCtx) return;
    
        effectsCtx.clearRect(0, 0, effectsCanvas.width, effectsCanvas.height);
        if (!maskEffects.enabled) return;
    
        const maskCanvas = document.createElement('canvas');
        maskCanvas.width = width * renderScale;
        maskCanvas.height = height * renderScale;
        const maskCtx = maskCanvas.getContext('2d');
        if (!maskCtx) return;
        
        maskCtx.drawImage(fgCanvas, 0, 0);
        maskCtx.globalCompositeOperation = 'source-in';
        maskCtx.fillStyle = 'black';
        maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
    
        effectsCtx.save();
        effectsCtx.filter = 'url(#dynamic-coastline-effects)';
        effectsCtx.drawImage(maskCanvas, 0, 0);
        effectsCtx.restore();
    
        if (maskEffects.innerShadow.enabled) {
            const { color, offsetX, offsetY, blur } = maskEffects.innerShadow;
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = width * renderScale;
            tempCanvas.height = height * renderScale;
            const tempCtx = tempCanvas.getContext('2d');
            if (!tempCtx) return;
    
            tempCtx.drawImage(maskCanvas, 0, 0);
            tempCtx.globalCompositeOperation = 'source-out';
            tempCtx.fillStyle = 'black';
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    
            const shadowOnlyCanvas = document.createElement('canvas');
            shadowOnlyCanvas.width = width * renderScale;
            shadowOnlyCanvas.height = height * renderScale;
            const shadowOnlyCtx = shadowOnlyCanvas.getContext('2d');
            if(!shadowOnlyCtx) return;
            shadowOnlyCtx.filter = `drop-shadow(${offsetX * renderScale}px ${offsetY * renderScale}px ${blur * renderScale}px ${color})`; 
            shadowOnlyCtx.drawImage(tempCanvas, 0, 0);
            
            fgCtx.save();
            fgCtx.globalCompositeOperation = 'source-atop';
            fgCtx.drawImage(shadowOnlyCanvas, 0, 0);
            fgCtx.restore();
        }
      }, [width, height, maskEffects, renderScale, foregroundCanvasRef, effectsCanvasRef]);
      
      useEffect(() => {
        if (mapContainerRef.current) {
            const { width: containerWidth, height: containerHeight } = mapContainerRef.current.getBoundingClientRect();
            const scale = 1; 
            const x = (containerWidth - width * scale) / 2;
            const y = (containerHeight - height * scale) / 2;
            // setTransform({ scale, x, y }); // This should be done in useCanvasState
        }
    
        const bgCtx = backgroundCanvasRef.current?.getContext('2d');
        if (bgCtx && seaTexture.img) {
          bgCtx.clearRect(0, 0, bgCtx.canvas.width, bgCtx.canvas.height);
          bgCtx.save();
          bgCtx.scale(renderScale, renderScale);
          const pattern = bgCtx.createPattern(seaTexture.img, 'repeat');
          if (pattern) {
            bgCtx.fillStyle = pattern;
            bgCtx.fillRect(0, 0, width, height);
          }
          bgCtx.restore();
        }
    
        const canvases = [foregroundCanvasRef, topLayerCanvasRef, effectsCanvasRef, brushTopLayerCanvasRef, gridCanvasRef];
        canvases.forEach(ref => {
          if (ref.current) {
            const ctx = ref.current.getContext('2d');
            ctx?.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
          }
        });
        // NOTE: setLayers([]) was removed from here to prevent wiping project on resize.
      }, [width, height, seaTexture.img, renderScale, backgroundCanvasRef, foregroundCanvasRef, topLayerCanvasRef, effectsCanvasRef, brushTopLayerCanvasRef, gridCanvasRef, mapContainerRef]);
      
      useEffect(() => {
        applyCoastlineEffects();
      }, [maskEffects, applyCoastlineEffects, renderScale]);
      
      useEffect(() => {
        const ctx = gridCanvasRef.current?.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        if (!showGrid) return;
        ctx.save();
        ctx.scale(renderScale, renderScale);
        ctx.strokeStyle = 'rgba(0,0,0,0.5)';
        ctx.lineWidth = 1 / transform.scale;
        if (gridShape === 'square') {
            const cellWidth = width / gridColumns;
            const cellHeight = height / gridRows;
            for (let i = 1; i < gridColumns; i++) { ctx.beginPath(); ctx.moveTo(i * cellWidth, 0); ctx.lineTo(i * cellWidth, height); ctx.stroke(); }
            for (let i = 1; i < gridRows; i++) { ctx.beginPath(); ctx.moveTo(0, i * cellHeight); ctx.lineTo(width, i * cellHeight); ctx.stroke(); }
        } else if (gridShape === 'hexagon') {
            const hexWidth = width / (gridColumns + 0.5);
            const hexRadius = hexWidth / 2;
            const hexHeight = Math.sqrt(3) * hexRadius;
            for (let j = 0; j * hexHeight * 0.75 < height + hexHeight; j++) {
                for (let i = 0; i * hexWidth < width + hexWidth; i++) {
                    const cx = i * hexWidth + (j % 2) * (hexWidth / 2);
                    const cy = j * hexHeight * 0.75;
                    ctx.beginPath();
                    for (let k = 0; k < 6; k++) {
                        const angle = (k * Math.PI) / 3;
                        const vx = cx + hexRadius * Math.cos(angle);
                        const vy = cy + hexRadius * Math.sin(angle);
                        if (k === 0) ctx.moveTo(vx, vy); else ctx.lineTo(vx, vy);
                    }
                    ctx.closePath(); ctx.stroke();
                }
            }
        }
        ctx.restore();
      }, [showGrid, gridShape, gridColumns, gridRows, width, height, transform.scale, renderScale, gridCanvasRef]);
      
      useEffect(() => {
        const canvas = topLayerCanvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx || !canvas) return;
        ctx.imageSmoothingQuality = 'high';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.scale(renderScale, renderScale);
        const renderStamps = (layerTree: Layer[]) => {
          for (const stamp of layerTree) {
            if (stamp.type === 'stamp') {
               const img = stampAssets.find(t => t.src === stamp.src)?.img;
                if (img) {
                    ctx.save();
                    ctx.globalAlpha = stamp.opacity;
                    ctx.filter = `hue-rotate(${stamp.hue || 0}deg) saturate(${stamp.saturation === undefined ? 100 : stamp.saturation}%)`;
                    const w = stamp.width * stamp.scale;
                    const h = stamp.height * stamp.scale;
                    const centerX = stamp.x + w / 2;
                    const centerY = stamp.y + h / 2;
                    ctx.translate(centerX, centerY);
                    ctx.rotate((stamp.rotation * Math.PI) / 180);
                    ctx.scale(stamp.flipH ? -1 : 1, 1);
                    ctx.drawImage(img, -w / 2, -h / 2, w, h);
                    ctx.restore();
    
                    if (selectedIds.includes(stamp.id)) {
                        ctx.save();
                        ctx.translate(centerX, centerY);
                        ctx.rotate((stamp.rotation * Math.PI) / 180);
                        ctx.strokeStyle = '#4a90e2';
                        ctx.lineWidth = 2 / (transform.scale * renderScale);
                        ctx.strokeRect(-w / 2, -h / 2, w, h);
                        ctx.restore();
                    }
                }
            } else if (stamp.type === 'group') {
              renderStamps(stamp.children);
            }
          }
        };
        renderStamps(layers);
        ctx.restore();
      }, [layers, stampAssets, selectedIds, transform.scale, renderScale, topLayerCanvasRef]);
      
    const drawOnMaskCanvas = useCallback((point: {x: number, y: number}) => {
      const ctx = foregroundCanvasRef.current?.getContext('2d');
      if (!ctx || !landTexture.img) return;
      ctx.save();
      ctx.scale(renderScale, renderScale);
      const offsetX = point.x - brushSize / 2;
      const offsetY = point.y - brushSize / 2;
      if (maskBrushMode === 'add') {
          if (!offscreenCanvasRef.current) offscreenCanvasRef.current = document.createElement('canvas');
          const offscreenCanvas = offscreenCanvasRef.current;
          const offscreenCtx = offscreenCanvas.getContext('2d');
          if (!offscreenCtx) { ctx.restore(); return; }
          offscreenCanvas.width = brushSize * renderScale;
          offscreenCanvas.height = brushSize * renderScale;
          offscreenCtx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
          offscreenCtx.save();
          offscreenCtx.scale(renderScale, renderScale);
          const pattern = offscreenCtx.createPattern(landTexture.img, 'repeat');
          if (pattern) {
              offscreenCtx.fillStyle = pattern;
              offscreenCtx.translate(-offsetX, -offsetY);
              offscreenCtx.fillRect(offsetX, offsetY, brushSize, brushSize);
              offscreenCtx.setTransform(1,0,0,1,0,0);
              offscreenCtx.scale(renderScale, renderScale);
          }
          offscreenCtx.globalCompositeOperation = 'destination-in';
          offscreenCtx.fillStyle = 'black';
          drawMaskShapeOnContext(offscreenCtx, { x: brushSize / 2, y: brushSize / 2 }, brushSize, maskBrushShape, maskRoughness);
          offscreenCtx.restore();
          ctx.globalCompositeOperation = 'source-over';
          ctx.drawImage(offscreenCanvas, offsetX, offsetY, brushSize, brushSize);
      } else {
          ctx.globalCompositeOperation = 'destination-out';
          drawMaskShapeOnContext(ctx, point, brushSize, maskBrushShape, maskRoughness);
      }
      ctx.restore();
    }, [maskBrushMode, brushSize, landTexture.img, maskBrushShape, maskRoughness, renderScale, foregroundCanvasRef]);
    
    const drawWithBrush = useCallback((point: {x: number, y: number}) => {
        let targetCanvas: HTMLCanvasElement | null;
        let finalCompositeOp: GlobalCompositeOperation = 'source-over';
        switch (brushTargetLayer) {
            case 'background': targetCanvas = backgroundCanvasRef.current; break;
            case 'foreground': targetCanvas = foregroundCanvasRef.current; finalCompositeOp = 'source-atop'; break;
            case 'top':        targetCanvas = brushTopLayerCanvasRef.current; break;
            default: return;
        }
        const ctx = targetCanvas?.getContext('2d');
        const texture = brushTextures.find(t => t.src === activeBrushTextureSrc)?.img;
        if (!ctx || !texture) return;
        ctx.save();
        ctx.scale(renderScale, renderScale);
        ctx.globalAlpha = brushOpacity;
        if (!offscreenCanvasRef.current) offscreenCanvasRef.current = document.createElement('canvas');
        const offscreenCanvas = offscreenCanvasRef.current;
        const offscreenCtx = offscreenCanvas.getContext('2d');
        if (!offscreenCtx) { ctx.restore(); return; }
        offscreenCanvas.width = brushSize * renderScale;
        offscreenCanvas.height = brushSize * renderScale;
        const patternCanvas = document.createElement('canvas');
        const scaledTextureSize = brushTextureScale * renderScale;
        patternCanvas.width = scaledTextureSize;
        patternCanvas.height = scaledTextureSize;
        const patternCtx = patternCanvas.getContext('2d');
        if (!patternCtx) { ctx.restore(); return; }
        patternCtx.imageSmoothingQuality = 'high';
        patternCtx.filter = `hue-rotate(${brushHue}deg) saturate(${brushSaturation}%) brightness(${brushBrightness}%) contrast(${brushContrast}%)`;
        patternCtx.drawImage(texture, 0, 0, scaledTextureSize, scaledTextureSize);
        offscreenCtx.save();
        offscreenCtx.scale(renderScale, renderScale);
        const pattern = offscreenCtx.createPattern(patternCanvas, 'repeat');
        if (!pattern) { ctx.restore(); offscreenCtx.restore(); return; }
        offscreenCtx.fillStyle = pattern;
        const offsetX = point.x - brushSize / 2;
        const offsetY = point.y - brushSize / 2;
        offscreenCtx.translate(-offsetX, -offsetY);
        offscreenCtx.fillRect(offsetX, offsetY, brushSize, brushSize);
        offscreenCtx.restore();
        offscreenCtx.save();
        offscreenCtx.scale(renderScale, renderScale);
        offscreenCtx.globalCompositeOperation = 'destination-in';
        if (brushShape === 'circle') {
          const gradient = offscreenCtx.createRadialGradient(brushSize / 2, brushSize / 2, 0, brushSize / 2, brushSize / 2, brushSize / 2);
          gradient.addColorStop(0, 'black');
          gradient.addColorStop(Math.max(0, Math.min(1, brushHardness)), 'black');
          gradient.addColorStop(1, 'rgba(0,0,0,0)');
          offscreenCtx.fillStyle = gradient;
          offscreenCtx.fillRect(0, 0, brushSize, brushSize);
        } else if (brushShape === 'square') {
          offscreenCtx.fillStyle = 'black';
          offscreenCtx.fillRect(0, 0, brushSize, brushSize);
        }
        offscreenCtx.restore();
        ctx.globalCompositeOperation = finalCompositeOp;
        ctx.drawImage(offscreenCanvas, offsetX, offsetY, brushSize, brushSize);
        ctx.restore();
    }, [brushTargetLayer, activeBrushTextureSrc, brushTextures, brushSize, brushHardness, brushShape, brushOpacity, brushTextureScale, brushHue, brushSaturation, brushBrightness, brushContrast, renderScale, backgroundCanvasRef, foregroundCanvasRef, brushTopLayerCanvasRef]);

    return { drawOnMaskCanvas, drawWithBrush, applyCoastlineEffects };
};