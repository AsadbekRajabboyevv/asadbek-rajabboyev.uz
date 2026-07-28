'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Custom GLSL Shader for Holographic Plasma Core
const HolographicShader = {
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#3b82f6') },
    uMouse: { value: new THREE.Vector2(0, 0) }
  },
  vertexShader: `
    uniform float uTime;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;
    varying float vDisplacement;

    // GLSL 3D Noise generator
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

      vec3 i  = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);

      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);

      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;

      i = mod289(i);
      vec4 p = permute(permute(permute(
                 i.z + vec4(0.0, i1.z, i2.z, 1.0))
               + i.y + vec4(0.0, i1.y, i2.y, 1.0))
               + i.x + vec4(0.0, i1.x, i2.x, 1.0));

      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;

      vec4 j = p - 49.0 * floor(p * ns.z);

      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);

      vec4 x = x_ *ns.x + vec4(ns.yyyy);
      vec4 y = y_ *ns.x + vec4(ns.yyyy);
      vec4 h = 1.0 - abs(x) - abs(y);

      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);

      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));

      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);

      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;

      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;

      // Complex GLSL vertex displacement
      float noise = snoise(position * 2.2 + vec3(uTime * 0.8));
      vDisplacement = noise;
      vec3 newPosition = position + normal * (noise * 0.18);

      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColor;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;
    varying float vDisplacement;

    void main() {
      // Fresnel Rim Lighting
      vec3 viewDir = normalize(-vPosition);
      float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 3.0);

      // GLSL Holographic Scanline calculation
      float scanline = sin(vUv.y * 120.0 + uTime * 6.0) * 0.15 + 0.85;

      // Dynamic color wave harmonics
      vec3 colorShift = mix(uColor, vec3(0.4, 0.8, 1.0), vDisplacement * 0.5 + 0.5);
      vec3 finalColor = colorShift + vec3(fresnel * 1.5);
      finalColor *= scanline;

      float alpha = fresnel * 0.85 + 0.25;

      gl_FragColor = vec4(finalColor, alpha);
    }
  `
};

export function HolographicCore({ position = [0, 0, 0] as [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(() => {
    return {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color('#3b82f6') },
      uMouse: { value: new THREE.Vector2(0, 0) }
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

    if (meshRef.current) {
      meshRef.current.rotation.y = time * 0.25;
      meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.15;
    }
  });

  return (
    <group position={position}>
      {/* Outer GLSL Deformed Holographic Plasma Orb */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.9, 64, 64]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={HolographicShader.vertexShader}
          fragmentShader={HolographicShader.fragmentShader}
          uniforms={uniforms}
          transparent={true}
          depthWrite={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Inner Glowing Core */}
      <mesh scale={[0.45, 0.45, 0.45]}>
        <icosahedronGeometry args={[1, 3]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
      </mesh>
    </group>
  );
}
