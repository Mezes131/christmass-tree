import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Suspense } from 'react'
import ChristmasTree from './ChristmasTree/ChristmasTree'
import { SnowEffect } from './ChristmasTree/ChristmasTree'
import DecorManager from './decor/DecorManager'
import '../styles/lights.css'

/**
 * Composant Scene - Conteneur principal pour la scène 3D Three.js
 * Utilise @react-three/fiber pour intégrer Three.js avec React
 */
function Scene({ 
  children, 
  cameraPosition = [0, 3, 10],
  // Propriétés pour les lumières
  lightsOn = true,
  lightMode = 'static',
  lightSpeed = 1,
  lightIntensity = 1,
  lightColorScheme = 'multicolor',
  // Propriétés pour la neige
  snowEnabled = false,
  snowCount = 1000,
  snowSpeed = 1,
  snowSize = 0.02,
  windStrength = 0.1,
  // Propriétés pour les décors
  giftsEnabled = true,
  starsEnabled = true,
  groundEnabled = true,
  moonSkyEnabled = true
}) {
  const handleOrnamentClick = (ornamentIndex) => {
    console.log(`Ornement ${ornamentIndex} cliqué!`)
  }

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
        
        {/* Lumière supplémentaire pour mieux éclairer le sapin */}
        <pointLight
          position={[-5, 5, 5]}
          intensity={0.4}
          color="#ffffff"
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
          target={[0, 2.5, 0]}
        />
        
        {/* Sapin de Noël */}
        <ChristmasTree 
          position={[0, 0, 0]}
          onOrnamentClick={handleOrnamentClick}
          isInteractive={true}
          lightsOn={lightsOn}
          lightMode={lightMode}
          lightSpeed={lightSpeed}
          lightIntensity={lightIntensity}
          lightColorScheme={lightColorScheme}
          snowEnabled={snowEnabled}
          snowCount={snowCount}
          snowSpeed={snowSpeed}
          snowSize={snowSize}
          windStrength={windStrength}
        />
        
        {/* Effet de neige */}
        <SnowEffect
          enabled={snowEnabled}
          count={snowCount}
          speed={snowSpeed}
          size={snowSize}
          windStrength={windStrength}
        />
        
        {/* Décors de la scène */}
        <DecorManager
          giftsEnabled={giftsEnabled}
          starsEnabled={starsEnabled}
          groundEnabled={groundEnabled}
          moonSkyEnabled={moonSkyEnabled}
        />
        
        {/* Contenu supplémentaire de la scène (lumières, effets, etc.) */}
        {children}
      </Suspense>
    </Canvas>
  )
}

export default Scene

