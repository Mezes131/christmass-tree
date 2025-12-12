import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Composant Ground - Sol avec texture de neige et ombres
 */
function Ground({ 
  enabled = true,
  size = 20,
  snowAccumulation = true,
  receiveShadows = true
}) {
  const meshRef = useRef()

  if (!enabled) {
    return null
  }

  return (
    <group>
      {/* Sol principal */}
      <mesh
        ref={meshRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow={receiveShadows}
      >
        <planeGeometry args={[size, size, 32, 32]} />
        <meshStandardMaterial
          color="#F0F8FF" // Bleu très clair pour la neige
          roughness={0.9}
          metalness={0.1}
          side={THREE.FrontSide}
        />
      </mesh>
      
      {/* Couche de neige accumulée (optionnel) */}
      {snowAccumulation && (
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.01, 0]}
          receiveShadow
        >
          <planeGeometry args={[size * 0.8, size * 0.8]} />
          <meshStandardMaterial
            color="#FFFFFF"
            roughness={0.95}
            metalness={0.05}
            transparent
            opacity={0.3}
            side={THREE.FrontSide}
          />
        </mesh>
      )}
    </group>
  )
}

export default Ground

