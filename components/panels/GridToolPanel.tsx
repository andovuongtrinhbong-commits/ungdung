import React from 'react';
import { GridShape } from '../../types';
import { EnhancedSlider } from '../EnhancedSlider';

interface GridToolPanelProps {
    showGrid: boolean;
    setShowGrid: (show: boolean) => void;
    gridShape: GridShape;
    setGridShape: (shape: GridShape) => void;
    gridColumns: number;
    setGridColumns: (cols: number) => void;
    gridRows: number;
    setGridRows: (rows: number) => void;
    canvasSize: { width: number; height: number; };
}

export const GridToolPanel: React.FC<GridToolPanelProps> = ({
    showGrid,
    setShowGrid,
    gridShape,
    setGridShape,
    gridColumns,
    setGridColumns,
    gridRows,
    setGridRows,
    canvasSize,
}) => {
    return (
        <>
            <div className="control-group">
                <div className="checkbox-control">
                    <input type="checkbox" id="show-grid" checked={showGrid} onChange={e => setShowGrid(e.target.checked)} />
                    <label htmlFor="show-grid">Show Grid</label>
                </div>
            </div>
            {showGrid && (
                <>
                    <div className="control-group">
                        <h4>Shape</h4>
                        <div className="mode-selector">
                            <button className={gridShape === 'square' ? 'active' : ''} onClick={() => setGridShape('square')}>Square</button>
                            <button className={gridShape === 'hexagon' ? 'active' : ''} onClick={() => setGridShape('hexagon')}>Hexagon</button>
                        </div>
                    </div>
                    <EnhancedSlider
                        label="Columns"
                        value={gridColumns}
                        onChange={(newCols) => {
                            setGridColumns(newCols);
                            if (gridShape === 'square') {
                                setGridRows(Math.round(newCols * (canvasSize.height / canvasSize.width)));
                            }
                        }}
                        min={2}
                        max={100}
                    />
                    <EnhancedSlider
                        label="Rows"
                        value={gridRows}
                        onChange={(newRows) => {
                            setGridRows(newRows);
                            if (gridShape === 'square') {
                                setGridColumns(Math.round(newRows * (canvasSize.width / canvasSize.height)));
                            }
                        }}
                        min={2}
                        max={100}
                        disabled={gridShape === 'square'}
                    />
                </>
            )}
        </>
    );
};