import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { Tool, BrushMode, BrushLayer, BrushShape, GridShape, Stamp, Group, Layer, Texture, StampAsset, MaskEffects } from './types';
import { Toolbar } from './components/Toolbar';
import { ToolPanel } from './components/ToolPanel';
import { SettingsToolPanel } from './components/panels/SettingsToolPanel';
import { MaskToolPanel } from './components/panels/MaskToolPanel';
import { BrushToolPanel } from './components/panels/BrushToolPanel';
import { StampToolPanel } from './components/panels/StampToolPanel';
import { GridToolPanel } from './components/panels/GridToolPanel';
import { AssetsToolPanel } from './components/panels/AssetsToolPanel';
import { ExportToolPanel } from './components/panels/ExportToolPanel';
import { LayersPanel } from './components/LayersPanel';
import { DynamicSVGFilters } from './components/DynamicSVGFilters';
import { SelectionToolPanel } from './components/panels/SelectionToolPanel';

const MIN_SCALE = 0.1;
const MAX_SCALE = 10;
const BRUSH_TEXTURE_URLS = [
    'https://raw.githubusercontent.com/tttkvn/Upanh/main/brushtexturemap2d/nenda.png',
    'https://raw.githubusercontent.com/tttkvn/Upanh/main/brushtexturemap2d/nendatbt.png',
    'https://raw.githubusercontent.com/tttkvn/Upanh/main/brushtexturemap2d/nendatnut.png',
    'https://raw.githubusercontent.com/tttkvn/Upanh/main/brushtexturemap2d/nendanham.png',
    'https://raw.githubusercontent.com/tttkvn/Upanh/main/brushtexturemap2d/nendaxam.png',
    'https://raw.githubusercontent.com/tttkvn/Upanh/main/brushtexturemap2d/nendavang.png',
    'https://raw.githubusercontent.com/tttkvn/Upanh/main/brushtexturemap2d/nenbang1.png',
    'https://raw.githubusercontent.com/tttkvn/Upanh/main/brushtexturemap2d/nenbang2.png',
    'https://raw.githubusercontent.com/tttkvn/Upanh/main/brushtexturemap2d/nenbang3.png',
    'https://raw.githubusercontent.com/tttkvn/Upanh/main/brushtexturemap2d/nenbang4.png',
    'https://raw.githubusercontent.com/tttkvn/Upanh/main/brushtexturemap2d/nenbang5.png'
];
const FOLDER_1_ASSETS = [
    'https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap1/Moutains%201.png','https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap1/Moutains%202.png','https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap1/Moutains%203.png','https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap1/Moutains%204.png','https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap1/Moutains%205.png','https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap1/Moutains%206.png','https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap1/Moutains%207.png','https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap1/Moutains%208.png','https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap1/Moutains%209.png','https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap1/Moutains%2010.png','https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap1/Moutains%2011.png','https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap1/Moutains%2012.png','https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap1/Moutains%2013.png','https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap1/Moutains%2014.png','https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap1/Moutains%2015.png','https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap1/Moutains%2016.png','https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap1/Moutains%2017.png','https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap1/Moutains%2018.png','https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap1/Moutains%2019.png','https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap1/Moutains%2020.png','https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap1/Moutains%2021.png','https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap1/Moutains%2022.png','https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap1/Moutains%2023.png','https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap1/Moutains%2024.png','https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap1/Moutains%2025.png','https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap1/Moutains%2026.png','https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap1/Moutains%2027.png','https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap1/Moutains%2028.png','https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap1/Moutains%2029.png','https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap1/Moutains%2030.png','https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap1/Moutains%2031.png'
].map(src => ({ src, category: '1' }));

const FOLDER_2_ASSETS = [
    'https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap2/cayda.png',
    'https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap2/caytre.png',
    'https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap2/caydua.png',
    'https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap2/caysen.png',
    'https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap2/chuoi.png'
].map(src => ({ src, category: '2' }));

const INITIAL_STAMP_ASSETS = [...FOLDER_1_ASSETS, ...FOLDER_2_ASSETS];


