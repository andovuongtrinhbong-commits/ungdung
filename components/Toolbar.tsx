import React from 'react';
import { Tool } from '../types';
import { SettingsIcon, ShovelIcon, PaintBrushIcon, StampIcon, GridIcon, AssetsIcon, ExportIcon, SelectionIcon } from './Icons';

interface ToolbarProps {
  activeToolPanel: Tool | null;
  onToolSelect: (tool: Tool) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ activeToolPanel, onToolSelect }) => {
  return (
    <nav className="vertical-toolbar">
      <button title="Project Settings" className={activeToolPanel === 'settings' ? 'active' : ''} onClick={() => onToolSelect('settings')} aria-label="Project Settings">
          <SettingsIcon />
      </button>
      <div className="separator"></div>
      <button title="Mask Tool" className={activeToolPanel === 'mask' ? 'active' : ''} onClick={() => onToolSelect('mask')} aria-label="Mask Tool">
          <ShovelIcon />
      </button>
      <button title="Brush Tool" className={activeToolPanel === 'brush' ? 'active' : ''} onClick={() => onToolSelect('brush')} aria-label="Brush Tool">
          <PaintBrushIcon />
      </button>
      <button title="Stamp Tool" className={activeToolPanel === 'stamp' ? 'active' : ''} onClick={() => onToolSelect('stamp')} aria-label="Stamp Tool">
          <StampIcon />
      </button>
      <button title="Selection Tool" className={activeToolPanel === 'selection' ? 'active' : ''} onClick={() => onToolSelect('selection')} aria-label="Selection Tool">
          <SelectionIcon />
      </button>
      <div className="separator"></div>
      <button title="Grid Options" className={activeToolPanel === 'grid' ? 'active' : ''} onClick={() => onToolSelect('grid')} aria-label="Grid Options">
          <GridIcon />
      </button>
      <button title="Asset Manager" className={activeToolPanel === 'assets' ? 'active' : ''} onClick={() => onToolSelect('assets')} aria-label="Asset Manager">
          <AssetsIcon />
      </button>
      <button title="Export" className={activeToolPanel === 'export' ? 'active' : ''} onClick={() => onToolSelect('export')} aria-label="Export">
          <ExportIcon />
      </button>
    </nav>
  );
};