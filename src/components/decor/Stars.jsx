import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Composant Star - Une étoile individuelle
 */
function Star({ 
  position, 
  size = 0.05,
  color = '#FFFFFF',
  twinkleSpeed = 1
}) {
  const meshRef = useRef()

  // Animation de scintillement
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime
      const twinkle = Math.sin(time * twinkleSpeed * 2 + position[0] * 10) * 0.5 + 0.5
      meshRef.current.material.emissiveIntensity = 0.3 + twinkle * 0.7
      meshRef.current.material.opacity = 0.6 + twinkle * 0.4
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 8, 8]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        transparent
        opacity={0.8}
      />
    </mesh>
  )
}

/**
 * Composant Stars - Gère toutes les étoiles dans le ciel
 */
function Stars({ 
  enabled = true,
  count = 200,
  radius = 30,
  twinkleSpeed = 1
}) {
  // Configuration des couleurs d'étoiles
  const starColors = useMemo(() => [
    '#FFFFFF', // Blanc
    '#FFD700', // Or
    '#87CEEB', // Bleu ciel
    '#FFA500', // Orange
    '#FF69B4', // Rose
  ], [])

  // Génération des positions des étoiles dans une sphère
  const starsPositions = useMemo(() => {
    const positions = []
    
    for (let i = 0; i < count; i++) {
      // Distribution sur une sphère (hémisphère supérieur)
      const theta = Math.random() * Math.PI / 2 // 0 à 90 degrés (hémisphère supérieur)
      const phi = Math.random() * Math.PI * 2 // 0 à 360 degrés
      
      const x = Math.sin(theta) * Math.cos(phi) * radius
      const y = Math.cos(theta) * radius // Toujours positif (au-dessus)
      const z = Math.sin(theta) * Math.sin(phi) * radius

      positions.push({
        position: [x, y, z],
        size: 0.03 + Math.random() * 0.04,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        twinkleSpeed: 0.5 + Math.random() * 1.5
      })
    }

    return positions
  }, [count, radius, starColors])

  if (!enabled) {
    return null
  }

  return (
    <group>
      {starsPositions.map((star, index) => (
        <Star
          key={`star-${index}`}
          position={star.position}
          size={star.size}
          color={star.color}
          twinkleSpeed={star.twinkleSpeed * twinkleSpeed}
        />
      ))}
    </group>
  )
}

export default Stars