const drawMaskShapeOnContext = (
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

const App = () => {
  const [isRightSidebarOpen, setRightSidebarOpen] = useState(true);
  
  const [activeToolPanel, setActiveToolPanel] = useState<Tool | null>('settings');

  const [canvasSize, setCanvasSize] = useState({ width: 512, height: 512 });
  const [inputWidth, setInputWidth] = useState('512');
  const [inputHeight, setInputHeight] = useState('512');
  const [viewportDpi, setViewportDpi] = useState(96);
    
  const [assetLink, setAssetLink] = useState('');
  const [insertionCategory, setInsertionCategory] = useState('1');

  // Tool State
  const [currentTool, setCurrentTool] = useState<Tool>('settings');
  
  // Shared Brush State
  const [brushSize, setBrushSize] = useState(50);
  
  // Mask Tool State
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


  // Brush Tool State
  const [brushHardness, setBrushHardness] = useState(0.8);
  const [brushTargetLayer, setBrushTargetLayer] = useState<BrushLayer>('foreground');
  const [brushTextures, setBrushTextures] = useState<Texture[]>([]);
  const [activeBrushTextureSrc, setActiveBrushTextureSrc] = useState<string | null>(null);
  const [brushShape, setBrushShape] = useState<BrushShape>('circle');
  const [brushOpacity, setBrushOpacity] = useState(1);
  const [brushTextureScale, setBrushTextureScale] = useState(100);
  const [brushHue, setBrushHue] = useState(0);
  const [brushSaturation, setBrushSaturation] = useState(100);
  const [brushBrightness, setBrushBrightness] = useState(100);
  const [brushContrast, setBrushContrast] = useState(100);

  // Grid Tool State
  const [showGrid, setShowGrid] = useState(false);
  const [gridShape, setGridShape] = useState<GridShape>('square');
  const [gridColumns, setGridColumns] = useState(20);
  const [gridRows, setGridRows] = useState(20);

  // Export State
  const [exportDpi, setExportDpi] = useState(96);

  // Texture State
  const [landTexture, setLandTexture] = useState<Texture>({src: 'https://raw.githubusercontent.com/tttkvn/Upanh/main/brushtexturemap2d/nendatbt.png', img: null});
  const [seaTexture, setSeaTexture] = useState<Texture>({src: 'https://raw.githubusercontent.com/tttkvn/Upanh/main/brushtexturemap2d/nenbien.jpg', img: null});

  // Stamp Tool State
  const [stampAssets, setStampAssets] = useState<StampAsset[]>([]);
  const [layers, setLayers] = useState<Layer[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeStampSrc, setActiveStampSrc] = useState<string | null>(null);
  const [stampClipboard, setStampClipboard] = useState<Omit<Stamp, 'id' | 'x' | 'y' | 'type'> | null>(null);
  const [activeCatalogCategory, setActiveCatalogCategory] = useState('1');
  const [placementScale, setPlacementScale] = useState(1);
  const [placementRotation, setPlacementRotation] = useState(0);

  // Drag and Drop state
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);

  const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isCursorVisible, setIsCursorVisible] = useState(false);
  
  const isDrawing = useRef(false);
  const isPanning = useRef(false);
  const isDraggingStamp = useRef(false);
  const lastMousePosition = useRef({ x: 0, y: 0 });
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null);
  const foregroundCanvasRef = useRef<HTMLCanvasElement>(null);
  const effectsCanvasRef = useRef<HTMLCanvasElement>(null);
  const topLayerCanvasRef = useRef<HTMLCanvasElement>(null); // Stamps
  const brushTopLayerCanvasRef = useRef<HTMLCanvasElement>(null); // Brush Top Layer
  const gridCanvasRef = useRef<HTMLCanvasElement>(null);
  
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const { width, height } = canvasSize;
  const renderScale = viewportDpi / 96;
  
  const handleInsertStampAsset = useCallback((url: string, category: string) => {
      if (!url) return;
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        setStampAssets(prev => {
          if (prev.some(t => t.src === url)) return prev;
          return [...prev, { src: url, category, img }];
        });
      };
      img.onerror = () => console.error(`Failed to load image: ${url}`);
      img.src = url;
  }, []);

  useEffect(() => {
    INITIAL_STAMP_ASSETS.forEach(asset => {
        handleInsertStampAsset(asset.src, asset.category);
    });
  }, [handleInsertStampAsset]);

  useEffect(() => {
    const loadTexture = (textureState: Texture, setTexture: React.Dispatch<React.SetStateAction<Texture>>) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => setTexture(prev => ({ ...prev, img }));
        img.onerror = () => alert(`Failed to load image: ${textureState.src}. Check URL and CORS policy.`);
        img.src = textureState.src;
    };
    if (!landTexture.img) loadTexture(landTexture, setLandTexture);
    if (!seaTexture.img) loadTexture(seaTexture, setSeaTexture);
  }, []);
  
  useEffect(() => {
    const texturesToLoad: Texture[] = [];
    let loadedCount = 0;
    BRUSH_TEXTURE_URLS.forEach(src => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            texturesToLoad.push({ src, img });
            loadedCount++;
            if (loadedCount === BRUSH_TEXTURE_URLS.length) {
                setBrushTextures(texturesToLoad);
                if (texturesToLoad.length > 0 && !activeBrushTextureSrc) {
                    setActiveBrushTextureSrc(texturesToLoad[0].src);
                }
            }
        };
        img.onerror = () => {
            console.error(`Failed to load brush texture: ${src}`);
            loadedCount++;
             if (loadedCount === BRUSH_TEXTURE_URLS.length) {
                setBrushTextures(texturesToLoad);
                 if (texturesToLoad.length > 0 && !activeBrushTextureSrc) {
                    setActiveBrushTextureSrc(texturesToLoad[0].src);
                }
            }
        };
        img.src = src;
    });
  }, []);

  useEffect(() => {
    // This effect handles the full reset when the map size or base texture changes.
    if (mapContainerRef.current) {
        const { width: containerWidth, height: containerHeight } = mapContainerRef.current.getBoundingClientRect();
        // Reset scale and position to center the map
        const scale = 1; 
        const x = (containerWidth - width * scale) / 2;
        const y = (containerHeight - height * scale) / 2;
        setTransform({ scale, x, y });
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
    setLayers([]); // Clear layers on resize
  }, [width, height, seaTexture.img, renderScale]);

  useEffect(() => {
    if (activeStampSrc) {
        const asset = stampAssets.find(t => t.src === activeStampSrc);
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
  
   const getTransformedPoint = useCallback((clientX: number, clientY: number) => {
    if (!mapContainerRef.current) return { x: 0, y: 0 };
    const rect = mapContainerRef.current.getBoundingClientRect();
    const x = (clientX - rect.left - transform.x) / transform.scale;
    const y = (clientY - rect.top - transform.y) / transform.scale;
    return { x, y };
  }, [transform]);

  const applyCoastlineEffects = useCallback(() => {
    const fgCanvas = foregroundCanvasRef.current;
    const effectsCanvas = effectsCanvasRef.current;
    if (!fgCanvas || !effectsCanvas) return;

    const effectsCtx = effectsCanvas.getContext('2d');
    const fgCtx = fgCanvas.getContext('2d', { willReadFrequently: true });
    if (!effectsCtx || !fgCtx) return;

    // 1. Clear previous effects
    effectsCtx.clearRect(0, 0, effectsCanvas.width, effectsCanvas.height);

    if (!maskEffects.enabled) {
        return;
    }

    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = width * renderScale;
    maskCanvas.height = height * renderScale;
    const maskCtx = maskCanvas.getContext('2d');
    if (!maskCtx) return;
    
    maskCtx.drawImage(fgCanvas, 0, 0);
    maskCtx.globalCompositeOperation = 'source-in';
    maskCtx.fillStyle = 'black';
    maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

    // 2. Apply the all-in-one SVG filter
    effectsCtx.save();
    effectsCtx.filter = 'url(#dynamic-coastline-effects)';
    effectsCtx.drawImage(maskCanvas, 0, 0);
    effectsCtx.restore();

    // 3. Inner Shadow
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
  }, [width, height, maskEffects, renderScale]);

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

        for (let i = 1; i < gridColumns; i++) {
            ctx.beginPath();
            ctx.moveTo(i * cellWidth, 0);
            ctx.lineTo(i * cellWidth, height);
            ctx.stroke();
        }
        for (let i = 1; i < gridRows; i++) {
            ctx.beginPath();
            ctx.moveTo(0, i * cellHeight);
            ctx.lineTo(width, i * cellHeight);
            ctx.stroke();
        }
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
                    if (k === 0) ctx.moveTo(vx, vy);
                    else ctx.lineTo(vx, vy);
                }
                ctx.closePath();
                ctx.stroke();
            }
        }
    }
    ctx.restore();

  }, [showGrid, gridShape, gridColumns, gridRows, width, height, transform.scale, renderScale]);

  const flattenLayers = useCallback((layerTree: Layer[]): Stamp[] => {
    const allStamps: Stamp[] = [];
    const traverse = (currentLayers: Layer[]) => {
      for (const layer of currentLayers) {
        if (layer.type === 'stamp') {
          allStamps.push(layer);
        } else if (layer.type === 'group') {
          traverse(layer.children);
        }
      }
    };
    traverse(layerTree);
    return allStamps;
  }, []);


  const drawOnMaskCanvas = useCallback((point: {x: number, y: number}) => {
    const ctx = foregroundCanvasRef.current?.getContext('2d');
    if (!ctx) return;

    ctx.save();
    ctx.scale(renderScale, renderScale);

    const offsetX = point.x - brushSize / 2;
    const offsetY = point.y - brushSize / 2;

    if (maskBrushMode === 'add') {
        const texture = landTexture.img;
        if (!texture) { ctx.restore(); return; }
        
        if (!offscreenCanvasRef.current) offscreenCanvasRef.current = document.createElement('canvas');
        const offscreenCanvas = offscreenCanvasRef.current;
        const offscreenCtx = offscreenCanvas.getContext('2d');
        if (!offscreenCtx) { ctx.restore(); return; }

        offscreenCanvas.width = brushSize * renderScale;
        offscreenCanvas.height = brushSize * renderScale;
        offscreenCtx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
        offscreenCtx.save();
        offscreenCtx.scale(renderScale, renderScale);

        const pattern = offscreenCtx.createPattern(texture, 'repeat');
        if (pattern) {
            offscreenCtx.fillStyle = pattern;
            offscreenCtx.translate(-offsetX, -offsetY);
            offscreenCtx.fillRect(offsetX, offsetY, brushSize, brushSize);
            offscreenCtx.setTransform(1,0,0,1,0,0); // reset transform for masking
            offscreenCtx.scale(renderScale, renderScale);
        }

        offscreenCtx.globalCompositeOperation = 'destination-in';
        offscreenCtx.fillStyle = 'black';
        drawMaskShapeOnContext(offscreenCtx, { x: brushSize / 2, y: brushSize / 2 }, brushSize, maskBrushShape, maskRoughness);
        
        offscreenCtx.restore();
        
        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(offscreenCanvas, offsetX, offsetY, brushSize, brushSize);
        
    } else { // subtract
        ctx.globalCompositeOperation = 'destination-out';
        drawMaskShapeOnContext(ctx, point, brushSize, maskBrushShape, maskRoughness);
    }

    ctx.restore();
}, [maskBrushMode, brushSize, landTexture.img, maskBrushShape, maskRoughness, renderScale]);

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
      if (!ctx) return;

      const texture = brushTextures.find(t => t.src === activeBrushTextureSrc)?.img;
      if (!texture) return;
      
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
  }, [brushTargetLayer, activeBrushTextureSrc, brushTextures, brushSize, brushHardness, brushShape, brushOpacity, brushTextureScale, brushHue, brushSaturation, brushBrightness, brushContrast, renderScale]);


  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1) {
      e.preventDefault();
      isPanning.current = true;
      lastMousePosition.current = { x: e.clientX, y: e.clientY };
      if (mapContainerRef.current) mapContainerRef.current.classList.add('panning');
      return;
    }
    
    const point = getTransformedPoint(e.clientX, e.clientY);
    lastMousePosition.current = point;

    if (currentTool === 'mask') {
      isDrawing.current = true;
      drawOnMaskCanvas(point);
    } else if (currentTool === 'brush') {
      isDrawing.current = true;
      drawWithBrush(point);
    } else if (currentTool === 'stamp') {
      const allStamps = flattenLayers(layers);
      let hitStampId: string | null = null;
      for (let i = allStamps.length - 1; i >= 0; i--) {
        const stamp = allStamps[i];
        const w = stamp.width * stamp.scale;
        const h = stamp.height * stamp.scale;
        const cx = stamp.x + w / 2;
        const cy = stamp.y + h / 2;

        const translatedX = point.x - cx;
        const translatedY = point.y - cy;
        const angleRad = (-stamp.rotation * Math.PI) / 180;
        const rotatedX = translatedX * Math.cos(angleRad) - translatedY * Math.sin(angleRad);
        const rotatedY = translatedX * Math.sin(angleRad) + translatedY * Math.cos(angleRad);

        if (Math.abs(rotatedX) <= w / 2 && Math.abs(rotatedY) <= h / 2) {
            hitStampId = stamp.id;
            break;
        }
      }

      if (hitStampId) {
        if (e.shiftKey) {
            setSelectedIds(prev => prev.includes(hitStampId!) ? prev.filter(id => id !== hitStampId) : [...prev, hitStampId!]);
        } else if (!selectedIds.includes(hitStampId)) {
            setSelectedIds([hitStampId]);
        }
        setActiveToolPanel('selection');
        isDraggingStamp.current = true;
      } else {
        if (activeStampSrc) {
          const img = stampAssets.find(t => t.src === activeStampSrc)?.img;
          if (img) {
            const newStamp: Stamp = {
              id: `${Date.now()}-${Math.random()}`,
              type: 'stamp',
              src: activeStampSrc,
              x: point.x - (img.naturalWidth * placementScale / 2),
              y: point.y - (img.naturalHeight * placementScale / 2),
              width: img.naturalWidth,
              height: img.naturalHeight,
              scale: placementScale,
              rotation: placementRotation,
              opacity: 1,
              flipH: false,
              hue: 0,
              saturation: 100,
            };
            setLayers(prev => [...prev, newStamp]);
            setSelectedIds([newStamp.id]);
            setActiveToolPanel('selection');
          }
        } else {
          const hadSelection = selectedIds.length > 0;
          setSelectedIds([]);
          if (hadSelection && activeToolPanel === 'selection') {
              setActiveToolPanel('stamp');
              setCurrentTool('stamp');
          }
        }
      }
    }
  }, [currentTool, getTransformedPoint, layers, activeStampSrc, stampAssets, drawOnMaskCanvas, drawWithBrush, placementScale, placementRotation, flattenLayers, selectedIds, activeToolPanel]);

  const handleMouseUp = useCallback(() => {
    if (isPanning.current) {
      isPanning.current = false;
      if (mapContainerRef.current) {
        mapContainerRef.current.classList.remove('panning');
      }
    }
    if (isDrawing.current && currentTool === 'mask') {
        applyCoastlineEffects();
    }
    isDrawing.current = false;
    isDraggingStamp.current = false;
  }, [applyCoastlineEffects, currentTool]);
  
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setCursorPosition({ x: e.clientX, y: e.clientY });

    if (isPanning.current) {
        const dx = e.clientX - lastMousePosition.current.x;
        const dy = e.clientY - lastMousePosition.current.y;
        setTransform(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
        lastMousePosition.current = { x: e.clientX, y: e.clientY };
        return;
    }

    if (isDrawing.current) {
        const point = getTransformedPoint(e.clientX, e.clientY);
        if (currentTool === 'mask') drawOnMaskCanvas(point);
        else if (currentTool === 'brush') drawWithBrush(point);
    } else if (isDraggingStamp.current && selectedIds.length > 0) {
        const currentPoint = getTransformedPoint(e.clientX, e.clientY);
        const dx = currentPoint.x - lastMousePosition.current.x;
        const dy = currentPoint.y - lastMousePosition.current.y;
        
        const allSelectedStampIds = new Set<string>();
        const findSelectedStampIdsRecursively = (currentLayers: Layer[], isParentSelected: boolean) => {
            for (const layer of currentLayers) {
                const isSelected = isParentSelected || selectedIds.includes(layer.id);
                if (layer.type === 'stamp' && isSelected) {
                    allSelectedStampIds.add(layer.id);
                } else if (layer.type === 'group') {
                    findSelectedStampIdsRecursively(layer.children, isSelected);
                }
            }
        };
        findSelectedStampIdsRecursively(layers, false);

        const moveStampsRecursively = (currentLayers: Layer[]): Layer[] => {
            return currentLayers.map(layer => {
                if (layer.type === 'stamp' && allSelectedStampIds.has(layer.id)) {
                    return { ...layer, x: layer.x + dx, y: layer.y + dy };
                }
                if (layer.type === 'group') {
                    return { ...layer, children: moveStampsRecursively(layer.children) };
                }
                return layer;
            });
        };
        
        setLayers(moveStampsRecursively);
        lastMousePosition.current = currentPoint;
    }
  }, [getTransformedPoint, currentTool, drawOnMaskCanvas, drawWithBrush, selectedIds, layers]);

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

  }, [layers, stampAssets, selectedIds, transform.scale, width, height, renderScale]);

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
  
  
  const selectedLayer = layers.find(l => selectedIds.length === 1 && l.id === selectedIds[0]);
  const selectedStamp = selectedLayer?.type === 'stamp' ? selectedLayer : undefined;

  const updateSelectedStamp = (updater: (stamp: Stamp) => Stamp) => {
     if (selectedIds.length !== 1) return;
     const selectedId = selectedIds[0];
     
     const mapRecursive = (layerList: Layer[]): Layer[] => {
        return layerList.map(layer => {
            if(layer.id === selectedId && layer.type === 'stamp') {
                return updater(layer);
            }
            if(layer.type === 'group') {
                return {...layer, children: mapRecursive(layer.children)};
            }
            return layer;
        });
     };
     setLayers(mapRecursive);
  };

  const handleStampLayerOrder = (direction: 'forward' | 'backward') => {
    if (selectedIds.length !== 1) return;
    const selectedId = selectedIds[0];
    const index = layers.findIndex(s => s.id === selectedId);
    if (index === -1) return;
    const newLayers = [...layers];
    if (direction === 'forward' && index < layers.length - 1) {
        [newLayers[index], newLayers[index + 1]] = [newLayers[index + 1], newLayers[index]];
    } else if (direction === 'backward' && index > 0) {
        [newLayers[index], newLayers[index - 1]] = [newLayers[index - 1], newLayers[index]];
    }
    setLayers(newLayers);
  };
  
  const handleStampCopy = () => {
    if (!selectedStamp) return;
    const { id, x, y, type, ...clipboardData } = selectedStamp;
    setStampClipboard(clipboardData);
  };

  const handleStampPaste = () => {
    if (!stampClipboard) return;
    const point = getTransformedPoint(cursorPosition.x, cursorPosition.y);
    const newStamp: Stamp = {
      ...stampClipboard,
      type: 'stamp',
      id: `${Date.now()}-${Math.random()}`,
      x: point.x - (stampClipboard.width * stampClipboard.scale / 2),
      y: point.y - (stampClipboard.height * stampClipboard.scale / 2),
    };
    setLayers(prev => [...prev, newStamp]);
    setSelectedIds([newStamp.id]);
  };
  
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
    allStampsToDraw.forEach(stamp => {
        const img = stampAssets.find(t => t.src === stamp.src)?.img;
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
  }, [width, height, exportDpi, layers, stampAssets, flattenLayers]);

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
  }, [width, height]);
  
  const isBrushToolActive = currentTool === 'mask' || currentTool === 'brush';
  
  const handleEffectChange = (effect: keyof Omit<MaskEffects, 'enabled'>, property: string, value: any) => {
    setMaskEffects(prev => ({
        ...prev,
        [effect]: {
            ...prev[effect],
            [property]: value
        }
    }));
  };

  const handleToolSelect = (tool: Tool) => {
      if (tool === activeToolPanel) {
          setActiveToolPanel(null);
      } else {
          setCurrentTool(tool);
          setActiveToolPanel(tool);
      }
  };

    const handleApplySize = () => {
        const newWidth = parseInt(inputWidth, 10);
        const newHeight = parseInt(inputHeight, 10);
        if (newWidth > 0 && newHeight > 0) {
            setCanvasSize({ width: newWidth, height: newHeight });
        } else {
            alert("Please enter valid positive numbers for width and height.");
            setInputWidth(String(width));
            setInputHeight(String(height));
        }
    };
  
    const panelTitles: Record<Tool, string> = {
        mask: 'Mask Tool',
        brush: 'Brush Tool',
        stamp: 'Stamp Tool',
        grid: 'Grid Options',
        settings: 'Project Settings',
        assets: 'Asset Manager',
        export: 'Export Options',
        selection: 'Layer Properties',
    };

  let cursorStyle = {};
  if (isBrushToolActive) {
      const size = brushSize;
      const scaledSize = size * transform.scale;
      
      const isMaskTool = currentTool === 'mask';
      const shape = isMaskTool ? maskBrushShape : brushShape;
      
      let background = 'rgba(255, 255, 255, 0.25)';
      
      if (!isMaskTool && shape === 'circle') {
          const hardness = brushHardness;
          const colorStop = hardness * 99.9;
          background = `radial-gradient(circle, rgba(255, 255, 255, 0.25) ${colorStop}%, transparent 100%)`;
      }

      cursorStyle = {
          position: 'fixed', left: `${cursorPosition.x}px`, top: `${cursorPosition.y}px`,
          width: `${scaledSize}px`, height: `${scaledSize}px`, transform: 'translate(-50%, -50%)',
          background: background,
          border: '1px solid rgba(255, 255, 255, 0.75)',
          borderRadius: (shape === 'circle' || shape === 'edge') ? '50%' : '0',
      };
  }
  
    const mainStyle: React.CSSProperties = {
        position: 'absolute',
        top: 0,
        left: activeToolPanel ? 'calc(60px + var(--sidebar-width))' : '60px',
        right: isRightSidebarOpen ? 'var(--sidebar-width)' : '0px',
        bottom: 0,
        transition: 'left 0.3s ease-in-out, right 0.3s ease-in-out',
    };
    
    const handleDelete = () => {
        if (selectedIds.length === 0) return;

        const idsToDelete = new Set(selectedIds);
        const mapRecursive = (layerList: Layer[]): Layer[] => {
            const newList: Layer[] = [];
            for (const layer of layerList) {
                if (idsToDelete.has(layer.id)) {
                    continue;
                }
                if (layer.type === 'group') {
                    const newChildren = layer.children.filter(child => !idsToDelete.has(child.id));
                    if (newChildren.length > 0) {
                        newList.push({ ...layer, children: newChildren });
                    }
                } else {
                    newList.push(layer);
                }
            }
            return newList;
        };

        setLayers(mapRecursive);
        setSelectedIds([]);
        if (activeToolPanel === 'selection') {
            setActiveToolPanel('stamp');
            setCurrentTool('stamp');
        }
    };

    const handleGroup = () => {
        const selectedStamps: Stamp[] = [];
        const remainingLayers: Layer[] = [];
        let firstSelectedIndex = -1;

        const flatSelection: Stamp[] = [];
        const findSelectedStamps = (layerList: Layer[]) => {
            layerList.forEach(layer => {
                if (selectedIds.includes(layer.id)) {
                    if (layer.type === 'stamp') {
                        flatSelection.push(layer);
                    }
                } else if (layer.type === 'group') {
                    findSelectedStamps(layer.children);
                }
            });
        };
        findSelectedStamps(layers);

        if (flatSelection.length < 2) return;

        const newGroup: Group = {
            id: `group-${Date.now()}`,
            type: 'group',
            name: 'New Group',
            isCollapsed: false,
            isRenaming: false,
            children: flatSelection,
        };
        
        const selectionIds = new Set(selectedIds);
        const removeOldStamps = (layerList: Layer[]): Layer[] => {
            const newList: Layer[] = [];
            layerList.forEach(layer => {
                 if(selectionIds.has(layer.id) && layer.type === 'stamp') return;
                 if(layer.type === 'group'){
                     const newChildren = layer.children.filter(c => !selectionIds.has(c.id));
                     if(newChildren.length > 0){
                         newList.push({...layer, children: newChildren});
                     }
                 } else {
                     newList.push(layer);
                 }
            });
            return newList;
        };

        const newLayers = removeOldStamps(layers);
        newLayers.unshift(newGroup);

        setLayers(newLayers);
        setSelectedIds([newGroup.id]);
    };
    
    const handleUngroup = () => {
        if(selectedIds.length !== 1) return;
        const groupId = selectedIds[0];
        const group = layers.find(l => l.id === groupId && l.type === 'group') as Group | undefined;
        if(!group) return;

        const newLayers: Layer[] = [];
        let newSelection: string[] = group.children.map(c => c.id);

        layers.forEach(layer => {
            if(layer.id === groupId){
                newLayers.push(...group.children);
            } else {
                newLayers.push(layer);
            }
        });
        setLayers(newLayers);
        setSelectedIds(newSelection);
    }
    
    const handleLayerSelect = (id: string, e: React.MouseEvent) => {
        if (e.shiftKey) {
            setSelectedIds(prev => {
                const newSelectedIds = prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id];
                if (newSelectedIds.length > 0) {
                    setActiveToolPanel('selection');
                } else if (activeToolPanel === 'selection') {
                    setActiveToolPanel('stamp');
                    setCurrentTool('stamp');
                }
                return newSelectedIds;
            });
        } else {
            setSelectedIds([id]);
            setActiveToolPanel('selection');
        }
    };
    
    const handleRename = (id: string, newName: string) => {
        const mapRecursive = (layerList: Layer[]): Layer[] => {
            return layerList.map(layer => {
                if (layer.id === id && layer.type === 'group') {
                    return { ...layer, name: newName, isRenaming: false };
                }
                if (layer.type === 'group') {
                     return { ...layer, children: mapRecursive(layer.children) };
                }
                return layer;
            });
        };
        setLayers(mapRecursive);
    };

    const toggleRename = (id: string) => {
         const mapRecursive = (layerList: Layer[]): Layer[] => {
            return layerList.map(layer => {
                if (layer.id === id && layer.type === 'group') {
                    return { ...layer, isRenaming: !layer.isRenaming };
                }
                 if (layer.type === 'group') {
                     return { ...layer, children: mapRecursive(layer.children) };
                 }
                return layer;
            });
        };
        setLayers(mapRecursive);
    };

    const toggleCollapse = (id: string) => {
        const mapRecursive = (layerList: Layer[]): Layer[] => {
            return layerList.map(layer => {
                if(layer.id === id && layer.type === 'group') {
                    return {...layer, isCollapsed: !layer.isCollapsed};
                }
                if(layer.type === 'group'){
                    return {...layer, children: mapRecursive(layer.children)};
                }
                return layer;
            });
        };
        setLayers(mapRecursive);
    };
    
    const handleDragStart = (e: React.DragEvent, layer: Layer) => {
        e.stopPropagation();
        e.dataTransfer.setData('text/plain', layer.id);
        e.dataTransfer.effectAllowed = 'move';
        setDraggedItemId(layer.id);
    };

    const handleDragEnd = () => {
        setDraggedItemId(null);
        setDropTargetId(null);
    };

    const handleDragOver = (e: React.DragEvent, targetGroup: Group) => {
        e.preventDefault();
        e.stopPropagation();
        if (draggedItemId && draggedItemId !== targetGroup.id && dropTargetId !== targetGroup.id) {
             setDropTargetId(targetGroup.id);
        }
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDropTargetId(null);
    };

    const handleDrop = (e: React.DragEvent, targetGroupId: string) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!draggedItemId) return;

        const droppedItemId = draggedItemId;
        handleDragEnd();
        
        if (droppedItemId === targetGroupId) return;

        let draggedItem: Layer | null = null;
        
        const removeItemRecursively = (layerList: Layer[], id: string): Layer[] => {
            return layerList.reduce((acc, layer) => {
                if (layer.id === id) {
                    draggedItem = layer;
                    return acc;
                }
                if (layer.type === 'group') {
                    acc.push({ ...layer, children: removeItemRecursively(layer.children, id) });
                } else {
                    acc.push(layer);
                }
                return acc;
            }, [] as Layer[]);
        };
        
        const layersAfterRemoval = removeItemRecursively(layers, droppedItemId);

        if (!draggedItem) return;

        const isDescendant = (parent: Group, childId: string): boolean => {
            return parent.children.some(child => child.id === childId || (child.type === 'group' && isDescendant(child, childId)));
        };

        if (draggedItem.type === 'group' && isDescendant(draggedItem, targetGroupId)) {
            console.error("Cannot drop a group into its own descendant.");
            return; 
        }

        const addItemRecursively = (layerList: Layer[], targetId: string, itemToAdd: Layer): Layer[] => {
            return layerList.map(layer => {
                if (layer.id === targetId && layer.type === 'group') {
                    return { ...layer, isCollapsed: false, children: [itemToAdd, ...layer.children] };
                }
                if (layer.type === 'group') {
                    return { ...layer, children: addItemRecursively(layer.children, targetId, itemToAdd) };
                }
                return layer;
            });
        };
        
        const newLayers = addItemRecursively(layersAfterRemoval, targetGroupId, draggedItem);
        setLayers(newLayers);
    };
    
    let panelTitle = activeToolPanel ? panelTitles[activeToolPanel] : '';
    if (activeToolPanel === 'selection') {
        panelTitle = selectedStamp ? 'Placement Settings' : 'Layer Properties';
    }

  return (
    <>
      <DynamicSVGFilters effects={maskEffects} renderScale={renderScale} />
      {isCursorVisible && isBrushToolActive && <div className="brush-cursor" style={cursorStyle} />}
      
      <Toolbar activeToolPanel={activeToolPanel} onToolSelect={handleToolSelect} />

      {activeToolPanel && (
        <ToolPanel title={panelTitle} onClose={() => setActiveToolPanel(null)}>
            {activeToolPanel === 'settings' && (
                <SettingsToolPanel 
                    inputWidth={inputWidth}
                    setInputWidth={setInputWidth}
                    inputHeight={inputHeight}
                    setInputHeight={setInputHeight}
                    handleApplySize={handleApplySize}
                    viewportDpi={viewportDpi}
                    setViewportDpi={setViewportDpi}
                />
            )}
            {activeToolPanel === 'mask' && (
                <MaskToolPanel 
                    maskBrushMode={maskBrushMode}
                    setMaskBrushMode={setMaskBrushMode}
                    maskBrushShape={maskBrushShape}
                    setMaskBrushShape={setMaskBrushShape}
                    brushSize={brushSize}
                    setBrushSize={setBrushSize}
                    maskRoughness={maskRoughness}
                    setMaskRoughness={setMaskRoughness}
                    maskEffects={maskEffects}
                    setMaskEffects={setMaskEffects}
                    handleEffectChange={handleEffectChange}
                />
            )}
            {activeToolPanel === 'brush' && (
                <BrushToolPanel
                    brushTargetLayer={brushTargetLayer}
                    setBrushTargetLayer={setBrushTargetLayer}
                    brushShape={brushShape}
                    setBrushShape={setBrushShape}
                    brushSize={brushSize}
                    setBrushSize={setBrushSize}
                    brushHardness={brushHardness}
                    setBrushHardness={setBrushHardness}
                    brushOpacity={brushOpacity}
                    setBrushOpacity={setBrushOpacity}
                    brushTextures={brushTextures}
                    activeBrushTextureSrc={activeBrushTextureSrc}
                    setActiveBrushTextureSrc={setActiveBrushTextureSrc}
                    brushTextureScale={brushTextureScale}
                    setBrushTextureScale={setBrushTextureScale}
                    brushHue={brushHue}
                    setBrushHue={setBrushHue}
                    brushSaturation={brushSaturation}
                    setBrushSaturation={setBrushSaturation}
                    brushBrightness={brushBrightness}
                    setBrushBrightness={setBrushBrightness}
                    brushContrast={brushContrast}
                    setBrushContrast={setBrushContrast}
                />
            )}
            {activeToolPanel === 'stamp' && (
                <StampToolPanel
                    activeCatalogCategory={activeCatalogCategory}
                    setActiveCatalogCategory={setActiveCatalogCategory}
                    stampAssets={stampAssets}
                    activeStampSrc={activeStampSrc}
                    setActiveStampSrc={setActiveStampSrc}
                    placementScale={placementScale}
                    setPlacementScale={setPlacementScale}
                    placementRotation={placementRotation}
                    setPlacementRotation={setPlacementRotation}
                />
            )}
            {activeToolPanel === 'grid' && (
                <GridToolPanel
                    showGrid={showGrid}
                    setShowGrid={setShowGrid}
                    gridShape={gridShape}
                    setGridShape={setGridShape}
                    gridColumns={gridColumns}
                    setGridColumns={setGridColumns}
                    gridRows={gridRows}
                    setGridRows={setGridRows}
                    canvasSize={canvasSize}
                />
            )}
             {activeToolPanel === 'assets' && (
                <AssetsToolPanel
                    insertionCategory={insertionCategory}
                    setInsertionCategory={setInsertionCategory}
                    assetLink={assetLink}
                    setAssetLink={setAssetLink}
                    handleInsertStampAsset={handleInsertStampAsset}
                />
             )}
             {activeToolPanel === 'export' && (
                <ExportToolPanel
                    exportDpi={exportDpi}
                    setExportDpi={setExportDpi}
                    handleExportWebP={handleExportWebP}
                    handleExportNavJson={handleExportNavJson}
                />
             )}
             {activeToolPanel === 'selection' && selectedIds.length > 0 && (
                <SelectionToolPanel
                    selectedStamp={selectedStamp}
                    selectedLayer={selectedLayer}
                    selectedIds={selectedIds}
                    stampClipboard={stampClipboard}
                    handleGroup={handleGroup}
                    handleUngroup={handleUngroup}
                    handleDelete={handleDelete}
                    updateSelectedStamp={updateSelectedStamp}
                    handleStampLayerOrder={handleStampLayerOrder}
                    handleStampCopy={handleStampCopy}
                    handleStampPaste={handleStampPaste}
                />
             )}
        </ToolPanel>
      )}

      <main ref={mapContainerRef} style={mainStyle} className={`map-container tool-${currentTool}`} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove} onMouseEnter={() => setIsCursorVisible(true)} onMouseLeave={() => { setIsCursorVisible(false); handleMouseUp(); }} onWheel={handleWheel}>
        <div className="map-content" style={{ width: `${width}px`, height: `${height}px`, transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})` }}>
            <canvas ref={backgroundCanvasRef} width={width * renderScale} height={height * renderScale} className="background-canvas" style={{ width: width, height: height }} />
            <canvas ref={effectsCanvasRef} width={width * renderScale} height={height * renderScale} className="effects-canvas" style={{ width: width, height: height }} />
            <canvas ref={foregroundCanvasRef} width={width * renderScale} height={height * renderScale} className="foreground-canvas" style={{ width: width, height: height }} />
            <canvas ref={topLayerCanvasRef} width={width * renderScale} height={height * renderScale} className="top-layer-canvas" style={{ width: width, height: height }} />
            <canvas ref={brushTopLayerCanvasRef} width={width * renderScale} height={height * renderScale} className="brush-top-layer-canvas" style={{ width: width, height: height }} />
            <canvas ref={gridCanvasRef} width={width * renderScale} height={height * renderScale} className="grid-canvas" style={{ width: width, height: height }} />
        </div>
      </main>
      
      <LayersPanel
        isRightSidebarOpen={isRightSidebarOpen}
        layers={layers}
        selectedIds={selectedIds}
        draggedItemId={draggedItemId}
        dropTargetId={dropTargetId}
        handleGroup={handleGroup}
        handleDragStart={handleDragStart}
        handleDragEnd={handleDragEnd}
        handleDragOver={handleDragOver}
        handleDragLeave={handleDragLeave}
        handleDrop={handleDrop}
        handleLayerSelect={handleLayerSelect}
        toggleCollapse={toggleCollapse}
        toggleRename={toggleRename}
        handleRename={handleRename}
      />

      <button className="sidebar-toggle right-toggle" onClick={() => setRightSidebarOpen(!isRightSidebarOpen)} aria-label={isRightSidebarOpen ? 'Collapse layers panel' : 'Expand layers panel'} aria-expanded={isRightSidebarOpen}> {isRightSidebarOpen ? '>' : '<'} </button>
    </>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);