import React from 'react';
import { MaskEffects } from '../types';

export const DynamicSVGFilters = ({ effects, renderScale }: { effects: MaskEffects, renderScale: number }) => {
  if (!effects.enabled) return null;

  const { stroke, outerShadow, ripples } = effects;
  
  const turbulenceBaseFrequencyX = ((100 - ripples.width + 1) * 0.0005).toPrecision(4);
  const turbulenceBaseFrequencyY = ((100 - ripples.width + 1) * 0.002).toPrecision(4);

  const filterSteps = [];
  const mergeNodes = [];

  if (outerShadow.enabled) {
    filterSteps.push(
      <feGaussianBlur key="shadowBlur" in="SourceAlpha" stdDeviation={outerShadow.blur * renderScale} result="shadowBlur"/>,
      <feOffset key="shadowOffset" dx={outerShadow.offsetX * renderScale} dy={outerShadow.offsetY * renderScale} in="shadowBlur" result="shadowOffset"/>,
      <feFlood key="shadowColor" floodColor={outerShadow.color} result="shadowColor"/>,
      <feComposite key="shadowComposite" in="shadowColor" in2="shadowOffset" operator="in" result="outerShadow"/>
    );
    mergeNodes.push(<feMergeNode key="mergeShadow" in="outerShadow"/>);
  }

  if (ripples.enabled) {
    filterSteps.push(
      <feTurbulence key="turbulence" type="fractalNoise" baseFrequency={`${turbulenceBaseFrequencyX} ${turbulenceBaseFrequencyY}`} numOctaves={ripples.count} seed="10" result="turbulence"/>,
      <feMorphology key="dilateFoam1" operator="dilate" radius={ripples.gap * renderScale} in="SourceAlpha" result="dilatedFoam1"/>,
      <feDisplacementMap key="displaceFoam1" in="dilatedFoam1" in2="turbulence" scale={ripples.gap * 2 * renderScale} xChannelSelector="R" yChannelSelector="A" result="wavyShape1"/>,
      <feFlood key="foamColor1" floodColor="white" result="foamColor"/>,
      <feComposite key="compositeFoam1" in="foamColor" in2="wavyShape1" operator="in" result="wavyFoam1"/>,
      <feMorphology key="dilateFoam2" operator="dilate" radius={(ripples.gap / 3) * renderScale} in="SourceAlpha" result="dilatedFoam2"/>,
      <feDisplacementMap key="displaceFoam2" in="dilatedFoam2" in2="turbulence" scale={ripples.gap * renderScale} xChannelSelector="R" yChannelSelector="A" result="wavyShape2"/>,
      <feComposite key="compositeFoam2" in="foamColor" in2="wavyShape2" operator="in" result="wavyFoam2"/>
    );
    mergeNodes.push(<feMergeNode key="mergeFoam1" in="wavyFoam1"/>);
  }
  
  if (stroke.enabled) {
     filterSteps.push(
        <feMorphology key="strokeDilate" operator="dilate" radius={stroke.width * renderScale} in="SourceAlpha" result="strokeShape"/>,
        <feFlood key="strokeColor" floodColor={stroke.color} result="strokeColor"/>,
        <feComposite key="strokeComposite" in="strokeColor" in2="strokeShape" operator="in" result="darkStroke"/>
     );
     mergeNodes.push(<feMergeNode key="mergeStroke" in="darkStroke"/>);
  }
  
  if (ripples.enabled) {
    mergeNodes.push(<feMergeNode key="mergeFoam2" in="wavyFoam2"/>);
  }

  return (
    <svg width="0" height="0" style={{ position: 'absolute', zIndex: -1 }}>
      <defs>
        <filter id="dynamic-coastline-effects" x="-50%" y="-50%" width="200%" height="200%">
          {filterSteps}
          <feMerge>
            {mergeNodes}
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
};