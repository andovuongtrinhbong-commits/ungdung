import React from 'react';
import { BrushLayer, BrushShape, Texture } from '../../types';
import { EnhancedSlider } from '../EnhancedSlider';

interface BrushToolPanelProps {
    brushTargetLayer: BrushLayer;
    setBrushTargetLayer: (layer: BrushLayer) => void;
    brushShape: BrushShape;
    setBrushShape: (shape: BrushShape) => void;
    brushSize: number;
    setBrushSize: (size: number) => void;
    brushHardness: number;
    setBrushHardness: (hardness: number) => void;
    brushOpacity: number;
    setBrushOpacity: (opacity: number) => void;
    brushTextures: Texture[];
    activeBrushTextureSrc: string | null;
    setActiveBrushTextureSrc: (src: string | null) => void;
    brushTextureScale: number;
    setBrushTextureScale: (scale: number) => void;
    brushHue: number;
    setBrushHue: (hue: number) => void;
    brushSaturation: number;
    setBrushSaturation: (saturation: number) => void;
    brushBrightness: number;
    setBrushBrightness: (brightness: number) => void;
    brushContrast: number;
    setBrushContrast: (contrast: number) => void;
}

export const BrushToolPanel: React.FC<BrushToolPanelProps> = ({
    brushTargetLayer,
    setBrushTargetLayer,
    brushShape,
    setBrushShape,
    brushSize,
    setBrushSize,
    brushHardness,
    setBrushHardness,
    brushOpacity,
    setBrushOpacity,
    brushTextures,
    activeBrushTextureSrc,
    setActiveBrushTextureSrc,
    brushTextureScale,
    setBrushTextureScale,
    brushHue,
    setBrushHue,
    brushSaturation,
    setBrushSaturation,
    brushBrightness,
    setBrushBrightness,
    brushContrast,
    setBrushContrast,
}) => {
    return (
        <div className="control-group brush-controls">
            <h3>Brush Settings</h3>
            <div className="control-group">
                <h4>Target Layer</h4>
                <div className="three-button-selector">
                    <button className={brushTargetLayer === 'background' ? 'active' : ''} onClick={() => setBrushTargetLayer('background')}>BG</button>
                    <button className={brushTargetLayer === 'foreground' ? 'active' : ''} onClick={() => setBrushTargetLayer('foreground')}>FG</button>
                    <button className={brushTargetLayer === 'top' ? 'active' : ''} onClick={() => setBrushTargetLayer('top')}>Top</button>
                </div>
            </div>
            <div className="control-group">
                <h4>Shape</h4>
                <div className="mode-selector">
                    <button className={brushShape === 'circle' ? 'active' : ''} onClick={() => setBrushShape('circle')}>Circle</button>
                    <button className={brushShape === 'square' ? 'active' : ''} onClick={() => setBrushShape('square')}>Square</button>
                </div>
            </div>
            <EnhancedSlider label="Size" value={brushSize} onChange={setBrushSize} min={1} max={200} unit="px" />
            <EnhancedSlider label="Độ mờ" value={brushHardness} onChange={setBrushHardness} min={0} max={1} step={0.01} disabled={brushShape !== 'circle'} />
            <EnhancedSlider label="Trong suốt" value={brushOpacity} onChange={setBrushOpacity} min={0} max={1} step={0.01} />
            
            <div className="control-group">
                <h4>Texture</h4>
                <div className="texture-palette">
                    {brushTextures.map(texture => (
                        <img
                            key={texture.src}
                            src={texture.src}
                            alt="Brush Texture"
                            className={`texture-thumbnail ${activeBrushTextureSrc === texture.src ? 'active' : ''}`}
                            onClick={() => setActiveBrushTextureSrc(texture.src)}
                        />
                    ))}
                </div>
            </div>
            <div className="control-group">
                <h4>Texture Adjustments</h4>
                <EnhancedSlider label="Texture Scale" value={brushTextureScale} onChange={setBrushTextureScale} min={20} max={300} unit="px" />
                <EnhancedSlider label="Sắc độ" value={brushHue} onChange={setBrushHue} min={0} max={360} unit="°" className="hue-slider" />
                <EnhancedSlider label="Độ rực màu" value={brushSaturation} onChange={setBrushSaturation} min={0} max={200} unit="%" />
                <EnhancedSlider label="Độ sáng tối" value={brushBrightness} onChange={setBrushBrightness} min={0} max={200} unit="%" />
                <EnhancedSlider label="Tương phản" value={brushContrast} onChange={setBrushContrast} min={0} max={200} unit="%" />
            </div>
        </div>
    );
};