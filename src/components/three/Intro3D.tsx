import { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float, Center, PerspectiveCamera, Environment } from '@react-three/drei';
import { motion, AnimatePresence } from 'motion/react';
import * as THREE from 'three';

const ShopixLogo3D = () => {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <Center>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
        <group ref={meshRef}>
          {/* Stylized "S" or full name */}
          <Text
            fontSize={1.5}
            color="#2F6F4F"
            font="https://fonts.gstatic.com/s/inter/v12/UcCOjFGCW3JfQLYeV74.ttf"
            maxWidth={10}
            lineHeight={1}
            letterSpacing={-0.05}
            textAlign="center"
          >
            SHOPIX
          </Text>
          {/* Geometric decorative elements */}
          <mesh position={[0, -1, -1]}>
            <cylinderGeometry args={[2, 2, 0.1, 32]} />
            <meshStandardMaterial color="#A8D5BA" metalness={0.5} roughness={0.2} />
          </mesh>
        </group>
      </Float>
    </Center>
  );
};

export const Intro3D = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [isSkipped, setIsSkipped] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 1000);
          return 100;
        }
        return prev + 1;
      });
    }, 40); // Approx 4 seconds

    return () => clearInterval(timer);
  }, [onComplete]);

  if (isSkipped) return null;

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center"
    >
      <div className="w-full h-full absolute inset-0">
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <Environment preset="studio" />
          <ShopixLogo3D />
        </Canvas>
      </div>

      <div className="relative z-10 bottom-24 flex flex-col items-center gap-6 w-64">
        <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-green-700" 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs uppercase tracking-[0.3em] font-bold text-green-800">
          Crafting Elegance
        </p>
        <button 
          onClick={() => {
            setIsSkipped(true);
            onComplete();
          }}
          className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-green-800 transition-colors"
        >
          Skip Intro
        </button>
      </div>
    </motion.div>
  );
};
