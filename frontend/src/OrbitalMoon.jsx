import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';

function Moon({ scrollProgress = 0, baseSpeed = 0.05, ...props }) {
  const moonRef = useRef();
  
  // High-res moon texture from three.js examples repository
  const colorMap = useTexture('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/moon_1024.jpg');

  // We use a ref to store the target rotation from scroll to allow for smooth lerping (interpolation)
  const targetScrollRotation = useRef(0);

  // Continuously rotate the moon, and sync it with scroll smoothly
  useFrame((state, delta) => {
    if (moonRef.current) {
      // We want the moon to complete roughly 1 full extra spin (Math.PI * 2) across the 31 days.
      const newScrollTarget = scrollProgress * Math.PI * 2.5;
      
      // Smoothly interpolate the scroll rotation so it doesn't snap when activeDay changes
      targetScrollRotation.current = THREE.MathUtils.lerp(
        targetScrollRotation.current,
        newScrollTarget,
        delta * 3 // Interpolation speed
      );

      // Final rotation = Continuous time rotation + Smoothed scroll rotation
      moonRef.current.rotation.y = (state.clock.elapsedTime * baseSpeed) + targetScrollRotation.current;
      
      // Optional: Add a very slight tilt (orbit effect) based on progress
      moonRef.current.rotation.z = Math.sin(scrollProgress * Math.PI) * 0.2;
    }
  });

  return (
    <mesh ref={moonRef} {...props}>
      <sphereGeometry args={[2.5, 64, 64]} />
      <meshStandardMaterial 
        map={colorMap} 
        roughness={0.9} 
        metalness={0.1} 
      />
    </mesh>
  );
}

export default function OrbitalMoon({ 
  className = "moon-container",
  style = { width: '100%', height: '400px', cursor: 'grab' },
  scrollProgress = 0,
  moonProps = {}
}) {
  return (
    <div style={style} className={className}>
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
          <Moon scrollProgress={scrollProgress} {...moonProps} />
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
