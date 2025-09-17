import React from 'react';
import { BrushMode, BrushShape, MaskEffects } from '../../types';
import { EnhancedSlider } from '../EnhancedSlider';

interface MaskToolPanelProps {
    maskBrushMode: BrushMode;
    setMaskBrushMode: (mode: BrushMode) => void;
    maskBrushShape: BrushShape;
    setMaskBrushShape: (shape: BrushShape) => void;
    brushSize: number;
    setBrushSize: (size: number) => void;
    maskRoughness: number;
    setMaskRoughness: (roughness: number) => void;
    maskEffects: MaskEffects;
    setMaskEffects: React.Dispatch<React.SetStateAction<MaskEffects>>;
    handleEffectChange: (effect: keyof Omit<MaskEffects, 'enabled'>, property: string, value: any) => void;
}

export const MaskToolPanel: React.FC<MaskToolPanelProps> = ({
    maskBrushMode,
    setMaskBrushMode,
    maskBrushShape,
    setMaskBrushShape,
    brushSize,
    setBrushSize,
    maskRoughness,
    setMaskRoughness,
    maskEffects,
    setMaskEffects,
    handleEffectChange
}) => {
    return (
        <>
            <div className="control-group brush-controls">
                <h3>Mask Brush Settings</h3>
                <div className="mode-selector">
                    <button className={maskBrushMode === 'add' ? 'active' : ''} onClick={() => setMaskBrushMode('add')}>Add</button>
                    <button className={maskBrushMode === 'subtract' ? 'active' : ''} onClick={() => setMaskBrushMode('subtract')}>Subtract</button>
                </div>
                <div className="control-group">
                    <h4>Shape</h4>
                    <div className="three-button-selector">
                        <button className={maskBrushShape === 'circle' ? 'active' : ''} onClick={() => setMaskBrushShape('circle')}>Circle</button>
                        <button className={maskBrushShape === 'square' ? 'active' : ''} onClick={() => setMaskBrushShape('square')}>Square</button>
                        <button className={maskBrushShape === 'edge' ? 'active' : ''} onClick={() => setMaskBrushShape('edge')}>Edge</button>
                    </div>
                </div>
                <EnhancedSlider
                    label="Size"
                    value={brushSize}
                    onChange={setBrushSize}
                    min={1}
                    max={200}
                    unit="px"
                />
                <EnhancedSlider
                    label={maskBrushShape === 'edge' ? `Edges` : `Roughness`}
                    value={maskRoughness}
                    onChange={setMaskRoughness}
                    min={maskBrushShape === 'edge' ? 3 : 0}
                    max={maskBrushShape === 'edge' ? 12 : 100}
                    unit={maskBrushShape === 'edge' ? '' : '%'}
                />
            </div>

            <div className="control-group">
                <h3>Mask Effects</h3>
                <div className="checkbox-control">
                    <input type="checkbox" id="enable-effects" checked={maskEffects.enabled} onChange={e => setMaskEffects(p => ({ ...p, enabled: e.target.checked }))} />
                    <label htmlFor="enable-effects">Enable Effects</label>
                </div>
            </div>

            {maskEffects.enabled && (
                <>
                    <div className="control-group effect-group">
                        <div className="checkbox-control">
                            <input type="checkbox" id="enable-ripples" checked={maskEffects.ripples.enabled} onChange={e => handleEffectChange('ripples', 'enabled', e.target.checked)} />
                            <label htmlFor="enable-ripples">Ripples Effect</label>
                        </div>
                        {maskEffects.ripples.enabled && (
                            <>
                                <EnhancedSlider label="Width" value={maskEffects.ripples.width} onChange={v => handleEffectChange('ripples', 'width', v)} min={1} max={100} />
                                <EnhancedSlider label="Count" value={maskEffects.ripples.count} onChange={v => handleEffectChange('ripples', 'count', v)} min={1} max={5} />
                                <EnhancedSlider label="Gap" value={maskEffects.ripples.gap} onChange={v => handleEffectChange('ripples', 'gap', v)} min={1} max={10} />
                            </>
                        )}
                    </div>

                    <div className="control-group effect-group">
                        <div className="checkbox-control with-color">
                            <div>
                                <input type="checkbox" id="enable-stroke" checked={maskEffects.stroke.enabled} onChange={e => handleEffectChange('stroke', 'enabled', e.target.checked)} />
                                <label htmlFor="enable-stroke">Stroke</label>
                            </div>
                            <input type="color" value={maskEffects.stroke.color} onChange={e => handleEffectChange('stroke', 'color', e.target.value)} disabled={!maskEffects.stroke.enabled} />
                        </div>
                        {maskEffects.stroke.enabled && (
                            <EnhancedSlider label="Width" value={maskEffects.stroke.width} onChange={v => handleEffectChange('stroke', 'width', v)} min={0.1} max={5} step={0.1} />
                        )}
                    </div>

                    <div className="control-group effect-group">
                        <div className="checkbox-control with-color">
                            <div>
                                <input type="checkbox" id="enable-outer-shadow" checked={maskEffects.outerShadow.enabled} onChange={e => handleEffectChange('outerShadow', 'enabled', e.target.checked)} />
                                <label htmlFor="enable-outer-shadow">Outer Shadow</label>
                            </div>
                            <input type="color" value={maskEffects.outerShadow.color} onChange={e => handleEffectChange('outerShadow', 'color', e.target.value)} disabled={!maskEffects.outerShadow.enabled} />
                        </div>
                        {maskEffects.outerShadow.enabled && (
                            <>
                                <EnhancedSlider label="Offset X" value={maskEffects.outerShadow.offsetX} onChange={v => handleEffectChange('outerShadow', 'offsetX', v)} min={-10} max={10} />
                                <EnhancedSlider label="Offset Y" value={maskEffects.outerShadow.offsetY} onChange={v => handleEffectChange('outerShadow', 'offsetY', v)} min={-10} max={10} />
                                <EnhancedSlider label="Blur" value={maskEffects.outerShadow.blur} onChange={v => handleEffectChange('outerShadow', 'blur', v)} min={0} max={15} />
                            </>
                        )}
                    </div>

                    <div className="control-group effect-group">
                        <div className="checkbox-control with-color">
                            <div>
                                <input type="checkbox" id="enable-inner-shadow" checked={maskEffects.innerShadow.enabled} onChange={e => handleEffectChange('innerShadow', 'enabled', e.target.checked)} />
                                <label htmlFor="enable-inner-shadow">Inner Shadow</label>
                            </div>
                            <input type="color" value={maskEffects.innerShadow.color} onChange={e => handleEffectChange('innerShadow', 'color', e.target.value)} disabled={!maskEffects.innerShadow.enabled} />
                        </div>
                        {maskEffects.innerShadow.enabled && (
                            <>
                                <EnhancedSlider label="Offset X" value={maskEffects.innerShadow.offsetX} onChange={v => handleEffectChange('innerShadow', 'offsetX', v)} min={-10} max={10} />
                                <EnhancedSlider label="Offset Y" value={maskEffects.innerShadow.offsetY} onChange={v => handleEffectChange('innerShadow', 'offsetY', v)} min={-10} max={10} />
                                <EnhancedSlider label="Blur" value={maskEffects.innerShadow.blur} onChange={v => handleEffectChange('innerShadow', 'blur', v)} min={0} max={15} />
                            </>
                        )}
                    </div>
                </>
            )}
        </>
    );
};