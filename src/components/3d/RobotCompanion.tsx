'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface RobotState {
  section: string;
  progress: number;
  hoveredTarget: string | null;
}

// Web Audio API Synthesizer for Interactive Sci-Fi Robot Sound Effect
function playRobotSound() {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    // Sound 1: High Frequency Digital Beep Sweep
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.08);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.22);

    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.25);

    // Sound 2: Sub-Bass Reactor Energy Pulse
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();

    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(140, ctx.currentTime);
    subOsc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.3);

    subGain.gain.setValueAtTime(0.3, ctx.currentTime);
    subGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

    subOsc.connect(subGain);
    subGain.connect(ctx.destination);

    subOsc.start();
    subOsc.stop(ctx.currentTime + 0.3);
  } catch (e) {
    console.error('Robot Audio synthesis failed:', e);
  }
}

export function RobotModel({ section, progress, hoveredTarget }: RobotState) {
  const robotRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const antennaLightRef = useRef<THREE.Mesh>(null);
  const earLeftRef = useRef<THREE.Mesh>(null);
  const earRightRef = useRef<THREE.Mesh>(null);
  const leftArmGroupRef = useRef<THREE.Group>(null);
  const rightArmGroupRef = useRef<THREE.Group>(null);
  const leftHandRef = useRef<THREE.Group>(null);
  const rightHandRef = useRef<THREE.Group>(null);
  const holoRingRef = useRef<THREE.Mesh>(null);
  const holoConeRef = useRef<THREE.Mesh>(null);
  const arcReactorRef = useRef<THREE.Mesh>(null);
  const thrusterFlameRef = useRef<THREE.Mesh>(null);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [accentColor, setAccentColor] = useState('#3b82f6');

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state, delta) => {
    if (!robotRef.current) return;
    const time = state.clock.getElapsedTime();

    // Read active theme accent color dynamically
    if (typeof window !== 'undefined') {
      const color = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#3b82f6';
      setAccentColor(color);
    }

    // Section coordinates and rotation target
    let targetPos = new THREE.Vector3(2.2, -0.4, 0);
    let targetRot = new THREE.Vector3(0, -0.4, 0);
    let targetScale = new THREE.Vector3(1.1, 1.1, 1.1);

    switch (section) {
      case 'home':
        targetPos.set(2.2, -0.3, 0);
        targetRot.set(0, -0.35, 0);
        targetScale.set(1.15, 1.15, 1.15);
        break;
      case 'about':
        targetPos.set(-2.2, -0.2, 0.2);
        targetRot.set(0, 0.45, 0);
        targetScale.set(1.2, 1.2, 1.2);
        break;
      case 'skills':
        targetPos.set(0, 0.2, 0.8);
        targetRot.set(0, 0, 0);
        targetScale.set(1.3, 1.3, 1.3);
        break;
      case 'projects':
        targetPos.set(2.4, -0.5, -0.2);
        targetRot.set(0.1, -0.5, 0);
        targetScale.set(1.0, 1.0, 1.0);
        break;
      case 'experience':
        targetPos.set(-2.3, -0.4, 0.1);
        targetRot.set(0, 0.4, 0);
        targetScale.set(1.1, 1.1, 1.1);
        break;
      case 'contact':
        targetPos.set(0, -0.6, 0.5);
        targetRot.set(-0.1, 0, 0);
        targetScale.set(1.25, 1.25, 1.25);
        break;
    }

    // Smooth Lerp Position & Rotation
    robotRef.current.position.lerp(targetPos, delta * 3.5);
    robotRef.current.rotation.x = THREE.MathUtils.lerp(robotRef.current.rotation.x, targetRot.x, delta * 3.5);
    robotRef.current.rotation.y = THREE.MathUtils.lerp(robotRef.current.rotation.y, targetRot.y, delta * 3.5);
    robotRef.current.rotation.z = THREE.MathUtils.lerp(robotRef.current.rotation.z, targetRot.z, delta * 3.5);
    robotRef.current.scale.lerp(targetScale, delta * 3.5);

    // Floating Levitation Motion
    robotRef.current.position.y += Math.sin(time * 2.2) * 0.003;

    // Head Tracking Mouse Cursor
    if (headRef.current) {
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, mousePos.x * 0.6, delta * 4);
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, -mousePos.y * 0.4, delta * 4);
    }

    // Antenna & Arc Reactor Pulsing
    if (antennaLightRef.current) {
      const mat = antennaLightRef.current.material as THREE.MeshBasicMaterial;
      if (mat) mat.opacity = 0.5 + Math.sin(time * 6) * 0.5;
    }
    if (arcReactorRef.current) {
      const mat = arcReactorRef.current.material as THREE.MeshBasicMaterial;
      if (mat) mat.opacity = 0.7 + Math.sin(time * 4) * 0.3;
    }

    // Dynamic Thruster Flame Pulse
    if (thrusterFlameRef.current) {
      const flameScale = 1.0 + Math.sin(time * 12) * 0.2;
      thrusterFlameRef.current.scale.set(flameScale, flameScale * (1.0 + Math.random() * 0.15), flameScale);
    }

    // Interactive Hover Gesture
    if (hoveredTarget && rightArmGroupRef.current) {
      rightArmGroupRef.current.rotation.x = THREE.MathUtils.lerp(rightArmGroupRef.current.rotation.x, -0.8, delta * 6);
      rightArmGroupRef.current.rotation.z = THREE.MathUtils.lerp(rightArmGroupRef.current.rotation.z, -0.4, delta * 6);
    } else if (rightArmGroupRef.current) {
      rightArmGroupRef.current.rotation.x = THREE.MathUtils.lerp(rightArmGroupRef.current.rotation.x, Math.sin(time * 2) * 0.08, delta * 3);
      rightArmGroupRef.current.rotation.z = THREE.MathUtils.lerp(rightArmGroupRef.current.rotation.z, 0, delta * 3);
    }

    if (leftArmGroupRef.current) {
      leftArmGroupRef.current.rotation.x = THREE.MathUtils.lerp(leftArmGroupRef.current.rotation.x, -Math.sin(time * 2) * 0.08, delta * 3);
    }
  });

  return (
    <group
      ref={robotRef}
      onClick={() => playRobotSound()}
      onPointerOver={() => (document.body.style.cursor = 'pointer')}
      onPointerOut={() => (document.body.style.cursor = 'default')}
    >
      {/* 1. HEAD ASSEMBLY WITH MICRO-DETAILS */}
      <group ref={headRef} position={[0, 0.75, 0]}>
        {/* Main Head Outer Armor Shell */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.38, 32, 32]} />
          <meshStandardMaterial color="#0F172A" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Outer Bevelled Visor Frame */}
        <mesh position={[0, 0.03, 0.06]}>
          <sphereGeometry args={[0.36, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
          <meshStandardMaterial color="#1E293B" metalness={0.9} roughness={0.15} />
        </mesh>

        {/* Curved Glowing Glass Visor Display */}
        <mesh position={[0, 0.04, 0.22]} rotation={[0.1, 0, 0]}>
          <boxGeometry args={[0.42, 0.16, 0.16]} />
          <meshPhysicalMaterial color={accentColor} transmission={0.9} opacity={1} transparent roughness={0.1} ior={1.5} />
        </mesh>

        {/* Dual High-Tech Camera Lenses (Eyes) */}
        {/* Left Camera Lens Eye */}
        <group position={[-0.11, 0.04, 0.32]}>
          <mesh>
            <cylinderGeometry args={[0.045, 0.045, 0.04, 24]} />
            <meshStandardMaterial color="#020617" metalness={0.95} />
          </mesh>
          <mesh position={[0, 0.02, 0]}>
            <sphereGeometry args={[0.032, 16, 16]} />
            <meshBasicMaterial color={accentColor} />
          </mesh>
        </group>

        {/* Right Camera Lens Eye */}
        <group position={[0.11, 0.04, 0.32]}>
          <mesh>
            <cylinderGeometry args={[0.045, 0.045, 0.04, 24]} />
            <meshStandardMaterial color="#020617" metalness={0.95} />
          </mesh>
          <mesh position={[0, 0.02, 0]}>
            <sphereGeometry args={[0.032, 16, 16]} />
            <meshBasicMaterial color={accentColor} />
          </mesh>
        </group>

        {/* Forehead Micro-Sensor Array */}
        <group position={[0, 0.2, 0.28]}>
          <mesh>
            <boxGeometry args={[0.14, 0.025, 0.04]} />
            <meshStandardMaterial color="#334155" metalness={0.9} />
          </mesh>
          <mesh position={[-0.04, 0, 0.02]}>
            <sphereGeometry args={[0.008, 8, 8]} />
            <meshBasicMaterial color="#34D399" />
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <sphereGeometry args={[0.008, 8, 8]} />
            <meshBasicMaterial color="#FBBF24" />
          </mesh>
          <mesh position={[0.04, 0, 0.02]}>
            <sphereGeometry args={[0.008, 8, 8]} />
            <meshBasicMaterial color="#F43F5E" />
          </mesh>
        </group>

        {/* Floating Side Ear Audio Pods with Vents */}
        <mesh ref={earLeftRef} position={[-0.41, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.09, 0.09, 0.06, 24]} />
          <meshStandardMaterial color="#334155" metalness={0.85} />
        </mesh>
        <mesh ref={earRightRef} position={[0.41, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <cylinderGeometry args={[0.09, 0.09, 0.06, 24]} />
          <meshStandardMaterial color="#334155" metalness={0.85} />
        </mesh>

        {/* Dual Antenna Array with Glowing LED Bulb */}
        <group position={[0, 0.38, -0.05]}>
          <mesh position={[-0.12, 0.1, 0]}>
            <cylinderGeometry args={[0.008, 0.015, 0.22, 16]} />
            <meshStandardMaterial color="#64748B" metalness={0.9} />
          </mesh>
          <mesh position={[0.12, 0.1, 0]}>
            <cylinderGeometry args={[0.008, 0.015, 0.22, 16]} />
            <meshStandardMaterial color="#64748B" metalness={0.9} />
          </mesh>
          <mesh ref={antennaLightRef} position={[0, 0.22, 0]}>
            <sphereGeometry args={[0.035, 16, 16]} />
            <meshBasicMaterial color={accentColor} transparent opacity={0.9} />
          </mesh>
        </group>
      </group>

      {/* 2. INTRICATE TORSO & ARC REACTOR CORE */}
      <group position={[0, 0.1, 0]}>
        {/* Upper Chest Main Armor Chassis */}
        <mesh position={[0, 0.12, 0]}>
          <cylinderGeometry args={[0.34, 0.24, 0.42, 24]} />
          <meshStandardMaterial color="#0F172A" metalness={0.85} roughness={0.2} />
        </mesh>

        {/* Chest Armor Overlay Plates */}
        <mesh position={[0, 0.16, 0.08]}>
          <boxGeometry args={[0.38, 0.22, 0.26]} />
          <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Central Glowing Arc Reactor Core */}
        <group position={[0, 0.16, 0.22]}>
          <mesh>
            <torusGeometry args={[0.09, 0.02, 16, 32]} />
            <meshStandardMaterial color="#F8FAFC" metalness={0.95} />
          </mesh>
          <mesh ref={arcReactorRef}>
            <sphereGeometry args={[0.065, 24, 24]} />
            <meshBasicMaterial color={accentColor} transparent opacity={0.9} />
          </mesh>
          <mesh scale={[0.03, 0.03, 0.03]}>
            <octahedronGeometry args={[1, 0]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>

        {/* Abdominal Hydraulic Pistons (Left & Right) */}
        <mesh position={[-0.14, -0.15, 0.05]}>
          <cylinderGeometry args={[0.022, 0.022, 0.24, 16]} />
          <meshStandardMaterial color="#64748B" metalness={0.95} />
        </mesh>
        <mesh position={[0.14, -0.15, 0.05]}>
          <cylinderGeometry args={[0.022, 0.022, 0.24, 16]} />
          <meshStandardMaterial color="#64748B" metalness={0.95} />
        </mesh>

        {/* Lower Torso Base Ring */}
        <mesh position={[0, -0.22, 0]}>
          <cylinderGeometry args={[0.22, 0.18, 0.14, 24]} />
          <meshStandardMaterial color="#020617" metalness={0.9} />
        </mesh>
      </group>

      {/* 3. ARTICULATED LEFT ARM */}
      <group ref={leftArmGroupRef} position={[-0.44, 0.24, 0]}>
        {/* Shoulder Joint Ball Socket */}
        <mesh>
          <sphereGeometry args={[0.11, 24, 24]} />
          <meshStandardMaterial color="#334155" metalness={0.9} />
        </mesh>
        {/* Shoulder Pauldron */}
        <mesh position={[-0.04, 0.04, 0]}>
          <sphereGeometry args={[0.13, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
          <meshStandardMaterial color="#0F172A" metalness={0.8} />
        </mesh>
        {/* Upper Arm Bicep */}
        <mesh position={[0, -0.18, 0]}>
          <cylinderGeometry args={[0.065, 0.055, 0.24, 20]} />
          <meshStandardMaterial color="#1E293B" metalness={0.8} />
        </mesh>
        {/* Forearm */}
        <mesh position={[0, -0.38, 0]}>
          <cylinderGeometry args={[0.055, 0.045, 0.22, 20]} />
          <meshStandardMaterial color="#0F172A" metalness={0.85} />
        </mesh>

        {/* Articulated Left Hand & Fingers */}
        <group ref={leftHandRef} position={[0, -0.52, 0]}>
          <mesh>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial color="#334155" metalness={0.9} />
          </mesh>
          {/* Fingers */}
          {[-0.03, -0.01, 0.01, 0.03].map((xOff, idx) => (
            <mesh key={idx} position={[xOff, -0.05, 0]}>
              <boxGeometry args={[0.012, 0.05, 0.012]} />
              <meshStandardMaterial color="#64748B" metalness={0.9} />
            </mesh>
          ))}
        </group>
      </group>

      {/* 4. ARTICULATED RIGHT ARM */}
      <group ref={rightArmGroupRef} position={[0.44, 0.24, 0]}>
        {/* Shoulder Joint Ball Socket */}
        <mesh>
          <sphereGeometry args={[0.11, 24, 24]} />
          <meshStandardMaterial color="#334155" metalness={0.9} />
        </mesh>
        {/* Shoulder Pauldron */}
        <mesh position={[0.04, 0.04, 0]}>
          <sphereGeometry args={[0.13, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
          <meshStandardMaterial color="#0F172A" metalness={0.8} />
        </mesh>
        {/* Upper Arm Bicep */}
        <mesh position={[0, -0.18, 0]}>
          <cylinderGeometry args={[0.065, 0.055, 0.24, 20]} />
          <meshStandardMaterial color="#1E293B" metalness={0.8} />
        </mesh>
        {/* Forearm */}
        <mesh position={[0, -0.38, 0]}>
          <cylinderGeometry args={[0.055, 0.045, 0.22, 20]} />
          <meshStandardMaterial color="#0F172A" metalness={0.85} />
        </mesh>

        {/* Articulated Right Hand & Fingers */}
        <group ref={rightHandRef} position={[0, -0.52, 0]}>
          <mesh>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial color="#334155" metalness={0.9} />
          </mesh>
          {/* Fingers */}
          {[-0.03, -0.01, 0.01, 0.03].map((xOff, idx) => (
            <mesh key={idx} position={[xOff, -0.05, 0]}>
              <boxGeometry args={[0.012, 0.05, 0.012]} />
              <meshStandardMaterial color="#64748B" metalness={0.9} />
            </mesh>
          ))}
        </group>
      </group>

      {/* 5. HOVER JET THRUSTER ASSEMBLY */}
      <group position={[0, -0.28, 0]}>
        {/* Nozzle Outer Ring */}
        <mesh position={[0, -0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.14, 0.025, 16, 32]} />
          <meshStandardMaterial color="#F8FAFC" metalness={0.9} />
        </mesh>

        {/* Dynamic Thruster Flame Cone */}
        <mesh ref={thrusterFlameRef} position={[0, -0.32, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.18, 0.55, 32]} />
          <meshBasicMaterial color={accentColor} transparent opacity={0.85} />
        </mesh>
      </group>
    </group>
  );
}
