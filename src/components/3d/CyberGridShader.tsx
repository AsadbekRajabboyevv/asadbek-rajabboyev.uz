'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const CyberGridShaderMaterial = {
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#3b82f6') }
  },
  vertexShader: `
    uniform float uTime;
    varying vec2 vUv;
    varying float vElevation;

    void main() {
      vUv = uv;
      vec3 pos = position;

      // GLSL Wave Harmonics for undulating cyber grid floor
      float waveX = sin(pos.x * 0.8 + uTime * 1.4) * 0.25;
      float waveY = cos(pos.y * 0.8 + uTime * 1.2) * 0.25;
      float waveCombine = waveX + waveY;

      pos.z += waveCombine;
      vElevation = waveCombine;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColor;
    varying vec2 vUv;
    varying float vElevation;

    void main() {
      // GLSL Animated Grid Lines calculation
      vec2 grid = abs(fract(vUv * 35.0 - 0.5) - 0.5) / fwidth(vUv * 35.0);
      float line = min(grid.x, grid.y);
      float gridPattern = 1.0 - min(line, 1.0);

      // Pulse pulse ring animation
      float distanceToCenter = length(vUv - vec2(0.5));
      float pulse = sin(distanceToCenter * 20.0 - uTime * 3.0) * 0.5 + 0.5;

      vec3 gridColor = mix(uColor, vec3(0.5, 0.8, 1.0), vElevation + pulse * 0.4);
      float alpha = gridPattern * (0.35 + vElevation * 0.3) * smoothstep(0.7, 0.2, distanceToCenter);

      gl_FragColor = vec4(gridColor, alpha);
    }
  `
};

export function CyberGridShader() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(() => {
    return {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color('#3b82f6') }
    };
  }, []);

  useFrame((state) => {
    if (!materialRef.current) return;
    const time = state.clock.getElapsedTime();
    materialRef.current.uniforms.uTime.value = time;

    if (typeof window !== 'undefined') {
      const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#3b82f6';
      materialRef.current.uniforms.uColor.value.setStyle(accentColor);
    }
  });

  return (
    <mesh position={[0, -2.5, -2]} rotation={[-Math.PI / 2.3, 0, 0]}>
      <planeGeometry args={[25, 25, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={CyberGridShaderMaterial.vertexShader}
        fragmentShader={CyberGridShaderMaterial.fragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
