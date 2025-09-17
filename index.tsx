import React from 'react';
import { createRoot } from 'react-dom/client';
import { Tool } from './types';
import { Toolbar } from './components/Toolbar';
import { ToolPanel } from './components/ToolPanel';
import { SettingsToolPanel } from './components/panels/SettingsToolPanel';
import { MaskToolPanel } from './components/panels/MaskToolPanel';
import { BrushToolPanel } from './components/panels/BrushToolPanel';
import { StampToolPanel } from './components/panels/StampToolPanel';
import { GridToolPanel } from './components/panels/GridToolPanel';
import { AssetsToolPanel } from './components/panels/AssetsToolPanel';
import { ExportToolPanel } from './components/panels/ExportToolPanel';
import { LayersPanel } from './components/LayersPanel';
import { DynamicSVGFilters } from './components/DynamicSVGFilters';
import { SelectionToolPanel } from './components/panels/SelectionToolPanel';
import { useAppLogic } from './hooks/useAppLogic';
import { CanvasArea } from './components/CanvasArea';

const App = () => {
  const logic = useAppLogic();
  
  const {
      isRightSidebarOpen, setRightSidebarOpen,
      activeToolPanel, setActiveToolPanel,
      currentTool,
      maskEffects, renderScale,
      isCursorVisible, setIsCursorVisible,
      cursorPosition, brushSize,
      maskBrushShape, brushShape, brushHardness
  } = logic;

  const panelTitles: Record<Tool, string> = {
      mask: 'Mask Tool',
      brush: 'Brush Tool',
      stamp: 'Stamp Tool',
      grid: 'Grid Options',
      settings: 'Project Settings',
      assets: 'Asset Manager',
      export: 'Export Options',
      selection: 'Layer Properties',
  };

  let panelTitle = activeToolPanel ? panelTitles[activeToolPanel] : '';
  if (activeToolPanel === 'selection') {
      panelTitle = logic.selectedStamp ? 'Placement Settings' : 'Layer Properties';
  }

  const isBrushToolActive = currentTool === 'mask' || currentTool === 'brush';
  let cursorStyle = {};
  if (isBrushToolActive) {
      const size = brushSize;
      const scaledSize = size * logic.transform.scale;
      
      const isMaskTool = currentTool === 'mask';
      const shape = isMaskTool ? maskBrushShape : brushShape;
      
      let background = 'rgba(255, 255, 255, 0.25)';
      
      if (!isMaskTool && shape === 'circle') {
          const hardness = brushHardness;
          const colorStop = hardness * 99.9;
          background = `radial-gradient(circle, rgba(255, 255, 255, 0.25) ${colorStop}%, transparent 100%)`;
      }

      cursorStyle = {
          position: 'fixed', left: `${cursorPosition.x}px`, top: `${cursorPosition.y}px`,
          width: `${scaledSize}px`, height: `${scaledSize}px`, transform: 'translate(-50%, -50%)',
          background: background,
          border: '1px solid rgba(255, 255, 255, 0.75)',
          borderRadius: (shape === 'circle' || shape === 'edge') ? '50%' : '0',
      };
  }

  const mainStyle: React.CSSProperties = {
      position: 'absolute',
      top: 0,
      left: activeToolPanel ? 'calc(60px + var(--sidebar-width))' : '60px',
      right: isRightSidebarOpen ? 'var(--sidebar-width)' : '0px',
      bottom: 0,
      transition: 'left 0.3s ease-in-out, right 0.3s ease-in-out',
  };

  return (
    <>
      <DynamicSVGFilters effects={maskEffects} renderScale={renderScale} />
      {isCursorVisible && isBrushToolActive && <div className="brush-cursor" style={cursorStyle} />}
      
      <Toolbar activeToolPanel={activeToolPanel} onToolSelect={logic.handleToolSelect} />

      {activeToolPanel && (
        <ToolPanel title={panelTitle} onClose={() => setActiveToolPanel(null)}>
            {activeToolPanel === 'settings' && (
                <SettingsToolPanel 
                    inputWidth={logic.inputWidth}
                    setInputWidth={logic.setInputWidth}
                    inputHeight={logic.inputHeight}
                    setInputHeight={logic.setInputHeight}
                    handleApplySize={logic.handleApplySize}
                    viewportDpi={logic.viewportDpi}
                    setViewportDpi={logic.setViewportDpi}
                    handleSaveProject={logic.handleSaveProject}
                    handleLoadProject={logic.handleLoadProject}
                />
            )}
            {activeToolPanel === 'mask' && (
                <MaskToolPanel 
                    maskBrushMode={logic.maskBrushMode}
                    setMaskBrushMode={logic.setMaskBrushMode}
                    maskBrushShape={logic.maskBrushShape}
                    setMaskBrushShape={logic.setMaskBrushShape}
                    brushSize={logic.brushSize}
                    setBrushSize={logic.setBrushSize}
                    maskRoughness={logic.maskRoughness}
                    setMaskRoughness={logic.setMaskRoughness}
                    maskEffects={logic.maskEffects}
                    setMaskEffects={logic.setMaskEffects}
                    handleEffectChange={logic.handleEffectChange}
                />
            )}
            {activeToolPanel === 'brush' && (
                <BrushToolPanel
                    brushTargetLayer={logic.brushTargetLayer}
                    setBrushTargetLayer={logic.setBrushTargetLayer}
                    brushShape={logic.brushShape}
                    setBrushShape={logic.setBrushShape}
                    brushSize={logic.brushSize}
                    setBrushSize={logic.setBrushSize}
                    brushHardness={logic.brushHardness}
                    setBrushHardness={logic.setBrushHardness}
                    brushOpacity={logic.brushOpacity}
                    setBrushOpacity={logic.setBrushOpacity}
                    brushTextures={logic.brushTextures}
                    activeBrushTextureSrc={logic.activeBrushTextureSrc}
                    setActiveBrushTextureSrc={logic.setActiveBrushTextureSrc}
                    brushTextureScale={logic.brushTextureScale}
                    setBrushTextureScale={logic.setBrushTextureScale}
                    brushHue={logic.brushHue}
                    setBrushHue={logic.setBrushHue}
                    brushSaturation={logic.brushSaturation}
                    setBrushSaturation={logic.setBrushSaturation}
                    brushBrightness={logic.brushBrightness}
                    setBrushBrightness={logic.setBrushBrightness}
                    brushContrast={logic.brushContrast}
                    setBrushContrast={logic.setBrushContrast}
                />
            )}
            {activeToolPanel === 'stamp' && (
                <StampToolPanel
                    activeCatalogCategory={logic.activeCatalogCategory}
                    setActiveCatalogCategory={logic.setActiveCatalogCategory}
                    stampAssets={logic.stampAssets}
                    activeStampSrc={logic.activeStampSrc}
                    setActiveStampSrc={logic.setActiveStampSrc}
                    placementScale={logic.placementScale}
                    setPlacementScale={logic.setPlacementScale}
                    placementRotation={logic.placementRotation}
                    setPlacementRotation={logic.setPlacementRotation}
                />
            )}
            {activeToolPanel === 'grid' && (
                <GridToolPanel
                    showGrid={logic.showGrid}
                    setShowGrid={logic.setShowGrid}
                    gridShape={logic.gridShape}
                    setGridShape={logic.setGridShape}
                    gridColumns={logic.gridColumns}
                    setGridColumns={logic.setGridColumns}
                    gridRows={logic.gridRows}
                    setGridRows={logic.setGridRows}
                    canvasSize={logic.canvasSize}
                />
            )}
             {activeToolPanel === 'assets' && (
                <AssetsToolPanel
                    insertionCategory={logic.insertionCategory}
                    setInsertionCategory={logic.setInsertionCategory}
                    assetLink={logic.assetLink}
                    setAssetLink={logic.setAssetLink}
                    handleInsertStampAsset={logic.handleInsertStampAsset}
                />
             )}
             {activeToolPanel === 'export' && (
                <ExportToolPanel
                    exportDpi={logic.exportDpi}
                    setExportDpi={logic.setExportDpi}
                    handleExportWebP={logic.handleExportWebP}
                    handleExportNavJson={logic.handleExportNavJson}
                />
             )}
             {activeToolPanel === 'selection' && logic.selectedIds.length > 0 && (
                <SelectionToolPanel
                    selectedStamp={logic.selectedStamp}
                    selectedLayer={logic.selectedLayer}
                    selectedIds={logic.selectedIds}
                    stampClipboard={logic.stampClipboard}
                    handleGroup={logic.handleGroup}
                    handleUngroup={logic.handleUngroup}
                    // FIX: Pass arguments to handleDelete to match its signature in useLayerManager.
                    handleDelete={() => logic.handleDelete(logic.activeToolPanel, logic.setActiveToolPanel, logic.setCurrentTool)}
                    updateSelectedStamp={logic.updateSelectedStamp}
                    handleStampLayerOrder={logic.handleStampLayerOrder}
                    handleStampCopy={logic.handleStampCopy}
                    handleStampPaste={logic.handleStampPaste}
                />
             )}
        </ToolPanel>
      )}

      <CanvasArea
        mapContainerRef={logic.mapContainerRef}
        backgroundCanvasRef={logic.backgroundCanvasRef}
        effectsCanvasRef={logic.effectsCanvasRef}
        foregroundCanvasRef={logic.foregroundCanvasRef}
        topLayerCanvasRef={logic.topLayerCanvasRef}
        brushTopLayerCanvasRef={logic.brushTopLayerCanvasRef}
        gridCanvasRef={logic.gridCanvasRef}
        canvasSize={logic.canvasSize}
        transform={logic.transform}
        renderScale={logic.renderScale}
        selectionBox={logic.selectionBox}
        currentTool={logic.currentTool}
        onMouseDown={logic.handleMouseDown}
        onMouseUp={logic.handleMouseUp}
        onMouseMove={logic.handleMouseMove}
        onMouseEnter={() => logic.setIsCursorVisible(true)}
        onMouseLeave={(e: React.MouseEvent) => { logic.setIsCursorVisible(false); logic.handleMouseUp(e); }}
        onWheel={logic.handleWheel}
      />
      
      <LayersPanel
        isRightSidebarOpen={isRightSidebarOpen}
        layers={logic.layers}
        selectedIds={logic.selectedIds}
        draggedItemId={logic.draggedItemId}
        dropTargetId={logic.dropTargetId}
        handleGroup={logic.handleGroup}
        handleCreateEmptyGroup={logic.handleCreateEmptyGroup}
        handleDragStart={logic.handleDragStart}
        handleDragEnd={logic.handleDragEnd}
        handleDragOver={logic.handleDragOver}
        handleDragLeave={logic.handleDragLeave}
        handleDrop={logic.handleDrop}
        // FIX: Pass arguments to handleLayerSelect to match its signature in useLayerManager.
        handleLayerSelect={(id, e) => logic.handleLayerSelect(id, e, logic.activeToolPanel, logic.setActiveToolPanel, logic.currentTool)}
        toggleCollapse={logic.toggleCollapse}
        toggleRename={logic.toggleRename}
        handleRename={logic.handleRename}
      />

      <button className="sidebar-toggle right-toggle" onClick={() => setRightSidebarOpen(!isRightSidebarOpen)} aria-label={isRightSidebarOpen ? 'Collapse layers panel' : 'Expand layers panel'} aria-expanded={isRightSidebarOpen}> {isRightSidebarOpen ? '>' : '<'} </button>
    </>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);