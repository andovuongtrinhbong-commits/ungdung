export type Tool = 'mask' | 'stamp' | 'brush' | 'settings' | 'assets' | 'export' | 'grid' | 'selection';
export type BrushMode = 'add' | 'subtract';
export type BrushLayer = 'background' | 'foreground' | 'top';
export type BrushShape = 'circle' | 'square' | 'edge';
export type GridShape = 'square' | 'hexagon';

export interface Stamp {
  id: string;
  type: 'stamp';
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number;
  rotation: number;
  opacity: number;
  flipH: boolean;
  hue: number;
  saturation: number;
}

export interface Group {
  id: string;
  type: 'group';
  name: string;
  children: Layer[];
  isCollapsed: boolean;
  isRenaming: boolean;
}

export type Layer = Stamp | Group;

export interface Texture {
  src: string;
  img: HTMLImageElement | null;
}
export interface StampAsset {
  src: string;
  category: string;
  img: HTMLImageElement;
}

export interface MaskEffects {
  enabled: boolean;
  stroke: {
    enabled: boolean;
    color: string;
    width: number;
  };
  outerShadow: {
    enabled: boolean;
    color: string;
    offsetX: number;
    offsetY: number;
    blur: number;
  };
  innerShadow: {
    enabled: boolean;
    color: string;
    offsetX: number;
    offsetY: number;
    blur: number;
  };
  ripples: {
    enabled: boolean;
    width: number;
    count: number;
    gap: number;
  };
}

export interface ProjectData {
  version: string;
  canvasSize: { width: number; height: number };
  layers: Layer[];
  maskDataURL: string;
  backgroundDataURL: string;
  brushTopDataURL: string;
  maskEffects: MaskEffects;
}
