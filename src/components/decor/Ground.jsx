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

  // Mémorisation de la géométrie pour optimiser les performances
  const groundGeometry = useMemo(() => {
    return new THREE.PlaneGeometry(size, size, 32, 32)
  }, [size])

  const snowGeometry = useMemo(() => {
    return new THREE.PlaneGeometry(size * 0.8, size * 0.8)
  }, [size])

  // Mémorisation des matériaux
  const groundMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#F0F8FF',
      roughness: 0.9,
      metalness: 0.1,
      side: THREE.FrontSide
    })
  }, [])

  const snowMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#FFFFFF',
      roughness: 0.95,
      metalness: 0.05,
      transparent: true,
      opacity: 0.3,
      side: THREE.FrontSide
    })
  }, [])

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
        geometry={groundGeometry}
        material={groundMaterial}
      />
      
      {/* Couche de neige accumulée (optionnel) */}
      {snowAccumulation && (
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.01, 0]}
          receiveShadow
          geometry={snowGeometry}
          material={snowMaterial}
        />
      )}
    </group>
  )
}

export default Ground

