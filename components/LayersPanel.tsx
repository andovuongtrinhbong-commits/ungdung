import React from 'react';
import { Layer, Stamp, Group } from '../types';
import { ChevronIcon } from './Icons';

interface LayersPanelProps {
    isRightSidebarOpen: boolean;
    layers: Layer[];
    selectedIds: string[];
    draggedItemId: string | null;
    dropTargetId: string | null;
    
    handleGroup: () => void;
    handleDragStart: (e: React.DragEvent, layer: Layer) => void;
    handleDragEnd: () => void;
    handleDragOver: (e: React.DragEvent, targetGroup: Group) => void;
    handleDragLeave: (e: React.DragEvent) => void;
    handleDrop: (e: React.DragEvent, targetGroupId: string) => void;
    handleLayerSelect: (id: string, e: React.MouseEvent) => void;
    toggleCollapse: (id: string) => void;
    toggleRename: (id: string) => void;
    handleRename: (id: string, newName: string) => void;
}

export const LayersPanel: React.FC<LayersPanelProps> = ({
    isRightSidebarOpen,
    layers,
    selectedIds,
    draggedItemId,
    dropTargetId,
    handleGroup,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleLayerSelect,
    toggleCollapse,
    toggleRename,
    handleRename,
}) => {
    const renderLayer = (layer: Layer, level: number): React.ReactNode => {
        const isSelected = selectedIds.includes(layer.id);
        const isDragging = draggedItemId === layer.id;
        if (layer.type === 'group') {
            const isDropTarget = dropTargetId === layer.id;
            return (
                <React.Fragment key={layer.id}>
                    <div
                        draggable
                        onDragStart={(e) => handleDragStart(e, layer)}
                        onDragEnd={handleDragEnd}
                        onDragOver={(e) => handleDragOver(e, layer)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, layer.id)}
                        className={`layer-item group ${isSelected ? 'active' : ''} ${isDragging ? 'dragging' : ''} ${isDropTarget ? 'drop-target' : ''}`}
                        onClick={(e) => handleLayerSelect(layer.id, e)}
                        style={{ paddingLeft: `${1 + level * 1.5}rem` }}
                    >
                        <button className="collapse-toggle" onClick={(e) => { e.stopPropagation(); toggleCollapse(layer.id); }}>
                            <ChevronIcon isCollapsed={layer.isCollapsed} />
                        </button>
                        {layer.isRenaming ? (
                            <input
                                type="text"
                                defaultValue={layer.name}
                                className="layer-rename-input"
                                autoFocus
                                onBlur={(e) => handleRename(layer.id, e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleRename(layer.id, e.currentTarget.value);
                                    if (e.key === 'Escape') toggleRename(layer.id);
                                }}
                                onClick={e => e.stopPropagation()}
                            />
                        ) : (
                            <span className="layer-item-name" onDoubleClick={(e) => { e.stopPropagation(); toggleRename(layer.id); }}>{layer.name}</span>
                        )}
                    </div>
                    {!layer.isCollapsed && layer.children.map(child => renderLayer(child, level + 1))}
                </React.Fragment>
            );
        } else { // Stamp
            return (
                <div
                    key={layer.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, layer)}
                    onDragEnd={handleDragEnd}
                    className={`layer-item ${isSelected ? 'active' : ''} ${isDragging ? 'dragging' : ''}`}
                    onClick={(e) => handleLayerSelect(layer.id, e)}
                    role="button"
                    tabIndex={0}
                    style={{ paddingLeft: `${1 + level * 1.5}rem` }}
                >
                    <img src={layer.src} alt="stamp thumbnail" className="layer-item-thumbnail" />
                    <span className="layer-item-name">{layer.src.split('/').pop()?.split('.')[0]}</span>
                </div>
            );
        }
    };

    return (
        <aside className={`sidebar right-sidebar ${isRightSidebarOpen ? '' : 'closed'}`}>
            <div className="sidebar-content">
                <div className="layers-header">
                    <h2>Layers</h2>
                    {selectedIds.length > 1 && (
                        <button onClick={handleGroup}>Group Selection</button>
                    )}
                </div>
                <div className="layer-list">
                    {layers.length > 0 ? (
                        [...layers].reverse().map(layer => renderLayer(layer, 0))
                    ) : (
                        <p className="no-layers-message">No objects have been placed.</p>
                    )}
                </div>
            </div>
        </aside>
    );
}