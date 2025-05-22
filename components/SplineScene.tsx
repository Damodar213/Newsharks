'use client';

import { Application } from '@splinetool/runtime';
import Spline from '@splinetool/react-spline';
import { useEffect, useState } from 'react';

interface SplineSceneProps {
  sceneUrl: string;
  className?: string;
}

export default function SplineScene({ sceneUrl, className = '' }: SplineSceneProps) {
  const [isLoading, setIsLoading] = useState(true);

  function onLoad(splineApp: Application) {
    setIsLoading(false);
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}
      <Spline
        scene={sceneUrl}
        onLoad={onLoad}
        className="w-full h-full"
      />
    </div>
  );
} 