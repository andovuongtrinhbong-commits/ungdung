import React from 'react';
import { StampAsset } from '../../types';
import { EnhancedSlider } from '../EnhancedSlider';

interface StampToolPanelProps {
    activeCatalogCategory: string;
    setActiveCatalogCategory: (category: string) => void;
    stampAssets: StampAsset[];
    activeStampSrc: string | null;
    setActiveStampSrc: (src: string | null) => void;
    placementScale: number;
    setPlacementScale: (scale: number) => void;
    placementRotation: number;
    setPlacementRotation: (rotation: number) => void;
}

export const StampToolPanel: React.FC<StampToolPanelProps> = ({
    activeCatalogCategory,
    setActiveCatalogCategory,
    stampAssets,
    activeStampSrc,
    setActiveStampSrc,
    placementScale,
    setPlacementScale,
    placementRotation,
    setPlacementRotation,
}) => {
    const activeAsset = stampAssets.find(a => a.src === activeStampSrc);
    const placementWidth = activeAsset ? Math.round(activeAsset.img.naturalWidth * placementScale) : 0;

    return (
        <>
            <div className="control-group stamp-controls">
                <h3>Stamp Catalog</h3>
                <div className="category-selector">
                    {Array.from({ length: 7 }, (_, i) => String(i + 1)).map(cat => (
                        <button key={cat} className={activeCatalogCategory === cat ? 'active' : ''} onClick={() => setActiveCatalogCategory(cat)}>
                            {cat}
                        </button>
                    ))}
                </div>
                <div className="stamp-palette">
                    {stampAssets.filter(t => t.category === activeCatalogCategory).length > 0 ? (
                        stampAssets.filter(t => t.category === activeCatalogCategory).map(texture => (
                            <img
                                key={texture.src}
                                src={texture.src}
                                alt="Stamp Asset"
                                className={`stamp-thumbnail ${activeStampSrc === texture.src ? 'active' : ''}`}
                                onClick={() => setActiveStampSrc(texture.src)}
                                style={{ width: `50px`, height: `50px` }}
                            />
                        ))
                    ) : (
                        <p className="help-text">This folder is empty.</p>
                    )}
                </div>
            </div>
            <div className="control-group">
                <h3>Placement Settings</h3>
                <EnhancedSlider
                    label="Width"
                    value={placementWidth}
                    onChange={newWidth => {
                        if (activeAsset && activeAsset.img.naturalWidth > 0) {
                            const newScale = newWidth / activeAsset.img.naturalWidth;
                            setPlacementScale(newScale);
                        }
                    }}
                    min={10}
                    max={1000}
                    step={1}
                    unit="px"
                    disabled={!activeAsset}
                />
                <EnhancedSlider
                    label="Rotation"
                    value={placementRotation}
                    onChange={setPlacementRotation}
                    min={0}
                    max={360}
                    unit="°"
                />
            </div>
        </>
    );
};