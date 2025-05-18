/**
 * BreathingSphere component that renders an animated sphere for breathing exercises.
 * The sphere expands and contracts based on the breathing cycle phases.
 */
import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, MeshWobbleMaterial } from '@react-three/drei';
import { useBreathingStore } from '../store/breathingStore';
import * as THREE from 'three';

/**
 * Configuration for the breathing sphere materials
 */
const MATERIAL_CONFIG = {
  inner: {
    opacity: 0.8,
    distort: 0.3,
    speed: 2,
    roughness: 0.2,
    metalness: 0.8
  },
  outer: {
    opacity: 0.2,
    factor: 0.2,
    speed: 1
  }
} as const;

/**
 * Configuration for the sphere geometry
 */
const SPHERE_CONFIG = {
  inner: {
    args: [1, 64, 64] as [number, number, number]
  },
  outer: {
    args: [1, 32, 32] as [number, number, number],
    scale: 1.2
  }
} as const;

/**
 * BreathingSphere component that renders an animated sphere for breathing exercises
 * @returns {JSX.Element} The rendered breathing sphere
 */
export const BreathingSphere: React.FC = () => {
  const sphereRef = useRef<THREE.Mesh>(null);
  const outerSphereRef = useRef<THREE.Mesh>(null);
  const startTime = useRef<number>(0);
  const {
    inhaleTime,
    holdTime,
    exhaleTime,
    isBreathing,
    currentPhase,
    theme,
    setCurrentPhase,
  } = useBreathingStore();

  const totalCycleTime = inhaleTime + holdTime + exhaleTime;
  const scale = useRef(1);

  // Reset startTime when breathing starts
  useEffect(() => {
    if (isBreathing) {
      startTime.current = Date.now();
    }
  }, [isBreathing]);

  useFrame((state, delta) => {
    if (!isBreathing || !sphereRef.current || !outerSphereRef.current) return;

    const elapsedTime = (Date.now() - startTime.current) / 1000;
    const time = elapsedTime % totalCycleTime;
    
    // Calculate scale based on breathing phase
    if (time < inhaleTime) {
      setCurrentPhase('inhale');
      const progress = time / inhaleTime;
      scale.current = 1 + progress;
    } else if (time < inhaleTime + holdTime) {
      setCurrentPhase('hold');
      scale.current = 2;
    } else {
      setCurrentPhase('exhale');
      const progress = (time - (inhaleTime + holdTime)) / exhaleTime;
      scale.current = 2 - progress;
    }

    // Apply transformations
    sphereRef.current.scale.set(scale.current, scale.current, scale.current);
    outerSphereRef.current.scale.set(
      scale.current * SPHERE_CONFIG.outer.scale,
      scale.current * SPHERE_CONFIG.outer.scale,
      scale.current * SPHERE_CONFIG.outer.scale
    );
    outerSphereRef.current.rotation.y += delta * 0.2;
  });

  return (
    <group>
      <Sphere ref={sphereRef} args={SPHERE_CONFIG.inner.args}>
        <MeshDistortMaterial
          color={theme.primary}
          transparent
          {...MATERIAL_CONFIG.inner}
        />
      </Sphere>
      <Sphere ref={outerSphereRef} args={SPHERE_CONFIG.outer.args}>
        <MeshWobbleMaterial
          color={theme.secondary}
          transparent
          {...MATERIAL_CONFIG.outer}
        />
      </Sphere>
    </group>
  );
}; 