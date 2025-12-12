import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Composant TreeGeometry - Crée la géométrie 3D du sapin de Noël
 * Utilise des cônes empilés pour créer un sapin réaliste
 */
function TreeGeometry({ 
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  enableRotation = false,
  rotationSpeed = 0.5
}) {
  const meshRef = useRef()
  const trunkRef = useRef()

  // Configuration du sapin
  const treeConfig = useMemo(() => ({
    // Tronc
    trunkHeight: 1.5,
    trunkRadius: 0.15,
    trunkColor: '#8B4513', // Marron
    
    // Niveaux de branches (cônes empilés)
    levels: [
      { height: 2, radius: 1.2, y: 0.75, color: '#228B22' },      // Bas
      { height: 1.6, radius: 1.0, y: 1.8, color: '#2E8B57' },    // Milieu-bas
      { height: 1.3, radius: 0.8, y: 2.9, color: '#3CB371' },    // Milieu
      { height: 1.0, radius: 0.6, y: 3.8, color: '#228B22' },    // Milieu-haut
      { height: 0.8, radius: 0.5, y: 4.5, color: '#2E8B57' },    // Haut
      { height: 0.6, radius: 0.4, y: 5.1, color: '#3CB371' },    // Très haut
    ]
  }), [])

  // Animation de rotation optionnelle
  useFrame((state, delta) => {
    if (enableRotation && meshRef.current) {
      meshRef.current.rotation.y += delta * rotationSpeed
    }
  })

  return (
    <group 
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={scale}
    >
      {/* Tronc du sapin */}
      <mesh ref={trunkRef} position={[0, treeConfig.trunkHeight / 2, 0]}>
        <cylinderGeometry 
          args={[
            treeConfig.trunkRadius, 
            treeConfig.trunkRadius, 
            treeConfig.trunkHeight, 
            8
          ]} 
        />
        <meshStandardMaterial 
          color={treeConfig.trunkColor}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Niveaux de branches (cônes) */}
      {treeConfig.levels.map((level, index) => (
        <mesh 
          key={`level-${index}`}
          position={[0, level.y, 0]}
          castShadow
          receiveShadow
        >
          <coneGeometry 
            args={[level.radius, level.height, 8, 1, true]} 
          />
          <meshStandardMaterial 
            color={level.color}
            roughness={0.7}
            metalness={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Étoile au sommet */}
      <mesh position={[0, treeConfig.levels[treeConfig.levels.length - 1].y + 0.4, 0]}>
        <coneGeometry args={[0.15, 0.3, 4]} />
        <meshStandardMaterial 
          color="#FFD700"
          emissive="#FFD700"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  )
}

export default TreeGeometry

