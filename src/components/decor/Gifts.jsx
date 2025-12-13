import { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Fonction pour créer une texture procédurale de tissu satin (normal map fine)
 */
function createFabricNormalTexture(width = 512, height = 512) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  
  // Créer un motif de tissage satin plus fin et réaliste
  const imageData = ctx.createImageData(width, height)
  const data = imageData.data
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4
      
      // Motif de tissage satin avec plusieurs fréquences pour plus de réalisme
      // Tissage fin (haute fréquence)
      const fineWarp = Math.sin(x * 0.3) * 0.15 + 0.85
      const fineWeft = Math.sin(y * 0.3) * 0.15 + 0.85
      
      // Tissage moyen (moyenne fréquence)
      const mediumWarp = Math.sin(x * 0.15 + 1.2) * 0.2 + 0.8
      const mediumWeft = Math.sin(y * 0.15 + 1.2) * 0.2 + 0.8
      
      // Motif de satin (alternance de brillance)
      const satinPattern = Math.sin((x + y) * 0.2) * 0.1 + 0.9
      
      // Combiner les motifs
      const pattern = (fineWarp * fineWeft * 0.4 + mediumWarp * mediumWeft * 0.4 + satinPattern * 0.2)
      
      // Normal map (RGB -> XYZ normal) avec variations plus subtiles
      const normalX = 128 + (pattern - 0.9) * 30
      const normalY = 128 + (pattern - 0.9) * 30
      const normalZ = 255 - (pattern - 0.9) * 10 // Légère variation en Z
      
      data[index] = Math.max(0, Math.min(255, normalX))     // R (X normal)
      data[index + 1] = Math.max(0, Math.min(255, normalY))  // G (Y normal)
      data[index + 2] = Math.max(0, Math.min(255, normalZ)) // B (Z normal)
      data[index + 3] = 255                                 // Alpha
    }
  }
  
  ctx.putImageData(imageData, 0, 0)
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(8, 8) 
  return texture
}

/**
 * Fonction pour créer une texture diffuse de tissu (couleur avec variations subtiles)
 */
function createFabricDiffuseTexture(color, width = 512, height = 512) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  
  const baseColor = new THREE.Color(color)
  const imageData = ctx.createImageData(width, height)
  const data = imageData.data
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4
      
      // Variations subtiles de couleur pour simuler le tissage
      const variation = (Math.sin(x * 0.2) * Math.cos(y * 0.2) * 0.05) + 1.0
      
      data[index] = Math.max(0, Math.min(255, baseColor.r * 255 * variation))     // R
      data[index + 1] = Math.max(0, Math.min(255, baseColor.g * 255 * variation)) // G
      data[index + 2] = Math.max(0, Math.min(255, baseColor.b * 255 * variation)) // B
      data[index + 3] = 255                                                         // Alpha
    }
  }
  
  ctx.putImageData(imageData, 0, 0)
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(8, 8)
  return texture
}

/**
 * Fonction pour créer un matériau de tissu satin réaliste
 */
function createFabricMaterial(color, normalTexture, diffuseTexture) {
  return new THREE.MeshPhysicalMaterial({
    map: diffuseTexture,    // Texture diffuse pour variations de couleur
    color: color,           // Couleur de base
    roughness: 0.6,         // Tissu avec brillance satinée
    metalness: 0.0,         // Pas de métal, c'est du tissu
    clearcoat: 0.4,         // Couche brillante (satin)
    clearcoatRoughness: 0.3, // Rugosité de la couche brillante
    sheen: 0.7,             // Brillance caractéristique du tissu satiné (augmentée)
    sheenRoughness: 0.5,    // Rugosité de la brillance (plus lisse)
    sheenColor: new THREE.Color(1, 1, 0.95), // Brillance légèrement chaude
    normalMap: normalTexture,
    normalScale: new THREE.Vector2(0.5, 0.5), // Intensité augmentée pour plus de relief
    side: THREE.DoubleSide
  })
}

/**
 * Composant Gift - Une boîte cadeau individuelle
 */
