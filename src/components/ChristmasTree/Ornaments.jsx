import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Composant Ornament - Un ornement individuel décoratif
 */
function Ornament({ 
  position, 
  color = '#FF0000',
  size = 0.15,
  onClick,
  isInteractive = true
}) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  // Animation de rotation légère
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5
      // Effet de rebond si cliqué
      if (clicked) {
        const bounce = Math.sin(state.clock.elapsedTime * 5) * 0.1
        meshRef.current.scale.setScalar(1 + bounce)
      }
    }
  })

  const handleClick = () => {
    if (isInteractive && onClick) {
      setClicked(!clicked)
      onClick()
    }
  }

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={handleClick}
      onPointerOver={() => isInteractive && setHovered(true)}
      onPointerOut={() => isInteractive && setHovered(false)}
      scale={hovered ? 1.2 : 1}
      castShadow
    >
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={clicked ? color : '#000000'}
        emissiveIntensity={clicked ? 0.8 : 0}
        metalness={0.8}
        roughness={0.2}
      />
      {/* Reflet brillant */}
      <mesh position={[size * 0.3, size * 0.3, size * 0.3]}>
        <sphereGeometry args={[size * 0.2, 8, 8]} />
        <meshStandardMaterial
          color="#FFFFFF"
          transparent
          opacity={0.6}
        />
      </mesh>
    </mesh>
  )
}

/**
 * Composant Ornaments - Gère tous les ornements du sapin
 */
function Ornaments({ 
  treeRadius = 1.2,
  onOrnamentClick,
  isInteractive = true
}) {
  // Configuration des couleurs d'ornements
  const ornamentColors = useMemo(() => [
    '#FF0000', // Rouge
    '#00FF00', // Vert
    '#0000FF', // Bleu
    '#FFFF00', // Jaune
    '#FF00FF', // Magenta
    '#00FFFF', // Cyan
    '#FFA500', // Orange
    '#FF1493', // Rose
  ], [])

  // Génération des positions d'ornements
  const ornamentPositions = useMemo(() => {
    const positions = []
    const numLevels = 6
    const ornamentsPerLevel = [8, 7, 6, 5, 4, 3] // Moins d'ornements en haut

    for (let level = 0; level < numLevels; level++) {
      const y = 0.5 + (level * 0.9) // Position verticale
      const radius = treeRadius * (1 - level * 0.15) // Rayon décroissant
      const count = ornamentsPerLevel[level]

      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        // Légère variation verticale pour plus de réalisme
        // eslint-disable-next-line react-hooks/purity
        const yVariation = (Math.random() - 0.5) * 0.3
        positions.push({
          position: [x, y + yVariation, z],
          // eslint-disable-next-line react-hooks/purity
          color: ornamentColors[Math.floor(Math.random() * ornamentColors.length)],
          // eslint-disable-next-line react-hooks/purity
          size: 0.12 + Math.random() * 0.06
        })
      }
    }

    return positions
  }, [treeRadius, ornamentColors])

  return (
    <group>
      {ornamentPositions.map((ornament, index) => (
        <Ornament
          key={`ornament-${index}`}
          position={ornament.position}
          color={ornament.color}
          size={ornament.size}
          onClick={() => onOrnamentClick && onOrnamentClick(index)}
          isInteractive={isInteractive}
        />
      ))}
    </group>
  )
}

export default Ornaments

