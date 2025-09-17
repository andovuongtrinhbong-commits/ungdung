import React from 'react';
import { EnhancedSlider } from '../EnhancedSlider';

interface SettingsToolPanelProps {
    inputWidth: string;
    setInputWidth: (value: string) => void;
    inputHeight: string;
    setInputHeight: (value: string) => void;
    handleApplySize: () => void;
    viewportDpi: number;
    setViewportDpi: (value: number) => void;
    handleSaveProject: () => void;
    handleLoadProject: () => void;
}

export const SettingsToolPanel: React.FC<SettingsToolPanelProps> = ({
    inputWidth,
    setInputWidth,
    inputHeight,
    setInputHeight,
    handleApplySize,
    viewportDpi,
    setViewportDpi,
    handleSaveProject,
    handleLoadProject,
}) => {
    return (
        <>
            <div className="control-group">
                <h3>Image Size</h3>
                <div className="size-inputs">
                    <input
                        type="number"
                        value={inputWidth}
                        onChange={(e) => setInputWidth(e.target.value)}
                        aria-label="Canvas Width"
                    />
                    <span>&times;</span>
                    <input
                        type="number"
                        value={inputHeight}
                        onChange={(e) => setInputHeight(e.target.value)}
                        aria-label="Canvas Height"
                    />
                </div>
                <button onClick={handleApplySize} className="apply-button">Apply Size</button>
            </div>
            <div className="control-group">
                <h3>Display Quality</h3>
                <EnhancedSlider
                    label="Viewport DPI"
                    value={viewportDpi}
                    onChange={setViewportDpi}
                    min={72}
                    max={300}
                    step={1}
                    unit="DPI"
                />
                <p className="help-text">Higher values increase sharpness at the cost of performance. Default is 96.</p>
            </div>
            <div className="control-group">
                <h3>Project</h3>
                <div className="button-group-vertical">
                    <button onClick={handleSaveProject}>Save Project</button>
                    <button onClick={handleLoadProject}>Load Project</button>
                </div>
                <p className="help-text">Save your entire project to a JSON file to continue working on it later.</p>
            </div>
        </>
    );
};
