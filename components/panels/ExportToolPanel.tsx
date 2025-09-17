import React from 'react';

interface ExportToolPanelProps {
    exportDpi: number;
    setExportDpi: (dpi: number) => void;
    handleExportWebP: () => void;
    handleExportNavJson: () => void;
}

export const ExportToolPanel: React.FC<ExportToolPanelProps> = ({
    exportDpi,
    setExportDpi,
    handleExportWebP,
    handleExportNavJson,
}) => {
    return (
        <div className="control-group">
            <h3>Export Options</h3>
            <div className="control-group">
                <h4>Resolution (DPI)</h4>
                <div className="three-button-selector">
                    <button className={exportDpi === 96 ? 'active' : ''} onClick={() => setExportDpi(96)}>96 (Screen)</button>
                    <button className={exportDpi === 150 ? 'active' : ''} onClick={() => setExportDpi(150)}>150 (Good)</button>
                    <button className={exportDpi === 300 ? 'active' : ''} onClick={() => setExportDpi(300)}>300 (High)</button>
                </div>
            </div>
            <div className="button-group-vertical">
                <button onClick={handleExportWebP}>Export as WEBP</button>
                <button onClick={handleExportNavJson}>Export Nav JSON</button>
            </div>
        </div>
    );
};
