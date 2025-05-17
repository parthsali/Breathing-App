import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, MeshWobbleMaterial } from '@react-three/drei';
import { useBreathingStore } from '../store/breathingStore';
import * as THREE from 'three';

export const BreathingSphere: React.FC = () => {
  const sphereRef = useRef<THREE.Mesh>(null);
  const outerSphereRef = useRef<THREE.Mesh>(null);
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

  useFrame((state, delta) => {
    if (!isBreathing || !sphereRef.current || !outerSphereRef.current) return;

    const time = state.clock.getElapsedTime() % totalCycleTime;
    
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

    sphereRef.current.scale.set(scale.current, scale.current, scale.current);
    outerSphereRef.current.scale.set(scale.current * 1.2, scale.current * 1.2, scale.current * 1.2);
    outerSphereRef.current.rotation.y += delta * 0.2;
  });

  return (
    <group>
      <Sphere ref={sphereRef} args={[1, 64, 64]}>
        <MeshDistortMaterial
          color={theme.primary}
          transparent
          opacity={0.8}
          distort={0.3}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
      <Sphere ref={outerSphereRef} args={[1, 32, 32]}>
        <MeshWobbleMaterial
          color={theme.secondary}
          transparent
          opacity={0.2}
          factor={0.2}
          speed={1}
        />
      </Sphere>
    </group>
  );
}; 