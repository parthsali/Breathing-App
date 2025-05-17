import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { BreathingSphere } from './components/BreathingSphere';
import { Controls } from './components/Controls';
import { StartButton } from './components/StartButton';
import { useBreathingStore } from './store/breathingStore';

const App: React.FC = () => {
  const { theme } = useBreathingStore();

  return (
    <div className="w-screen h-screen relative overflow-hidden" style={{ background: theme.background }}>
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
      <Controls />
      <StartButton />
    </div>
  );
}

export default App; 