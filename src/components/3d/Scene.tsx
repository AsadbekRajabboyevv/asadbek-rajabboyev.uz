'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { RobotModel } from './RobotCompanion';
import { ParticleBackground } from './ParticleBackground';
import { CyberLandscape } from './CyberLandscape';

interface SceneProps {
  section: string;
  progress: number;
  hoveredTarget: string | null;
}

export default function Scene({ section, progress, hoveredTarget }: SceneProps) {
  const [accentColor, setAccentColor] = React.useState('#3b82f6');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const color = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#3b82f6';
      setAccentColor(color);
    }
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 10]} intensity={1.5} color={accentColor} castShadow />
        <directionalLight position={[-10, -10, -5]} intensity={0.8} color="#1e293b" />
        <pointLight position={[0, 2, 3]} intensity={2} color={accentColor} />

        <Suspense fallback={null}>
          <Environment preset="city" />
          <CyberLandscape />
          <ParticleBackground />
          <RobotModel section={section} progress={progress} hoveredTarget={hoveredTarget} />
        </Suspense>
      </Canvas>
    </div>
  );
}
