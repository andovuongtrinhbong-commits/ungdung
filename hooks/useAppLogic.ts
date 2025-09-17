import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Tool, Stamp, Layer, ProjectData } from '../types';
import { useAssetLoader } from './useAssetLoader';
import { useCanvasState } from './useCanvasState';
import { useToolPanels } from './useToolPanels';
import { useLayerManager } from './useLayerManager';
import { useDrawingAndEffects } from './useDrawingAndEffects';

export const useAppLogic = () => {
    // 1. Instantiate independent hooks
    const assets = useAssetLoader();
    const canvas = useCanvasState();

    // 2. Define interaction state and refs that live in the orchestrator
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
    const [isCursorVisible, setIsCursorVisible] = useState(false);
    const [selectionBox, setSelectionBox] = useState<{ x: number, y: number, width: number, height: number } | null>(null);
    const isDrawing = useRef(false);
    const isPanning = useRef(false);
    const isDraggingStamp = useRef(false);
    const isMarqueeSelecting = useRef(false);
    const marqueeStartPos = useRef({ x: 0, y: 0 });
    const lastMousePosition = useRef({ x: 0, y: 0 });

    const getTransformedPoint = useCallback((clientX: number, clientY: number) => {
        if (!canvas.mapContainerRef.current) return { x: 0, y: 0 };
        const rect = canvas.mapContainerRef.current.getBoundingClientRect();
        const x = (clientX - rect.left - canvas.transform.x) / canvas.transform.scale;
        const y = (clientY - rect.top - canvas.transform.y) / canvas.transform.scale;
        return { x, y };
    }, [canvas.transform, canvas.mapContainerRef]);
    
    // 3. Instantiate dependent hooks, passing in state from other hooks
    const layerManager = useLayerManager({ 
        getTransformedPoint, 
        cursorPosition, 
    });

    const toolPanels = useToolPanels({
        stampAssets: assets.stampAssets,
        layers: layerManager.layers,
        flattenLayers: layerManager.flattenLayers,
        width: canvas.canvasSize.width,
        height: canvas.canvasSize.height,
        setSelectedIds: layerManager.setSelectedIds,
        ...canvas,
    });
    
    // 4. Instantiate the drawing hook with all necessary state
    const drawing = useDrawingAndEffects({
        ...canvas,
        ...assets,
        ...toolPanels,
        ...layerManager,
    });

    // 5. Connect asset loading to tool panels
    useEffect(() => {
        if (assets.brushTextures.length > 0 && !toolPanels.activeBrushTextureSrc) {
            toolPanels.setActiveBrushTextureSrc(assets.brushTextures[0].src);
        }
    }, [assets.brushTextures, toolPanels.activeBrushTextureSrc, toolPanels.setActiveBrushTextureSrc]);

    // 6. Define main interaction handlers (mouse events)
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
      if (e.button === 1) { // Middle mouse button for panning
        e.preventDefault();
        isPanning.current = true;
        lastMousePosition.current = { x: e.clientX, y: e.clientY };
        if (canvas.mapContainerRef.current) canvas.mapContainerRef.current.classList.add('panning');
        return;
      }
      
      const point = getTransformedPoint(e.clientX, e.clientY);
      lastMousePosition.current = point;
  
      if (toolPanels.currentTool === 'mask') {
        isDrawing.current = true;
        drawing.drawOnMaskCanvas(point);
      } else if (toolPanels.currentTool === 'brush') {
        isDrawing.current = true;
        drawing.drawWithBrush(point);
      } else if (toolPanels.currentTool === 'stamp' || toolPanels.currentTool === 'selection') {
        const allStamps = layerManager.flattenLayers(layerManager.layers);
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
            layerManager.handleLayerSelect(hitStampId, e, toolPanels.activeToolPanel, toolPanels.setActiveToolPanel, toolPanels.currentTool);
            isDraggingStamp.current = true;
        } else {
          if (toolPanels.currentTool === 'selection') {
              isMarqueeSelecting.current = true;
              marqueeStartPos.current = { x: e.clientX, y: e.clientY };
              setSelectionBox({ x: e.clientX, y: e.clientY, width: 0, height: 0 });
          } else if (toolPanels.currentTool === 'stamp' && toolPanels.activeStampSrc) {
            const img = assets.stampAssets.find(t => t.src === toolPanels.activeStampSrc)?.img;
            if (img) {
              const newStamp: Stamp = {
                id: `${Date.now()}-${Math.random()}`,
                type: 'stamp',
                src: toolPanels.activeStampSrc,
                x: point.x - (img.naturalWidth * toolPanels.placementScale / 2),
                y: point.y - (img.naturalHeight * toolPanels.placementScale / 2),
                width: img.naturalWidth,
                height: img.naturalHeight,
                scale: toolPanels.placementScale,
                rotation: toolPanels.placementRotation,
                opacity: 1,
                flipH: false,
                hue: 0,
                saturation: 100,
              };
              layerManager.setLayers(prev => [...prev, newStamp]);
              layerManager.setSelectedIds([newStamp.id]);
              toolPanels.setActiveToolPanel('selection');
            }
          } else {
              const isCtrlOrCmd = e.ctrlKey || e.metaKey;
              const isShift = e.shiftKey;
              if (!isCtrlOrCmd && !isShift) {
                  const hadSelection = layerManager.selectedIds.length > 0;
                  layerManager.setSelectedIds([]);
                   if (hadSelection && toolPanels.activeToolPanel === 'selection' && toolPanels.currentTool === 'stamp') {
                      toolPanels.setActiveToolPanel('stamp');
                  }
              }
          }
        }
      }
    }, [
        getTransformedPoint, toolPanels.currentTool, drawing.drawOnMaskCanvas, drawing.drawWithBrush, 
        layerManager, toolPanels.activeStampSrc, assets.stampAssets, 
        toolPanels.placementScale, toolPanels.placementRotation, toolPanels.activeToolPanel,
        toolPanels.setActiveToolPanel, canvas.mapContainerRef
    ]);

    const handleMouseUp = useCallback((e: React.MouseEvent) => {
      if (isMarqueeSelecting.current && selectionBox) {
          const startPoint = getTransformedPoint(selectionBox.x, selectionBox.y);
          const endPoint = getTransformedPoint(selectionBox.x + selectionBox.width, selectionBox.y + selectionBox.height);
  
          const selectionRect = {
              x: Math.min(startPoint.x, endPoint.x),
              y: Math.min(startPoint.y, endPoint.y),
              width: Math.abs(startPoint.x - endPoint.x),
              height: Math.abs(startPoint.y - endPoint.y),
          };
  
          const allStamps = layerManager.flattenLayers(layerManager.layers);
          const idsInBox = allStamps.filter(stamp => {
              const w = stamp.width * stamp.scale;
              const h = stamp.height * stamp.scale;
              const centerX = stamp.x + w / 2;
              const centerY = stamp.y + h / 2;
              return (
                  centerX >= selectionRect.x &&
                  centerX <= selectionRect.x + selectionRect.width &&
                  centerY >= selectionRect.y &&
                  centerY <= selectionRect.y + selectionRect.height
              );
          }).map(stamp => stamp.id);
  
          const isCtrlOrCmd = e.ctrlKey || e.metaKey;
          const isShift = e.shiftKey;
  
          if (isCtrlOrCmd || isShift) {
              layerManager.setSelectedIds(prev => {
                  const combined = [...prev, ...idsInBox];
                  return [...new Set(combined)];
              });
          } else {
              layerManager.setSelectedIds(idsInBox);
          }
          
          if (idsInBox.length > 0) {
              toolPanels.setActiveToolPanel('selection');
          }
  
          isMarqueeSelecting.current = false;
          setSelectionBox(null);
      }
      
      if (isPanning.current) {
        isPanning.current = false;
        if (canvas.mapContainerRef.current) {
          canvas.mapContainerRef.current.classList.remove('panning');
        }
      }
      if (isDrawing.current && toolPanels.currentTool === 'mask') {
          drawing.applyCoastlineEffects();
      }
      isDrawing.current = false;
      isDraggingStamp.current = false;
    }, [selectionBox, getTransformedPoint, layerManager, drawing.applyCoastlineEffects, toolPanels, canvas.mapContainerRef]);
    
    const handleMouseMove = useCallback((e: React.MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
  
      if (isMarqueeSelecting.current) {
          const { x: startX, y: startY } = marqueeStartPos.current;
          setSelectionBox({ 
              x: Math.min(startX, e.clientX), 
              y: Math.min(startY, e.clientY), 
              width: Math.abs(startX - e.clientX), 
              height: Math.abs(startY - e.clientY) 
          });
          return;
      }
  
      if (isPanning.current) {
          const dx = e.clientX - lastMousePosition.current.x;
          const dy = e.clientY - lastMousePosition.current.y;
          canvas.setTransform(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
          lastMousePosition.current = { x: e.clientX, y: e.clientY };
          return;
      }
  
      const point = getTransformedPoint(e.clientX, e.clientY);

      if (isDrawing.current) {
          if (toolPanels.currentTool === 'mask') drawing.drawOnMaskCanvas(point);
          else if (toolPanels.currentTool === 'brush') drawing.drawWithBrush(point);
      } else if (isDraggingStamp.current && layerManager.selectedIds.length > 0) {
          const dx = point.x - lastMousePosition.current.x;
          const dy = point.y - lastMousePosition.current.y;
          
          const allSelectedStampIds = new Set<string>();
          const findSelectedStampIdsRecursively = (currentLayers: Layer[], isParentSelected: boolean) => {
              for (const layer of currentLayers) {
                  const isSelected = isParentSelected || layerManager.selectedIds.includes(layer.id);
                  if (layer.type === 'stamp' && isSelected) {
                      allSelectedStampIds.add(layer.id);
                  } else if (layer.type === 'group') {
                      findSelectedStampIdsRecursively(layer.children, isSelected);
                  }
              }
          };
          findSelectedStampIdsRecursively(layerManager.layers, false);
  
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
          
          layerManager.setLayers(moveStampsRecursively);
          lastMousePosition.current = point;
      }
    }, [
        getTransformedPoint, toolPanels.currentTool, drawing.drawOnMaskCanvas, drawing.drawWithBrush, 
        layerManager, canvas.setTransform
    ]);

    const handleSaveProject = useCallback(() => {
        if (!canvas.backgroundCanvasRef.current || !canvas.foregroundCanvasRef.current || !canvas.brushTopLayerCanvasRef.current) {
            alert('Canvas not ready for saving.');
            return;
        }

        const projectData: ProjectData = {
            version: '1.0.0',
            canvasSize: canvas.canvasSize,
            layers: layerManager.layers,
            maskDataURL: canvas.foregroundCanvasRef.current.toDataURL('image/png'),
            backgroundDataURL: canvas.backgroundCanvasRef.current.toDataURL('image/png'),
            brushTopDataURL: canvas.brushTopLayerCanvasRef.current.toDataURL('image/png'),
            maskEffects: toolPanels.maskEffects
        };

        const jsonString = JSON.stringify(projectData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `project-${Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, [canvas.canvasSize, layerManager.layers, toolPanels.maskEffects, canvas.backgroundCanvasRef, canvas.foregroundCanvasRef, canvas.brushTopLayerCanvasRef]);

    const handleLoadProject = useCallback(() => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const projectData: ProjectData = JSON.parse(event.target?.result as string);
                    
                    if (!projectData.version || !projectData.canvasSize || !projectData.layers || !projectData.maskDataURL) {
                        throw new Error('Invalid project file format.');
                    }

                    canvas.setCanvasSize(projectData.canvasSize);
                    canvas.setInputWidth(String(projectData.canvasSize.width));
                    canvas.setInputHeight(String(projectData.canvasSize.height));
                    layerManager.setLayers(projectData.layers);
                    layerManager.setSelectedIds([]);
                    toolPanels.setMaskEffects(projectData.maskEffects);

                    const loadImage = (dataURL: string, canvasRef: React.RefObject<HTMLCanvasElement>) => {
                        return new Promise<void>((resolve, reject) => {
                            const canvasEl = canvasRef.current;
                            if (!canvasEl) return reject(new Error('Canvas element not found'));
                            
                            const ctx = canvasEl.getContext('2d');
                            if (!ctx) return reject(new Error('Canvas context not found'));

                            const img = new Image();
                            img.onload = () => {
                                ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
                                ctx.drawImage(img, 0, 0);
                                resolve();
                            };
                            img.onerror = () => reject(new Error('Failed to load image data.'));
                            img.src = dataURL;
                        });
                    };

                    Promise.all([
                        loadImage(projectData.backgroundDataURL, canvas.backgroundCanvasRef),
                        loadImage(projectData.maskDataURL, canvas.foregroundCanvasRef),
                        loadImage(projectData.brushTopDataURL, canvas.brushTopLayerCanvasRef)
                    ]).then(() => {
                        drawing.applyCoastlineEffects();
                    }).catch(error => {
                        console.error('Error loading project canvas data:', error);
                        alert(`Error loading project: ${error.message}`);
                    });

                } catch (error) {
                    console.error('Failed to parse project file:', error);
                    alert('Could not load the project file. It may be corrupted or in an incorrect format.');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }, [canvas, layerManager, toolPanels, drawing]);

    // 7. Return the combined API for the App component
    return {
        ...assets,
        ...canvas,
        ...toolPanels,
        ...layerManager,

        cursorPosition,
        isCursorVisible,
        setIsCursorVisible,
        selectionBox,

        handleMouseDown,
        handleMouseUp,
        handleMouseMove,
        handleSaveProject,
        handleLoadProject,
    };
};