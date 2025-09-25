import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ImageEnhancementContextType {
  backgroundRemovalEnabled: boolean;
  setBackgroundRemovalEnabled: (enabled: boolean) => void;
}

const ImageEnhancementContext = createContext<ImageEnhancementContextType | undefined>(undefined);

export const useImageEnhancement = () => {
  const context = useContext(ImageEnhancementContext);
  if (context === undefined) {
    throw new Error('useImageEnhancement must be used within an ImageEnhancementProvider');
  }
  return context;
};

interface ImageEnhancementProviderProps {
  children: ReactNode;
}

export const ImageEnhancementProvider = ({ children }: ImageEnhancementProviderProps) => {
  const [backgroundRemovalEnabled, setBackgroundRemovalEnabled] = useState(() => {
    // Get initial value from localStorage, default to true for professional appearance
    const stored = localStorage.getItem('imageEnhancement.backgroundRemoval');
    return stored !== null ? JSON.parse(stored) : true;
  });

  useEffect(() => {
    // Save to localStorage whenever the setting changes
    localStorage.setItem('imageEnhancement.backgroundRemoval', JSON.stringify(backgroundRemovalEnabled));
  }, [backgroundRemovalEnabled]);

  const value = {
    backgroundRemovalEnabled,
    setBackgroundRemovalEnabled,
  };

  return (
    <ImageEnhancementContext.Provider value={value}>
      {children}
    </ImageEnhancementContext.Provider>
  );
};