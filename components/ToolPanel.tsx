import React from 'react';
import './ToolPanel.css';

interface ToolPanelProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export const ToolPanel: React.FC<ToolPanelProps> = ({ title, onClose, children }) => {
  return (
    <aside className="tool-panel">
        <div className="panel-header">
            <h3>{title}</h3>
            <button onClick={onClose} aria-label="Close panel">&times;</button>
        </div>
        <div className="sidebar-content">
            {children}
        </div>
    </aside>
  );
};