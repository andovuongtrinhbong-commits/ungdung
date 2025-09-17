import React, { useState, useCallback } from 'react';
import { Stamp, Group, Layer, Tool } from '../types';

interface LayerManagerProps {
    getTransformedPoint: (x: number, y: number) => { x: number, y: number };
    cursorPosition: { x: number, y: number };
}

export const useLayerManager = ({ getTransformedPoint, cursorPosition }: LayerManagerProps) => {
    const [layers, setLayers] = useState<Layer[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [lastClickedLayerId, setLastClickedLayerId] = useState<string | null>(null);
    const [stampClipboard, setStampClipboard] = useState<Omit<Stamp, 'id' | 'x' | 'y' | 'type'> | null>(null);
    const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
    const [dropTargetId, setDropTargetId] = useState<string | null>(null);

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

    const handleDelete = (activeToolPanel: Tool | null, setActiveToolPanel: (tool: Tool | null) => void, setCurrentTool: (tool: Tool) => void) => {
        if (selectedIds.length === 0) return;

        const idsToDelete = new Set(selectedIds);
        const filterRecursive = (layerList: Layer[]): Layer[] => {
            return layerList
                .filter(layer => !idsToDelete.has(layer.id))
                .map(layer => {
                    if (layer.type === 'group') {
                        return { ...layer, children: filterRecursive(layer.children) };
                    }
                    return layer;
                });
        };

        setLayers(filterRecursive);
        setSelectedIds([]);
        if (activeToolPanel === 'selection') {
            setActiveToolPanel('stamp');
            setCurrentTool('stamp');
        }
    };

    const handleGroup = () => {
        if (selectedIds.length < 2) return;

        const selectionSet = new Set(selectedIds);
        const itemsToGroup: Layer[] = [];

        const findAndCollect = (tree: Layer[]): Layer[] => {
            const remaining: Layer[] = [];
            for (const item of tree) {
                if (selectionSet.has(item.id)) {
                    itemsToGroup.push(item);
                } else {
                    if (item.type === 'group') {
                        const newChildren = findAndCollect(item.children);
                        remaining.push({ ...item, children: newChildren });
                    } else {
                        remaining.push(item);
                    }
                }
            }
            return remaining;
        };

        const layersAfterRemoval = findAndCollect(layers);
        const newGroup: Group = {
            id: `group-${Date.now()}`,
            type: 'group',
            name: 'New Group',
            isCollapsed: false,
            isRenaming: false,
            children: itemsToGroup,
        };

        setLayers(prev => [...prev.filter(l => !selectionSet.has(l.id)), newGroup]);
        setSelectedIds([newGroup.id]);
    };
    
    const handleUngroup = () => {
        if(selectedIds.length !== 1) return;
        const groupId = selectedIds[0];

        let groupToUngroup: Group | null = null;
        
        const findAndReplace = (tree: Layer[]): Layer[] => {
            const result: Layer[] = [];
            for(const item of tree) {
                if(item.id === groupId && item.type === 'group') {
                    groupToUngroup = item;
                    result.push(...item.children);
                } else {
                    if(item.type === 'group') {
                        result.push({ ...item, children: findAndReplace(item.children) });
                    } else {
                        result.push(item);
                    }
                }
            }
            return result;
        }

        const newLayers = findAndReplace(layers);

        if (groupToUngroup) {
            setLayers(newLayers);
            setSelectedIds(groupToUngroup.children.map(c => c.id));
        }
    };

    const handleStampLayerOrder = (direction: 'forward' | 'backward') => {
      if (selectedIds.length !== 1) return;
      const selectedId = selectedIds[0];
      const move = (arr: Layer[], fromIndex: number, toIndex: number) => {
          const element = arr[fromIndex];
          arr.splice(fromIndex, 1);
          arr.splice(toIndex, 0, element);
      };
      const mapRecursive = (layerList: Layer[]): Layer[] => {
          const index = layerList.findIndex(l => l.id === selectedId);
          if (index !== -1) {
              const newLayers = [...layerList];
              if (direction === 'forward' && index < newLayers.length - 1) move(newLayers, index, index + 1);
              else if (direction === 'backward' && index > 0) move(newLayers, index, index - 1);
              return newLayers;
          }
          return layerList.map(l => l.type === 'group' ? { ...l, children: mapRecursive(l.children) } : l);
      };
      setLayers(mapRecursive);
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

    const handleLayerSelect = (id: string, e: React.MouseEvent, activeToolPanel: Tool | null, setActiveToolPanel: (tool: Tool | null) => void, currentTool: Tool) => {
        const isCtrlOrCmd = e.ctrlKey || e.metaKey;

        const getFlatVisibleLayers = (layerTree: Layer[]): Layer[] => {
            const result: Layer[] = [];
            const recurse = (currentLayers: Layer[]) => {
                [...currentLayers].reverse().forEach(layer => {
                    result.push(layer);
                    if (layer.type === 'group' && !layer.isCollapsed) {
                        recurse(layer.children);
                    }
                });
            };
            recurse(layers);
            return result;
        };

        if (e.shiftKey && lastClickedLayerId) {
            const flatLayers = getFlatVisibleLayers(layers);
            const lastIndex = flatLayers.findIndex(l => l.id === lastClickedLayerId);
            const currentIndex = flatLayers.findIndex(l => l.id === id);

            if (lastIndex !== -1 && currentIndex !== -1) {
                const start = Math.min(lastIndex, currentIndex);
                const end = Math.max(lastIndex, currentIndex);
                const rangeIds = flatLayers.slice(start, end + 1).map(l => l.id);
                setSelectedIds(rangeIds);
                setActiveToolPanel('selection');
            }
        } else if (isCtrlOrCmd) {
            setSelectedIds(prev => {
                const newSelectedIds = prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id];
                if (newSelectedIds.length > 0) {
                    setActiveToolPanel('selection');
                } else if (activeToolPanel === 'selection') {
                    setActiveToolPanel(currentTool === 'stamp' ? 'stamp' : null);
                }
                return newSelectedIds;
            });
            setLastClickedLayerId(id);
        } else {
            setSelectedIds([id]);
            setLastClickedLayerId(id);
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
        
        if (!draggedItemId || draggedItemId === targetGroupId) {
            handleDragEnd();
            return;
        }

        let draggedItem: Layer | null = null;
        
        const removeItem = (tree: Layer[], id: string): Layer[] => {
            return tree.filter(item => {
                if (item.id === id) {
                    draggedItem = item;
                    return false;
                }
                if (item.type === 'group') {
                    item.children = removeItem(item.children, id);
                }
                return true;
            });
        };
        
        const layersAfterRemoval = removeItem(layers, draggedItemId);
        if (!draggedItem) { handleDragEnd(); return; }

        const addItem = (tree: Layer[], targetId: string, itemToAdd: Layer): Layer[] => {
            return tree.map(item => {
                if (item.id === targetId && item.type === 'group') {
                    return { ...item, isCollapsed: false, children: [itemToAdd, ...item.children] };
                }
                if (item.type === 'group') {
                    return { ...item, children: addItem(item.children, targetId, itemToAdd) };
                }
                return item;
            });
        };
        
        const newLayers = addItem(layersAfterRemoval, targetGroupId, draggedItem);
        setLayers(newLayers);
        handleDragEnd();
    };
    
    const handleCreateEmptyGroup = () => {
        const newGroup: Group = {
            id: `group-${Date.now()}`,
            type: 'group',
            name: 'New Group',
            isCollapsed: false,
            isRenaming: false,
            children: [],
        };
        setLayers(prev => [newGroup, ...prev]);
        setSelectedIds([newGroup.id]);
    };

    return {
        layers, setLayers,
        selectedIds, setSelectedIds,
        lastClickedLayerId,
        stampClipboard,
        draggedItemId,
        dropTargetId,
        flattenLayers,
        selectedLayer, selectedStamp,
        updateSelectedStamp,
        handleDelete,
        handleGroup,
        handleUngroup,
        handleStampLayerOrder,
        handleStampCopy,
        handleStampPaste,
        handleLayerSelect,
        handleRename,
        toggleRename,
        toggleCollapse,
        handleDragStart,
        handleDragEnd,
        handleDragOver,
        handleDragLeave,
        handleDrop,
        handleCreateEmptyGroup,
    };
};
