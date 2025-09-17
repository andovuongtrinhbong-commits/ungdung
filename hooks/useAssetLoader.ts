import { useState, useEffect, useCallback } from 'react';
import { Texture, StampAsset } from '../types';
import { BRUSH_TEXTURE_URLS, INITIAL_STAMP_ASSETS } from '../constants';

export const useAssetLoader = () => {
    const [stampAssets, setStampAssets] = useState<StampAsset[]>([]);
    const [brushTextures, setBrushTextures] = useState<Texture[]>([]);
    const [landTexture, setLandTexture] = useState<Texture>({src: 'https://raw.githubusercontent.com/tttkvn/Upanh/main/brushtexturemap2d/nendatbt.png', img: null});
    const [seaTexture, setSeaTexture] = useState<Texture>({src: 'https://raw.githubusercontent.com/tttkvn/Upanh/main/brushtexturemap2d/nenbien.jpg', img: null});

    const handleInsertStampAsset = useCallback((url: string, category: string) => {
        if (!url) return;
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          setStampAssets(prev => {
            if (prev.some(t => t.src === url)) return prev;
            return [...prev, { src: url, category, img }];
          });
        };
        img.onerror = () => console.error(`Failed to load image: ${url}`);
        img.src = url;
    }, []);
  
    useEffect(() => {
      INITIAL_STAMP_ASSETS.forEach(asset => {
          handleInsertStampAsset(asset.src, asset.category);
      });
    }, [handleInsertStampAsset]);
  
    useEffect(() => {
      const loadTexture = (textureState: Texture, setTexture: React.Dispatch<React.SetStateAction<Texture>>) => {
          if(textureState.img) return;
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => setTexture(prev => ({ ...prev, img }));
          img.onerror = () => alert(`Failed to load image: ${textureState.src}. Check URL and CORS policy.`);
          img.src = textureState.src;
      };
      loadTexture(landTexture, setLandTexture);
      loadTexture(seaTexture, setSeaTexture);
    }, [landTexture.src, seaTexture.src]); // Depend on src
    
    useEffect(() => {
      const texturesToLoad: Texture[] = [];
      let loadedCount = 0;
      BRUSH_TEXTURE_URLS.forEach(src => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
              texturesToLoad.push({ src, img });
              loadedCount++;
              if (loadedCount === BRUSH_TEXTURE_URLS.length) {
                  setBrushTextures(texturesToLoad);
              }
          };
          img.onerror = () => {
              console.error(`Failed to load brush texture: ${src}`);
              loadedCount++;
               if (loadedCount === BRUSH_TEXTURE_URLS.length) {
                  setBrushTextures(texturesToLoad);
              }
          };
          img.src = src;
      });
    }, []);

    return {
        stampAssets,
        brushTextures,
        landTexture,
        seaTexture,
        handleInsertStampAsset,
    };
};
