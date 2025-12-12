import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Suspense } from 'react'

/**
 * Composant Scene - Conteneur principal pour la scène 3D Three.js
 * Utilise @react-three/fiber pour intégrer Three.js avec React
 */
function Scene({ children, cameraPosition = [0, 5, 10] }) {
  return (
    <Canvas
      shadows
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100vh', background: 'linear-gradient(to bottom, #0a0a1a 0%, #1a1a2e 100%)' }}
    >
      <Suspense fallback={null}>
        {/* Caméra avec position personnalisable */}
        <PerspectiveCamera
          makeDefault
          position={cameraPosition}
          fov={50}
        />
        
        {/* Éclairage ambiant pour la scène */}
        <ambientLight intensity={0.3} />
        
        {/* Lumière directionnelle principale */}
        <directionalLight
          position={[10, 10, 5]}
          intensity={0.5}
          castShadow
        />
        
        {/* Contrôles de la caméra (rotation, zoom, pan) */}
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={20}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
        />
        
        {/* Contenu de la scène (sapin, lumières, ornements) */}
        {children}
      </Suspense>
    </Canvas>
  )
}

export default Scene

