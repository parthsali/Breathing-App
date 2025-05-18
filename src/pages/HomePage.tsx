/**
 * HomePage component that renders the breathing exercise interface.
 * This component sets up the 3D scene with Three.js and manages the overall layout.
 */
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { BreathingSphere } from '../components/BreathingSphere';
import { Controls } from '../components/Controls';
import { StartButton } from '../components/StartButton';
import { BreathingTimer } from '../components/BreathingTimer';
import { useBreathingStore } from '../store/breathingStore';
import { useNavigate } from 'react-router-dom';

/**
 * Scene configuration for the 3D environment
 */
const SCENE_CONFIG = {
  camera: {
    position: [0, 0, 5] as [number, number, number],
    fov: 75
  },
  fog: {
    near: 5,
    far: 20
  },
  stars: {
    radius: 100,
    depth: 50,
    count: 5000,
    factor: 4,
    saturation: 0,
    fade: true,
    speed: 1
  }
} as const;

/**
 * HomePage component that renders the main breathing exercise interface
 * @returns {JSX.Element} The rendered application
 */
const HomePage: React.FC = () => {
  const { theme } = useBreathingStore();
  const navigate = useNavigate();

  return (
    <div 
      className="w-screen h-screen relative overflow-hidden" 
      style={{ background: theme.background }}
    >
      <Canvas 
        camera={SCENE_CONFIG.camera}
        className="absolute inset-0"
      >
        <color attach="background" args={[theme.background]} />
        <fog 
          attach="fog" 
          args={[theme.background, SCENE_CONFIG.fog.near, SCENE_CONFIG.fog.far]} 
        />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Stars {...SCENE_CONFIG.stars} />
        <BreathingSphere />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
      <Controls />
      <StartButton />
      <BreathingTimer />
      <button
        onClick={() => navigate('/stats')}
        className="absolute bottom-8 right-8 px-4 py-2 rounded-full text-white font-medium transition-all duration-300 transform hover:scale-105"
        style={{ 
          background: theme.primary,
          boxShadow: `0 4px 14px ${theme.primary}80`
        }}
      >
        View Stats
      </button>
    </div>
  );
}

export default HomePage; 