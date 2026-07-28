'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function ParticleBackground() {
  const count = 1200;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 15;
      const speed = 0.2 + Math.random() * 0.5;
      const factor = 0.1 + Math.random() * 0.4;
      temp.push({ x, y, z, speed, factor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();

    if (materialRef.current && typeof window !== 'undefined') {
      const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#3b82f6';
      materialRef.current.color.setStyle(accentColor);
    }

    particles.forEach((particle, i) => {
      const { speed, factor } = particle;
      particle.y += Math.sin(time * speed) * 0.005;
      particle.x += Math.cos(time * speed * 0.8) * 0.005;

      dummy.position.set(particle.x, particle.y, particle.z);
      dummy.scale.setScalar(0.02 + Math.sin(time * factor + i) * 0.015);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.08, 8, 8]} />
      <meshBasicMaterial ref={materialRef} color="#3b82f6" transparent opacity={0.6} depthWrite={false} />
    </instancedMesh>
  );
}
