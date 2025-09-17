import React from 'react';

interface AssetsToolPanelProps {
    insertionCategory: string;
    setInsertionCategory: (category: string) => void;
    assetLink: string;
    setAssetLink: (link: string) => void;
    handleInsertStampAsset: (url: string, category: string) => void;
}

export const AssetsToolPanel: React.FC<AssetsToolPanelProps> = ({
    insertionCategory,
    setInsertionCategory,
    assetLink,
    setAssetLink,
    handleInsertStampAsset
}) => {
    return (
        <div className="control-group">
            <h3>Stamp Assets</h3>
            <label htmlFor="insertion-category">Destination Folder</label>
            <div className="category-selector">
                {Array.from({ length: 7 }, (_, i) => String(i + 1)).map(cat => (
                    <button key={cat} className={insertionCategory === cat ? 'active' : ''} onClick={() => setInsertionCategory(cat)}>
                        {cat}
                    </button>
                ))}
            </div>
            <label htmlFor="asset-link">Asset Link</label>
            <div className="link-input-container">
                <input id="asset-link" type="text" value={assetLink} onChange={(e) => setAssetLink(e.target.value)} placeholder="https://..." />
                <button onClick={() => handleInsertStampAsset(assetLink, insertionCategory)}>Insert</button>
            </div>
        </div>
    );
};
