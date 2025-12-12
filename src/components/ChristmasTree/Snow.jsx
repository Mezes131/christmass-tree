import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Composant Snow - Effet de neige qui tombe avec particules Three.js
 */
function Snow({ 
  count = 1000,
  speed = 1,
  size = 0.02,
  enabled = true,
  windStrength = 0.1
}) {
  const meshRef = useRef()

  // Création des positions et vitesses des particules
  const { positions, velocities, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    const particleSizes = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // Position initiale aléatoire dans un volume
      positions[i * 3] = (Math.random() - 0.5) * 20 // x
      positions[i * 3 + 1] = Math.random() * 30 + 5 // y (commence en haut)
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20 // z

      // Vitesse initiale (chute + vent)
      velocities[i * 3] = (Math.random() - 0.5) * windStrength // vent horizontal
      velocities[i * 3 + 1] = -Math.random() * 0.5 - 0.5 // vitesse de chute
      velocities[i * 3 + 2] = (Math.random() - 0.5) * windStrength // vent en profondeur

      // Taille aléatoire pour chaque flocon
      particleSizes[i] = Math.random() * size + size * 0.5
    }

    return { positions, velocities, sizes: particleSizes }
  }, [count, windStrength, size])

  // Animation des particules
  useFrame((state, delta) => {
    if (!meshRef.current || !enabled) return

    const positions = meshRef.current.geometry.attributes.position.array
    const time = state.clock.elapsedTime

    for (let i = 0; i < count; i++) {
      const i3 = i * 3

      // Mise à jour de la position avec la vitesse
      positions[i3] += velocities[i3] * speed * delta
      positions[i3 + 1] += velocities[i3 + 1] * speed * delta
      positions[i3 + 2] += velocities[i3 + 2] * speed * delta

      // Effet de vent oscillant
      const wind = Math.sin(time * 0.5 + i * 0.01) * windStrength * 0.5
      positions[i3] += wind * delta

      // Réinitialisation si le flocon tombe en dessous du sol
      if (positions[i3 + 1] < -5) {
        positions[i3] = (Math.random() - 0.5) * 20
        positions[i3 + 1] = 30 + Math.random() * 10
        positions[i3 + 2] = (Math.random() - 0.5) * 20
      }

      // Réinitialisation si le flocon sort des limites horizontales
      if (Math.abs(positions[i3]) > 15) {
        positions[i3] = (Math.random() - 0.5) * 10
      }
      if (Math.abs(positions[i3 + 2]) > 15) {
        positions[i3 + 2] = (Math.random() - 0.5) * 10
      }
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true
  })

  if (!enabled) {
    return null
  }

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color="#ffffff"
        transparent
        opacity={0.8}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

export default Snow

