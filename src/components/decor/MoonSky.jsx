import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Composant Moon - La lune dans le ciel
 */
function Moon({ 
  position = [8, 8, -10],
  size = 1.5,
  glowIntensity = 0.5
}) {
  const meshRef = useRef()
  const glowRef = useRef()
  const lightRef = useRef()

  // Animation de rotation très lente
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.05
    }
    
    // Animation de lueur
    if (glowRef.current) {
      const time = state.clock.elapsedTime
      const pulse = Math.sin(time * 0.5) * 0.1 + 0.9
      glowRef.current.material.emissiveIntensity = glowIntensity * pulse
    }
    
    // Animation de la lumière (synchronisée avec la lueur)
    if (lightRef.current) {
      const time = state.clock.elapsedTime
      const pulse = Math.sin(time * 0.5) * 0.1 + 0.9
      lightRef.current.intensity = 1.2 * pulse
    }
  })

  return (
    <group position={position}>
      {/* PointLight depuis la lune */}
      <pointLight
        ref={lightRef}
        color="#FFF8DC"
        intensity={1.2}
        distance={25}
        decay={2}
        castShadow={false}
      />
      
      {/* Lueur autour de la lune */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[size * 1.3, 16, 16]} />
        <meshStandardMaterial
          color="#FFEAA7"
          emissive="#FFEAA7"
          emissiveIntensity={glowIntensity}
          transparent
          opacity={0.06}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Lune principale */}
      <mesh ref={meshRef} castShadow>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color="#F0E68C"
          emissive="#FFEAA7"
          emissiveIntensity={0.93}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Cratères (détails) - mémorisés pour performance */}
      {useMemo(() => {
        const craters = []
        for (let i = 0; i < 16; i++) {
          const angle = (i / 5) * Math.PI * 2
          // eslint-disable-next-line react-hooks/purity
          const distance = size * (0.3 + Math.random() * 0.4)
          const x = Math.cos(angle) * distance
          const z = Math.sin(angle) * distance
          // eslint-disable-next-line react-hooks/purity
          const craterSize = 0.1 + Math.random() * 0.15
          craters.push({ position: [x, z * 0.3, z], size: craterSize })
        }
        return craters
      }, [size]).map((crater, i) => (
        <mesh key={`crater-${i}`} position={crater.position}>
          <sphereGeometry args={[crater.size, 8, 8]} />
          <meshStandardMaterial
            color="#D4AF37"
            roughness={0.9}
            metalness={0.05}
          />
        </mesh>
      ))}
    </group>
  )
}

/**
 * Composant MoonSky - Lune et ciel étoilé combinés
 */
function MoonSky({ 
  enabled = true,
  moonPosition = [8, 8, -10],
  moonSize = 1.5,
  moonGlowIntensity = 1.5
}) {
  if (!enabled) {
    return null
  }

  return (
    <group>
      <Moon
        position={moonPosition}
        size={moonSize}
        glowIntensity={moonGlowIntensity}
      />
    </group>
  )
}

export default MoonSky

