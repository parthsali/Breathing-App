import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { BreathingSphere } from './BreathingSphere';
import { useBreathingStore } from '../store/breathingStore';

export const BreathingCanvas: React.FC = () => {
  const { theme } = useBreathingStore();

  return (
    <Canvas 
      camera={{ position: [0, 0, 5], fov: 75 }}
      className="absolute inset-0"
    >
      <color attach="background" args={[theme.background]} />
      <fog attach="fog" args={[theme.background, 5, 20]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <BreathingSphere />
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
}; 