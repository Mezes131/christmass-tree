import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useLightAnimation } from '../../hooks/useThreeScene'
import Garland from './Garland'

/**
 * Composant LightBulb - Une ampoule individuelle de la guirlande
 */
function LightBulb({ 
  position, 
  color = '#FF0000',
  intensity = 1,
  mode = 'static',
  speed = 1,
  index = 0
}) {
  const lightRef = useRef()
  const bulbRef = useRef()
  const timeRef = useRef(0)

  // Utilisation du hook d'animation personnalisé
  useLightAnimation(lightRef, mode, speed)

  // Animation de la lumière selon le mode
  useFrame((state, delta) => {
    if (!lightRef.current || !bulbRef.current) return

    timeRef.current += delta * speed

    let currentIntensity = 1

    switch (mode) {
      case 'twinkle': {
        // Effet de scintillement aléatoire
        const twinkle = Math.sin(timeRef.current * 5 + index) * 0.5 + 0.5
        currentIntensity = 0.3 + twinkle * 0.7
        break
      }

      case 'cascade': {
        // Effet de cascade (allumage progressif de bas en haut)
        const cascadeDelay = index * 0.1
        const cascade = Math.sin((timeRef.current - cascadeDelay) * 0.5) * 0.5 + 0.5
        currentIntensity = cascade
        break
      }

      case 'wave': {
        // Effet de vague
        const wave = Math.sin(timeRef.current * 2 + position[1] * 0.5 + index * 0.3) * 0.5 + 0.5
        currentIntensity = 0.4 + wave * 0.6
        break
      }

      case 'chase': {
        // Effet de poursuite (une lumière après l'autre)
        const chaseIndex = Math.floor(timeRef.current * 2) % 50
        currentIntensity = Math.abs(chaseIndex - index) < 3 ? 1 : 0.2
        break
      }

      case 'static':
      default:
        // Mode statique - intensité constante
        currentIntensity = 1
        break
    }

    lightRef.current.intensity = currentIntensity * intensity

    // Animation de la sphère de l'ampoule
    if (currentIntensity > 0.5) {
      bulbRef.current.material.emissiveIntensity = currentIntensity * 0.8
      bulbRef.current.material.emissive.set(color)
    } else {
      bulbRef.current.material.emissiveIntensity = 0
    }
  })

  return (
    <group position={position}>
      {/* Lumière pointuelle */}
      <pointLight
        ref={lightRef}
        color={color}
        intensity={intensity}
        distance={3}
        decay={2}
        castShadow={false}
      />
      
      {/* Sphère représentant l'ampoule */}
      <mesh ref={bulbRef}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0}
          metalness={0.3}
          roughness={0.2}
        />
      </mesh>
    </group>
  )
}

/**
 * Composant TreeLights - Système de guirlandes lumineuses autour du sapin
 */
function TreeLights({ 
  treeHeight = 5.5,
  treeRadius = 1.2,
  mode = 'static',
  speed = 1,
  intensity = 1,
  isOn = true,
  colorScheme = 'multicolor' // multicolor, red, blue, warm, cool
}) {
  // Configuration des couleurs selon le schéma
  const colorSchemes = useMemo(() => ({
    multicolor: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#FF1493'],
    red: ['#FF0000', '#CC0000', '#990000'],
    blue: ['#0000FF', '#0080FF', '#00BFFF'],
    warm: ['#FF4500', '#FF6347', '#FFA500', '#FFD700'],
    cool: ['#00CED1', '#1E90FF', '#9370DB', '#00BFFF']
  }), [])

  const colors = colorSchemes[colorScheme] || colorSchemes.multicolor

  // Génération des positions des lumières en spirale autour du sapin
  const lightPositions = useMemo(() => {
    const positions = []
    const numSpirals = 3 // Nombre de spirales autour du sapin
    const lightsPerSpiral = 15 // Nombre de lumières par spirale

    for (let spiral = 0; spiral < numSpirals; spiral++) {
      for (let i = 0; i < lightsPerSpiral; i++) {
        const progress = i / lightsPerSpiral // 0 à 1
        const y = 0.3 + progress * (treeHeight - 0.3) // Position verticale
        const angle = (spiral / numSpirals) * Math.PI * 2 + progress * Math.PI * 4 // Angle en spirale
        const radius = treeRadius * (0.7 + progress * 0.3) // Rayon qui augmente avec la hauteur
        
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        
        positions.push({
          position: [x, y, z],
          color: colors[i % colors.length],
          index: spiral * lightsPerSpiral + i
        })
      }
    }

    return positions
  }, [treeHeight, treeRadius, colors])

  if (!isOn) {
    return null
  }

  return (
    <group>
      {/* Fil de guirlande reliant les ampoules */}
      <Garland
        treeHeight={treeHeight}
        treeRadius={treeRadius}
        isOn={isOn}
      />
      
      {/* Ampoules de la guirlande */}
      {lightPositions.map((light, index) => (
        <LightBulb
          key={`light-${index}`}
          position={light.position}
          color={light.color}
          intensity={intensity}
          mode={mode}
          speed={speed}
          index={light.index}
        />
      ))}
    </group>
  )
}

export default TreeLights

