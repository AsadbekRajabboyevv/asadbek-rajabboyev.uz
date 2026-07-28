'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Custom GLSL Shader for Matrix Cyber Code Rain
const MatrixCodeGLSL = {
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#3b82f6') },
    uBgColor: { value: new THREE.Color('#00072d') },
    uResolution: { value: new THREE.Vector2(1920, 1080) }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColor;
    uniform vec3 uBgColor;
    uniform vec2 uResolution;
    varying vec2 vUv;

    // Pseudo-random generator
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }

    // Procedural GLSL Digital Code Glyph generator
    float textChar(vec2 st, float n) {
      vec2 grid = floor(st * 4.0);
      float c = random(grid + floor(n));
      return step(0.45, c);
    }

    void main() {
      // Grid dimensions for matrix streams
      vec2 columns = vec2(65.0, 35.0);
      vec2 st = vUv * columns;

      vec2 ipos = floor(st);
      vec2 fpos = fract(st);

      // Random speed and offset for each vertical code rain column
      float columnId = ipos.x;
      float speed = 2.5 + random(vec2(columnId, 1.0)) * 4.5;
      float yOffset = uTime * speed + random(vec2(columnId, 2.0)) * 100.0;

      // Falling stream calculation
      float yPos = mod(ipos.y + yOffset, columns.y);
      float streamTail = fract(yPos / columns.y);

      // Character generation
      float charVal = random(vec2(columnId, floor(yPos)));
      float charPattern = textChar(fpos, charVal * 10.0 + floor(uTime * 8.0));

      // Head brightness glow (leading code raindrop)
      float isHead = step(0.94, streamTail);
      vec3 headColor = vec3(1.0);
      vec3 tailColor = uColor * pow(streamTail, 2.2);

      vec3 matrixColor = mix(tailColor, headColor, isHead);
      float alpha = charPattern * streamTail * 0.75;

      // Blend matrix rain over theme background
      vec3 finalBg = uBgColor;
      vec3 color = mix(finalBg, matrixColor, alpha);

      gl_FragColor = vec4(color, 0.92);
    }
  `
};

export function MatrixCodeShader() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(() => {
    return {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color('#3b82f6') },
      uBgColor: { value: new THREE.Color('#00072d') },
      uResolution: { value: new THREE.Vector2(1920, 1080) }
    };
  }, []);

  useFrame((state) => {
    if (!materialRef.current) return;
    const time = state.clock.getElapsedTime();
    materialRef.current.uniforms.uTime.value = time;

    if (typeof window !== 'undefined') {
      const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#3b82f6';
      const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--background').trim() || '#00072d';

      materialRef.current.uniforms.uColor.value.setStyle(accentColor);
      materialRef.current.uniforms.uBgColor.value.setStyle(bgColor);
      materialRef.current.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    }
  });

  return (
    <mesh position={[0, 0, -4]}>
      <planeGeometry args={[16, 10]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={MatrixCodeGLSL.vertexShader}
        fragmentShader={MatrixCodeGLSL.fragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
      />
    </mesh>
  );
}
