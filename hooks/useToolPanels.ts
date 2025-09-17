import React, { useState, useEffect, useCallback } from 'react';
import { Tool, BrushMode, BrushLayer, BrushShape, GridShape, Stamp, Layer, MaskEffects, StampAsset } from '../types';

interface ToolPanelsProps {
    stampAssets: StampAsset[];
    layers: Layer[];
    flattenLayers: (layers: Layer[]) => Stamp[];
    width: number;
    height: number;
    backgroundCanvasRef: React.RefObject<HTMLCanvasElement>;
    effectsCanvasRef: React.RefObject<HTMLCanvasElement>;
    foregroundCanvasRef: React.RefObject<HTMLCanvasElement>;
    brushTopLayerCanvasRef: React.RefObject<HTMLCanvasElement>;
    topLayerCanvasRef: React.RefObject<HTMLCanvasElement>;
    setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
}

export const useToolPanels = ({ stampAssets, layers, flattenLayers, width, height, backgroundCanvasRef, effectsCanvasRef, foregroundCanvasRef, brushTopLayerCanvasRef, topLayerCanvasRef, setSelectedIds }: ToolPanelsProps) => {
    const [isRightSidebarOpen, setRightSidebarOpen] = useState(true);
    const [activeToolPanel, setActiveToolPanel] = useState<Tool | null>('settings');
    const [currentTool, setCurrentTool] = useState<Tool>('settings');
    const [brushSize, setBrushSize] = useState(50);
    const [maskBrushMode, setMaskBrushMode] = useState<BrushMode>('add');
    const [maskBrushShape, setMaskBrushShape] = useState<BrushShape>('circle');
    const [maskRoughness, setMaskRoughness] = useState(0);
    const [maskEffects, setMaskEffects] = useState<MaskEffects>({
      enabled: true,
      stroke: { enabled: true, color: '#362114', width: 0.75 },
      outerShadow: { enabled: true, color: 'rgba(0,0,0,0.7)', offsetX: 2, offsetY: 2, blur: 3 },
      innerShadow: { enabled: true, color: 'rgba(0,0,0,0.8)', offsetX: 2, offsetY: 2, blur: 3 },
      ripples: { enabled: true, width: 50, count: 3, gap: 3 },
    });
    const [brushHardness, setBrushHardness] = useState(0.8);
    const [brushTargetLayer, setBrushTargetLayer] = useState<BrushLayer>('foreground');
    const [activeBrushTextureSrc, setActiveBrushTextureSrc] = useState<string | null>(null);
    const [brushShape, setBrushShape] = useState<BrushShape>('circle');
    const [brushOpacity, setBrushOpacity] = useState(1);
    const [brushTextureScale, setBrushTextureScale] = useState(100);
    const [brushHue, setBrushHue] = useState(0);
    const [brushSaturation, setBrushSaturation] = useState(100);
    const [brushBrightness, setBrushBrightness] = useState(100);
    const [brushContrast, setBrushContrast] = useState(100);
    const [showGrid, setShowGrid] = useState(false);
    const [gridShape, setGridShape] = useState<GridShape>('square');
    const [gridColumns, setGridColumns] = useState(20);
    const [gridRows, setGridRows] = useState(20);
    const [exportDpi, setExportDpi] = useState(96);
    const [assetLink, setAssetLink] = useState('');
    const [insertionCategory, setInsertionCategory] = useState('1');
    const [activeCatalogCategory, setActiveCatalogCategory] = useState('1');
    const [placementScale, setPlacementScale] = useState(1);
    const [placementRotation, setPlacementRotation] = useState(0);
    const [activeStampSrc, setActiveStampSrc] = useState<string | null>(null);

    const handleToolSelect = (tool: Tool) => {
        if (tool === activeToolPanel) {
            setActiveToolPanel(null);
        } else {
            setCurrentTool(tool);
            setActiveToolPanel(tool);
            if (tool === 'selection') {
                setSelectedIds([]);
            }
        }
    };
    
    const handleEffectChange = (effect: keyof Omit<MaskEffects, 'enabled'>, property: string, value: any) => {
      setMaskEffects(prev => ({
          ...prev,
          [effect]: {
              ...prev[effect],
              [property]: value
          }
      }));
    };
    
    useEffect(() => {
      if (activeStampSrc) {
          const asset = stampAssets.find((t: StampAsset) => t.src === activeStampSrc);
          if (asset?.img) {
              const { naturalWidth, naturalHeight } = asset.img;
              const maxDim = Math.max(naturalWidth, naturalHeight);
              if (maxDim > 0) {
                  const newScale = 50 / maxDim;
                  setPlacementScale(newScale);
              }
          }
      }
    }, [activeStampSrc, stampAssets]);

    const handleExportWebP = useCallback(() => {
        const scaleFactor = exportDpi / 96;
        const exportWidth = Math.round(width * scaleFactor);
        const exportHeight = Math.round(height * scaleFactor);
    
        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = exportWidth;
        exportCanvas.height = exportHeight;
        const ctx = exportCanvas.getContext('2d');
        if (!ctx) {
            alert("Failed to create export canvas.");
            return;
        }
    
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
    
        const canvasesToScale = [
          backgroundCanvasRef.current,
          effectsCanvasRef.current,
          foregroundCanvasRef.current,
          brushTopLayerCanvasRef.current,
        ];
    
        canvasesToScale.forEach(canvas => {
          if (canvas) {
            ctx.drawImage(canvas, 0, 0, exportWidth, exportHeight);
          }
        });
        
        const allStampsToDraw = flattenLayers(layers);
        allStampsToDraw.forEach((stamp: Stamp) => {
            const img = stampAssets.find((t: StampAsset) => t.src === stamp.src)?.img;
            if (img) {
                ctx.save();
                ctx.globalAlpha = stamp.opacity;
                ctx.filter = `hue-rotate(${stamp.hue || 0}deg) saturate(${stamp.saturation === undefined ? 100 : stamp.saturation}%)`;
                
                const w = stamp.width * stamp.scale * scaleFactor;
                const h = stamp.height * stamp.scale * scaleFactor;
                const centerX = (stamp.x * scaleFactor) + w / 2;
                const centerY = (stamp.y * scaleFactor) + h / 2;
    
                ctx.translate(centerX, centerY);
                ctx.rotate((stamp.rotation * Math.PI) / 180);
                ctx.scale(stamp.flipH ? -1 : 1, 1);
                ctx.drawImage(img, -w / 2, -h / 2, w, h);
                ctx.restore();
            }
        });
    
        const dataUrl = exportCanvas.toDataURL('image/webp', 1.0);
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `map-${exportWidth}x${exportHeight}@${exportDpi}dpi.webp`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, [width, height, exportDpi, layers, stampAssets, flattenLayers, backgroundCanvasRef, effectsCanvasRef, foregroundCanvasRef, brushTopLayerCanvasRef]);

    const handleExportNavJson = useCallback(() => {
        const downscaleCanvas = (sourceCanvas: HTMLCanvasElement | null) => {
            if (!sourceCanvas) return null;
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = width;
            tempCanvas.height = height;
            const tempCtx = tempCanvas.getContext('2d');
            if (!tempCtx) return null;
            tempCtx.drawImage(sourceCanvas, 0, 0, width, height);
            return tempCtx.getImageData(0, 0, width, height).data;
        };
    
        const fgImageData = downscaleCanvas(foregroundCanvasRef.current);
        const stampsImageData = downscaleCanvas(topLayerCanvasRef.current);
        const brushTopImageData = downscaleCanvas(brushTopLayerCanvasRef.current);
    
        if (!fgImageData || !stampsImageData || !brushTopImageData) {
          alert("Could not get canvas data for export.");
          return;
        }
    
        const navGrid = Array(height).fill(null).map(() => Array(width).fill(0));
    
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;
            const isLand = fgImageData[i + 3] > 0;
            const isStampObstacle = stampsImageData[i + 3] > 0;
            const isBrushTopObstacle = brushTopImageData[i + 3] > 0;
    
            if (isLand && !isStampObstacle && !isBrushTopObstacle) {
              navGrid[y][x] = 1; // 1 means traversable
            }
          }
        }
    
        const jsonString = JSON.stringify(navGrid);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'navigation.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, [width, height, foregroundCanvasRef, topLayerCanvasRef, brushTopLayerCanvasRef]);

    return {
        isRightSidebarOpen, setRightSidebarOpen,
        activeToolPanel, setActiveToolPanel,
        currentTool, setCurrentTool,
        brushSize, setBrushSize,
        maskBrushMode, setMaskBrushMode,
        maskBrushShape, setMaskBrushShape,
        maskRoughness, setMaskRoughness,
        maskEffects, setMaskEffects,
        handleEffectChange,
        brushHardness, setBrushHardness,
        brushTargetLayer, setBrushTargetLayer,
        activeBrushTextureSrc, setActiveBrushTextureSrc,
        brushShape, setBrushShape,
        brushOpacity, setBrushOpacity,
        brushTextureScale, setBrushTextureScale,
        brushHue, setBrushHue,
        brushSaturation, setBrushSaturation,
        brushBrightness, setBrushBrightness,
        brushContrast, setBrushContrast,
        showGrid, setShowGrid,
        gridShape, setGridShape,
        gridColumns, setGridColumns,
        gridRows, setGridRows,
        exportDpi, setExportDpi,
        handleExportWebP, handleExportNavJson,
        assetLink, setAssetLink,
        insertionCategory, setInsertionCategory,
        activeCatalogCategory, setActiveCatalogCategory,
        placementScale, setPlacementScale,
        placementRotation, setPlacementRotation,
        activeStampSrc, setActiveStampSrc,
        handleToolSelect,
    };
};