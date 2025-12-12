import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Composant StarField - Champ d'étoiles optimisé avec système de particules
 * Utilise PointsMaterial pour un rendu performant avec beaucoup d'étoiles
 */
function StarField({ 
  enabled = true,
  count = 5000,
  spreadDistance = 200,
  minDistance = 20,
  twinkleSpeed = 0.5,
  rotationSpeed = 0.01
}) {
  const pointsRef = useRef()
  const groupRef = useRef()

  // Génération des positions, couleurs et tailles des étoiles
  const { positions, colors, sizes } = useMemo(() => {
    const positionsArray = new Float32Array(count * 3)
    const colorsArray = new Float32Array(count * 3)
    const sizesArray = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3

      // Distribution uniforme dans une coquille sphérique
      // eslint-disable-next-line react-hooks/purity
      const radius = minDistance + Math.random() * (spreadDistance - minDistance)
      // eslint-disable-next-line react-hooks/purity
      const theta = Math.random() * Math.PI * 2 // Angle horizontal
      // eslint-disable-next-line react-hooks/purity
      const phi = Math.acos(Math.random() * 2 - 1) // Angle vertical pour distribution uniforme

      positionsArray[i3] = radius * Math.sin(phi) * Math.cos(theta)
      positionsArray[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positionsArray[i3 + 2] = radius * Math.cos(phi)

      // Couleurs variées pour les étoiles (blanc, bleu, jaune, rouge)
      // eslint-disable-next-line react-hooks/purity
      const colorType = Math.random()
      let starColor
      if (colorType < 0.6) {
        // Étoiles blanches/bleues (majorité)
        starColor = new THREE.Color().setHSL(
          // eslint-disable-next-line react-hooks/purity
          0.55 + Math.random() * 0.1,
          0.2,
          // eslint-disable-next-line react-hooks/purity
          0.7 + Math.random() * 0.3
        )
      } else if (colorType < 0.85) {
        // Étoiles jaunes
        starColor = new THREE.Color().setHSL(
          // eslint-disable-next-line react-hooks/purity
          0.1 + Math.random() * 0.1,
          0.5,
          // eslint-disable-next-line react-hooks/purity
          0.6 + Math.random() * 0.3
        )
      } else {
        // Étoiles rouges/orange (rares)
        starColor = new THREE.Color().setHSL(
          // eslint-disable-next-line react-hooks/purity
          Math.random() * 0.1,
          0.8,
          // eslint-disable-next-line react-hooks/purity
          0.5 + Math.random() * 0.3
        )
      }

      colorsArray[i3] = starColor.r
      colorsArray[i3 + 1] = starColor.g
      colorsArray[i3 + 2] = starColor.b

      // Tailles variées pour les étoiles
      // eslint-disable-next-line react-hooks/purity
      sizesArray[i] = 0.05 + Math.random() * 0.15
    }

    return {
      positions: positionsArray,
      colors: colorsArray,
      sizes: sizesArray
    }
  }, [count, spreadDistance, minDistance])

  // Animation de scintillement subtile et rotation
  useFrame((state, delta) => {
    // Rotation autour de l'axe Y
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * rotationSpeed
    }
    
    // Animation de scintillement
    if (pointsRef.current && pointsRef.current.material) {
      const time = state.clock.elapsedTime
      // Animation très subtile pour ne pas surcharger
      const pulse = Math.sin(time * twinkleSpeed) * 0.1 + 0.9
      pointsRef.current.material.opacity = 0.7 + pulse * 0.2
    }
  })

  if (!enabled) {
    return null
  }

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
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
        size={0.1}
        sizeAttenuation={true}
        vertexColors={true}
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
      </points>
    </group>
  )
}

export default StarField
