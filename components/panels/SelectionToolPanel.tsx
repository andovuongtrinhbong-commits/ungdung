import React from 'react';
import { Layer, Stamp } from '../../types';
import { DeleteIcon, FlipHorizontalIcon } from '../Icons';
import { EnhancedSlider } from '../EnhancedSlider';

interface SelectionToolPanelProps {
    selectedStamp?: Stamp;
    selectedLayer?: Layer;
    selectedIds: string[];
    stampClipboard: Omit<Stamp, 'id' | 'x' | 'y' | 'type'> | null;
    
    handleGroup: () => void;
    handleUngroup: () => void;
    handleDelete: () => void;
    updateSelectedStamp: (updater: (stamp: Stamp) => Stamp) => void;
    handleStampLayerOrder: (direction: 'forward' | 'backward') => void;
    handleStampCopy: () => void;
    handleStampPaste: () => void;
}


export const SelectionToolPanel: React.FC<SelectionToolPanelProps> = ({
    selectedStamp,
    selectedLayer,
    selectedIds,
    stampClipboard,
    handleGroup,
    handleUngroup,
    handleDelete,
    updateSelectedStamp,
    handleStampLayerOrder,
    handleStampCopy,
    handleStampPaste,
}) => {
    return (
        <div className="control-group selected-stamp-controls">
            {selectedStamp ? (
                <>
                    <EnhancedSlider
                        label="Width"
                        value={Math.round(selectedStamp.width * selectedStamp.scale)}
                        onChange={newWidth => {
                            if (selectedStamp.width > 0) {
                                updateSelectedStamp(s => {
                                    const newScale = newWidth / s.width;
                                    const w_old = s.width * s.scale;
                                    const h_old = s.height * s.scale;
                                    const w_new = s.width * newScale;
                                    const h_new = s.height * newScale;
                                    return { ...s, scale: newScale, x: s.x + (w_old - w_new) / 2, y: s.y + (h_old - h_new) / 2 };
                                });
                            }
                        }}
                        min={10}
                        max={1000}
                        step={1}
                        unit="px"
                    />
                    <EnhancedSlider
                        label="Rotation"
                        value={selectedStamp.rotation}
                        onChange={v => updateSelectedStamp(s => ({ ...s, rotation: v }))}
                        min={0}
                        max={360}
                        unit="°"
                    />
                    <EnhancedSlider
                        label="Opacity"
                        value={selectedStamp.opacity}
                        onChange={v => updateSelectedStamp(s => ({ ...s, opacity: v }))}
                        min={0}
                        max={1}
                        step={0.01}
                    />
                    <EnhancedSlider
                        label="Hue"
                        value={selectedStamp.hue || 0}
                        onChange={v => updateSelectedStamp(s => ({ ...s, hue: v }))}
                        min={0}
                        max={360}
                        unit="°"
                    />
                    <EnhancedSlider
                        label="Saturation"
                        value={selectedStamp.saturation === undefined ? 100 : selectedStamp.saturation}
                        onChange={v => updateSelectedStamp(s => ({ ...s, saturation: v }))}
                        min={0}
                        max={200}
                        unit="%"
                    />
                    <div className="control-group">
                        <div className="button-group">
                            <button onClick={() => handleStampLayerOrder('backward')}>Send Backward</button>
                            <button onClick={() => handleStampLayerOrder('forward')}>Bring Forward</button>
                        </div>
                        <div className="button-group">
                            <button onClick={handleStampCopy} disabled={!selectedStamp}>Copy</button>
                            <button onClick={handleStampPaste} disabled={!stampClipboard}>Paste</button>
                        </div>
                        <div className="button-group">
                            <button style={{ gridColumn: '1 / -1' }} onClick={() => updateSelectedStamp(s => ({ ...s, flipH: !(s.flipH || false) }))} title="Flip Sideways">
                                <FlipHorizontalIcon /> Flip Sideways
                            </button>
                        </div>
                    </div>
                </>
            ) : selectedLayer?.type === 'group' ? (
                <div className="button-group-vertical">
                    <button onClick={handleUngroup}>Ungroup</button>
                </div>
            ) : selectedIds.length > 1 ? (
                 <div className="button-group-vertical">
                    <p className="help-text">{selectedIds.length} items selected.</p>
                    <button onClick={handleGroup}>Group Selection</button>
                </div>
            ) : null }

            <button onClick={handleDelete} className="delete-button">
                <DeleteIcon /> Delete Selection
            </button>
        </div>
    );
};
