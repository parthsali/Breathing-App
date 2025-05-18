/**
 * BreathingSphere component that renders an animated sphere for breathing exercises.
 * The sphere expands and contracts based on the breathing cycle phases.
 * Uses Three.js for 3D rendering and animation, with two layered spheres:
 * - Inner sphere: Main breathing visualization with distortion effect
 * - Outer sphere: Secondary visualization with wobble effect
 */
import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, MeshWobbleMaterial } from '@react-three/drei';
import { useBreathingStore } from '../store/breathingStore';
import * as THREE from 'three';

/**
 * Configuration for the breathing sphere materials
 * Defines visual properties for both inner and outer spheres:
 * - Inner sphere: Distorted material with metallic finish
 * - Outer sphere: Wobbling material with lower opacity
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
 * Defines size and detail level for both spheres:
 * - Inner sphere: Higher detail (64 segments)
 * - Outer sphere: Lower detail (32 segments) with larger scale
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
 * Features:
 * - Smooth expansion/contraction based on breathing phases
 * - Automatic phase transitions (inhale, hold, exhale)
 * - Smooth reset animation when breathing stops
 * - Continuous rotation of outer sphere
 * 
 * @returns {JSX.Element} The rendered breathing sphere
 */
export const BreathingSphere: React.FC = () => {
  const sphereRef = useRef<THREE.Mesh>(null);
  const outerSphereRef = useRef<THREE.Mesh>(null);
  const startTime = useRef<number>(0);
  const isResetting = useRef(false);
  const resetStartTime = useRef(0);
  const {
    inhaleTime,
    holdTime,
    exhaleTime,
    isBreathing,
    
    theme,
    setCurrentPhase,
  } = useBreathingStore();

  const totalCycleTime = inhaleTime + holdTime + exhaleTime;
  const scale = useRef(1);

  // Reset startTime when breathing starts and initiate smooth reset when breathing stops
  useEffect(() => {
    if (isBreathing) {
      startTime.current = Date.now();
      isResetting.current = false;
    } else if (sphereRef.current && outerSphereRef.current) {
      // Start smooth reset animation
      isResetting.current = true;
      resetStartTime.current = Date.now();
    }
  }, [isBreathing]);

  useFrame((state, delta) => {
    console.log(state)
    if (!sphereRef.current || !outerSphereRef.current) return;

    if (isResetting.current) {
      // Smooth reset animation
      const resetElapsed = (Date.now() - resetStartTime.current) / 1000;
      const resetDuration = 0.5; // Half second reset animation
      const resetProgress = Math.min(resetElapsed / resetDuration, 1);
      
      // Smoothly interpolate scale back to 1
      scale.current = THREE.MathUtils.lerp(scale.current, 1, resetProgress);
      
      // Apply transformations
      sphereRef.current.scale.set(scale.current, scale.current, scale.current);
      outerSphereRef.current.scale.set(
        scale.current * SPHERE_CONFIG.outer.scale,
        scale.current * SPHERE_CONFIG.outer.scale,
        scale.current * SPHERE_CONFIG.outer.scale
      );

      if (resetProgress === 1) {
        isResetting.current = false;
      }
      return;
    }

    if (!isBreathing) return;

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