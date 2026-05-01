import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Environment, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const FloatingItem = ({ position, color, args, type = 'box' }: any) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime + position[0]) * 0.002;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <mesh ref={meshRef} position={position}>
        {type === 'box' && <boxGeometry args={args} />}
        {type === 'sphere' && <sphereGeometry args={args} />}
        {type === 'cylinder' && <cylinderGeometry args={args} />}
        <MeshDistortMaterial 
          color={color} 
          speed={2} 
          distort={0.2} 
          radius={1}
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>
    </Float>
  );
};

export const Hero3D = () => {
  return (
    <div className="w-full h-[500px] md:h-[600px] lg:h-[700px] absolute right-0 top-0 pointer-events-none opacity-80 md:opacity-100">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Environment preset="apartment" />
        
        <FloatingItem position={[2, 1, 0]} color="#A8D5BA" args={[1, 1, 1]} type="box" />
        <FloatingItem position={[-1.5, -1.5, 1]} color="#6FBF8F" args={[0.8, 32, 32]} type="sphere" />
        <FloatingItem position={[3, -2, -1]} color="#2F6F4F" args={[0.5, 0.5, 1, 32]} type="cylinder" />
        <FloatingItem position={[-4, 2, -2]} color="#DFF5E3" args={[0.6, 16, 16]} type="sphere" />

        <mesh position={[0, -4, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <shadowMaterial transparent opacity={0.1} />
        </mesh>
      </Canvas>
    </div>
  );
};
