import { useRef, useMemo } from 'react'
import * as THREE from 'three'

/**
 * Composant Gift - Une boîte cadeau individuelle
 */
function Gift({ 
  position, 
  size = [0.5, 0.5, 0.5],
  boxColor = '#FF0000',
  ribbonColor = '#FFFFFF',
  rotation = [0, 0, 0]
}) {
  const meshRef = useRef()
  const ribbonRef = useRef()

  // Animation de rotation légère
//   useFrame((state, delta) => {
//     if (meshRef.current) {
//       meshRef.current.rotation.y += delta * 0.2
//     }
//   })

  return (
    <group position={position} rotation={rotation}>
      {/* Boîte principale */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial 
          color={boxColor}
          roughness={0.6}
          metalness={0.2}
        />
      </mesh>

      {/* Ruban horizontal */}
      <mesh 
        ref={ribbonRef}
        position={[0, 0, 0]}
        castShadow
      >
        <boxGeometry args={[size[0] * 1.1, size[1] * 0.15, size[2] * 1.1]} />
        <meshStandardMaterial 
          color={ribbonColor}
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>

      {/* Ruban vertical */}
      <mesh 
        position={[0, 0, 0]}
        castShadow
      >
        <boxGeometry args={[size[0] * 0.15, size[1] * 1.1, size[2] * 1.1]} />
        <meshStandardMaterial 
          color={ribbonColor}
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>

      {/* Nœud sur le dessus */}
      <mesh position={[0, size[1] / 2 + 0.05, 0]}>
        <boxGeometry args={[size[0] * 0.3, size[1] * 0.2, size[2] * 0.3]} />
        <meshStandardMaterial 
          color={ribbonColor}
          roughness={0.2}
          metalness={0.6}
        />
      </mesh>
    </group>
  )
}

/**
 * Composant Gifts - Gère tous les présents sous le sapin
 */
function Gifts({ 
  enabled = true,
  count = 5,
  treeRadius = 1.2
}) {
  // Configuration des couleurs de boîtes
  const boxColors = useMemo(() => [
    '#FF0000', // Rouge
    '#00FF00', // Vert
    '#0000FF', // Bleu
    '#FFFF00', // Jaune
    '#FF00FF', // Magenta
    '#00FFFF', // Cyan
    '#FFA500', // Orange
    '#9370DB', // Violet
  ], [])

  const ribbonColors = useMemo(() => [
    '#FFFFFF', // Blanc
    '#FFD700', // Or
    '#C0C0C0', // Argent
  ], [])

  // Génération des positions et configurations des cadeaux
  const giftsConfig = useMemo(() => {
    const gifts = []
    const angleStep = (Math.PI * 2) / count
    const baseRadius = treeRadius + 0.8

    for (let i = 0; i < count; i++) {
      // eslint-disable-next-line react-hooks/purity
      const angle = i * angleStep + (Math.random() - 0.5) * 0.5
      // eslint-disable-next-line react-hooks/purity
      const radius = baseRadius + (Math.random() - 0.5) * 0.5
      
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      // eslint-disable-next-line react-hooks/purity
      const y = 0.25 + Math.random() * 0.1 // Légère variation de hauteur

      // Tailles variées
      // eslint-disable-next-line react-hooks/purity
      const sizeVariation = 0.3 + Math.random() * 0.4
      const size = [
        sizeVariation,
        // eslint-disable-next-line react-hooks/purity
        sizeVariation * (0.8 + Math.random() * 0.4),
        sizeVariation
      ]

      // Rotation aléatoire
      const rotation = [
        0,
        // eslint-disable-next-line react-hooks/purity
        Math.random() * Math.PI * 2,
        // eslint-disable-next-line react-hooks/purity
        (Math.random() - 0.5) * 0.2
      ]

      gifts.push({
        position: [x, y, z],
        size,
        // eslint-disable-next-line react-hooks/purity
        boxColor: boxColors[Math.floor(Math.random() * boxColors.length)],
        // eslint-disable-next-line react-hooks/purity
        ribbonColor: ribbonColors[Math.floor(Math.random() * ribbonColors.length)],
        rotation
      })
    }

    return gifts
  }, [count, treeRadius, boxColors, ribbonColors])

  if (!enabled) {
    return null
  }

  return (
    <group>
      {giftsConfig.map((gift, index) => (
        <Gift
          key={`gift-${index}`}
          position={gift.position}
          size={gift.size}
          boxColor={gift.boxColor}
          ribbonColor={gift.ribbonColor}
          rotation={gift.rotation}
        />
      ))}
    </group>
  )
}

export default Gifts