function Gift({ 
  position, 
  size = [0.5, 0.5, 0.5],
  boxColor = '#FF0000',
  ribbonColor = '#FFFFFF',
  rotation = [0, 0, 0],
  fabricNormalTexture, // Texture partagée passée en prop
  fabricDiffuseTexture // Texture diffuse partagée
}) {
  const groupRef = useRef()
  const meshRef = useRef()
  const ribbonRef = useRef()

  // Constantes physiques
  const GRAVITY = -9.8 * 0.5 // Gravité réduite pour une animation plus lente
  const GROUND_LEVEL = -0.32 // Surface du sol (position Y du bas de la boîte)
  const RESTITUTION = 0.6 // Coefficient de restitution (rebond)
  const MAX_BOUNCES = 5 // Nombre maximum de rebonds
  const halfHeight = size[1] / 2
  const initialY = useMemo(() => GROUND_LEVEL + halfHeight, [halfHeight, GROUND_LEVEL]) // Position initiale sur le sol

  // État pour l'animation de rebond vertical
  const [isBouncing, setIsBouncing] = useState(false)
  const physicsRef = useRef({
    velocityY: 0,
    positionY: initialY,
    rotationX: rotation[0],
    rotationY: rotation[1],
    rotationZ: rotation[2],
    angularVelocityX: 0,
    angularVelocityY: 0,
    angularVelocityZ: 0,
    isActive: false,
    bounceCount: 0
  })

  // Initialiser la position Y sur le sol au montage
  useEffect(() => {
    physicsRef.current.positionY = initialY
    if (groupRef.current) {
      groupRef.current.position.y = initialY
    }
  }, [initialY])

  // Gestionnaire de clic pour déclencher l'animation de rebond vertical
  const handleClick = (e) => {
    e.stopPropagation()
    
    if (!isBouncing) {
      setIsBouncing(true)
      physicsRef.current.isActive = true
      physicsRef.current.bounceCount = 0
      
      // S'assurer que la position Y actuelle est bien synchronisée
      if (groupRef.current) {
        physicsRef.current.positionY = groupRef.current.position.y
      }
      
      // Vitesse verticale initiale vers le haut (rebond vertical uniquement)
      physicsRef.current.velocityY = 3.0 + Math.random() * 1.5 // Saut entre 3.0 et 4.5 (augmenté pour être plus visible)
      
      // Rotations aléatoires pendant le rebond
      physicsRef.current.angularVelocityX = (Math.random() - 0.5) * 6
      physicsRef.current.angularVelocityY = (Math.random() - 0.5) * 8
      physicsRef.current.angularVelocityZ = (Math.random() - 0.5) * 6
    }
  }

  // Animation de physique avec rebond vertical uniquement
  useFrame((state, delta) => {
    if (!groupRef.current || !isBouncing || !physicsRef.current.isActive) return

    const physics = physicsRef.current
    const halfHeight = size[1] / 2
    const bottomY = physics.positionY - halfHeight

    // Appliquer la gravité
    physics.velocityY += GRAVITY * delta

    // Mettre à jour la position Y uniquement (mouvement vertical uniquement)
    physics.positionY += physics.velocityY * delta

    // Collision avec le sol - seulement si on descend (velocityY < 0) ET qu'on est au niveau du sol ou en dessous
    if (bottomY <= GROUND_LEVEL && physics.velocityY < 0) {
      // Corriger la position pour être exactement sur le sol
      physics.positionY = GROUND_LEVEL + halfHeight
      
      // Rebond si la vitesse descendante est suffisante et qu'on n'a pas dépassé le max
      if (Math.abs(physics.velocityY) > 0.1 && physics.bounceCount < MAX_BOUNCES) {
        // Inverser la vitesse et appliquer le coefficient de restitution (rebond vers le haut)
        physics.velocityY = Math.abs(physics.velocityY) * RESTITUTION // Rebond vers le haut
        physics.bounceCount++
        
        // Réduire les rotations à chaque rebond
        physics.angularVelocityX *= 0.9
        physics.angularVelocityY *= 0.9
        physics.angularVelocityZ *= 0.9
      } else {
        // Arrêter le mouvement vertical si la vitesse est trop faible ou max rebonds atteint
        physics.velocityY = 0
        
        // Arrêter les rotations progressivement
        physics.angularVelocityX *= 0.95
        physics.angularVelocityY *= 0.95
        physics.angularVelocityZ *= 0.95
        
        // Arrêter complètement l'animation quand les rotations sont presque arrêtées
        if (Math.abs(physics.angularVelocityX) < 0.1 &&
            Math.abs(physics.angularVelocityY) < 0.1 &&
            Math.abs(physics.angularVelocityZ) < 0.1) {
          physics.angularVelocityX = 0
          physics.angularVelocityY = 0
          physics.angularVelocityZ = 0
          physics.isActive = false
          setIsBouncing(false)
        }
      }
    } else if (bottomY < GROUND_LEVEL) {
      // Si on est en dessous du sol (peut arriver), corriger la position
      physics.positionY = GROUND_LEVEL + halfHeight
      if (physics.velocityY < 0) {
        physics.velocityY = 0
      }
    }

    // Mettre à jour les rotations
    physics.rotationX += physics.angularVelocityX * delta
    physics.rotationY += physics.angularVelocityY * delta
    physics.rotationZ += physics.angularVelocityZ * delta

    // Appliquer les transformations (seulement Y change, X et Z restent à leur position initiale)
    groupRef.current.position.y = physics.positionY
    groupRef.current.rotation.x = physics.rotationX
    groupRef.current.rotation.y = physics.rotationY
    groupRef.current.rotation.z = physics.rotationZ
  })

  // Créer le matériau de ruban avec texture de tissu
  const ribbonMaterial = useMemo(() => {
    return createFabricMaterial(ribbonColor, fabricNormalTexture, fabricDiffuseTexture)
  }, [ribbonColor, fabricNormalTexture, fabricDiffuseTexture])

  // Épaisseur plus fine pour les rubans (aspect plus réaliste)
  const ribbonThickness = 0.05 // Encore plus fin pour un aspect plus réaliste
  const ribbonWidth = size[0] * 0.15 // Largeur du ruban proportionnelle à la taille

  // Dimensions du nœud
  const bowSize = Math.min(size[0], size[2]) * 0.4
  const bowHeight = size[1] * 0.15

  // Initialiser la position Y sur le sol
  const positionX = position[0]
  const positionZ = position[2]
  const initialPosition = useMemo(() => [
    positionX,
    initialY,
    positionZ
  ], [positionX, positionZ, initialY])

  return (
    <group 
      ref={groupRef}
      position={initialPosition} 
      rotation={[rotation[0], rotation[1], rotation[2]]}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation()
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={(e) => {
        e.stopPropagation()
        document.body.style.cursor = 'auto'
      }}
    >
      {/* Boîte principale */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial 
          color={boxColor}
          roughness={0.6}
          metalness={0.2}
        />
      </mesh>

      {/* Ruban horizontal - plus fin et avec texture */}
      <mesh 
        ref={ribbonRef}
        position={[0, 0, 0]}
        castShadow
        material={ribbonMaterial}
      >
        <boxGeometry args={[size[0] * 1.15, ribbonThickness, size[2] * 1.15]} />
      </mesh>

      {/* Ruban vertical - plus fin et avec texture */}
      <mesh 
        position={[0, 0, 0]}
        castShadow
        material={ribbonMaterial}
      >
        <boxGeometry args={[ribbonThickness, size[1] * 1.15, size[2] * 1.15]} />
      </mesh>

      {/* Nœud réaliste - Boucle gauche */}
      <mesh 
        position={[-bowSize * 0.3, size[1] / 2 + bowHeight * 0.3, 0]} 
        rotation={[0, 0, Math.PI / 4]}
        castShadow
        material={ribbonMaterial}
      >
        <boxGeometry args={[ribbonWidth, bowHeight, bowSize * 0.6]} />
      </mesh>

      {/* Nœud réaliste - Boucle droite */}
      <mesh 
        position={[bowSize * 0.3, size[1] / 2 + bowHeight * 0.3, 0]} 
        rotation={[0, 0, -Math.PI / 4]}
        castShadow
        material={ribbonMaterial}
      >
        <boxGeometry args={[ribbonWidth, bowHeight, bowSize * 0.6]} />
      </mesh>

      {/* Centre du nœud (nœud central) */}
      <mesh 
        position={[0, size[1] / 2 + bowHeight * 0.2, 0]} 
        castShadow
        material={ribbonMaterial}
      >
        <boxGeometry args={[ribbonWidth * 0.8, bowHeight * 0.6, ribbonWidth * 0.8]} />
      </mesh>

      {/* Extrémités du ruban qui pendent (optionnel, pour plus de réalisme) */}
      <mesh 
        position={[-bowSize * 0.5, size[1] / 2 - bowHeight * 0.2, 0]} 
        rotation={[0.2, 0, 0]}
        castShadow
        material={ribbonMaterial}
      >
        <boxGeometry args={[ribbonWidth * 0.7, size[1] * 0.3, ribbonThickness]} />
      </mesh>
      <mesh 
        position={[bowSize * 0.5, size[1] / 2 - bowHeight * 0.2, 0]} 
        rotation={[-0.2, 0, 0]}
        castShadow
        material={ribbonMaterial}
      >
        <boxGeometry args={[ribbonWidth * 0.7, size[1] * 0.3, ribbonThickness]} />
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
      // Les cadeaux sont initialement sur le sol (Y sera calculé dans le composant Gift)
      const y = 0 // Position Y sera ajustée dans Gift pour être sur le sol

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

  // Créer les textures de tissu une seule fois pour tous les cadeaux (optimisation)
  const fabricNormalTexture = useMemo(() => {
    return createFabricNormalTexture(512, 512)
  }, [])

  // Créer les textures diffuse pour chaque couleur de ruban unique
  const ribbonDiffuseTextures = useMemo(() => {
    const textures = {}
    ribbonColors.forEach(color => {
      textures[color] = createFabricDiffuseTexture(color, 512, 512)
    })
    return textures
  }, [ribbonColors])

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
          fabricNormalTexture={fabricNormalTexture}
          fabricDiffuseTexture={ribbonDiffuseTextures[gift.ribbonColor]}
        />
      ))}
    </group>
  )
}

export default Gifts

