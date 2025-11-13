// frontend/src/components/3d/Molecule3D.jsx
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Molecule3D = () => {
  const moleculeRef = useRef();
  const bondsRef = useRef([]);

  useFrame(({ clock }) => {
    if (moleculeRef.current) {
      moleculeRef.current.rotation.y = clock.getElapsedTime() * 0.2;
      moleculeRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
    }
  });

  const atoms = React.useMemo(() => {
    return [...Array(8)].map((_, i) => {
      const angle = (i / 8) * Math.PI * 2;
      const radius = 2 + Math.random() * 0.5;
      return {
        position: [
          Math.cos(angle) * radius,
          Math.sin(angle) * radius,
          (Math.random() - 0.5) * 1.5
        ],
        color: i % 2 === 0 ? '#38BDF8' : '#0EA5E9',
        size: 0.15 + Math.random() * 0.1
      };
    });
  }, []);

  return (
    <group ref={moleculeRef}>
      {/* Atoms */}
      {atoms.map((atom, i) => (
        <mesh key={`atom-${i}`} position={atom.position}>
          <sphereGeometry args={[atom.size, 32, 32]} />
          <meshStandardMaterial 
            color={atom.color} 
            emissive={atom.color} 
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}

      {/* Bonds */}
      {atoms.map((atom, i) => {
        if (i < atoms.length - 1) {
          const points = [
            new THREE.Vector3(...atom.position),
            new THREE.Vector3(...atoms[i + 1].position),
          ];
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          
          return (
            <line key={`bond-${i}`} geometry={geometry}>
              <lineBasicMaterial 
                color="#22d3ee" 
                linewidth={1}
                transparent
                opacity={0.6}
              />
            </line>
          );
        }
        return null;
      })}
    </group>
  );
};

// Background Particles
export const FloatingParticles = ({ count = 50 }) => {
  const particlesRef = useRef();

  useFrame(({ clock }) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });

  const particles = React.useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10
      ],
      size: Math.random() * 0.02 + 0.005,
      color: Math.random() > 0.5 ? '#38BDF8' : '#22d3ee'
    }));
  }, [count]);

  return (
    <group ref={particlesRef}>
      {particles.map((particle, i) => (
        <mesh key={i} position={particle.position}>
          <sphereGeometry args={[particle.size, 8, 8]} />
          <meshBasicMaterial 
            color={particle.color} 
            transparent 
            opacity={0.4}
          />
        </mesh>
      ))}
    </group>
  );
};