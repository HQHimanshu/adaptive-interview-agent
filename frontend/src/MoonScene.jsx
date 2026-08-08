import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';

function Moon() {
  const moonRef = useRef();
  
  // High-res moon texture from three.js examples repository
  const colorMap = useTexture('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/moon_1024.jpg');

  // Continuously rotate the moon slowly, and sync it with scroll
  useFrame((state) => {
    if (moonRef.current) {
      // Rotate based on time (very slow) AND window scroll position (fast)
      moonRef.current.rotation.y = (state.clock.elapsedTime * 0.03) + (window.scrollY * 0.004);
      // We removed the position.y shift so the moon doesn't clip out of the canvas bounds
    }
  });

  return (
    <mesh ref={moonRef}>
      <sphereGeometry args={[2.5, 64, 64]} />
      <meshStandardMaterial 
        map={colorMap} 
        roughness={0.9} 
        metalness={0.1} 
      />
    </mesh>
  );
}

export default function MoonScene() {
  return (
    <div style={{ width: '100%', height: '400px', cursor: 'grab' }} className="moon-container">
      <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
        {/* Very faint ambient light so the dark side isn't pitch black */}
        <ambientLight intensity={0.05} />
        
        {/* Strong directional light coming from the top left to create a beautiful crescent/phase effect */}
        <directionalLight 
          position={[-5, 3, 5]} 
          intensity={2.5} 
          color="#ffffff" 
        />
        
        <Suspense fallback={null}>
          <Moon />
        </Suspense>
        
        {/* Allow user to spin the moon manually. Disable zoom and pan to keep it anchored. */}
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          makeDefault
        />
      </Canvas>
    </div>
  );
}
