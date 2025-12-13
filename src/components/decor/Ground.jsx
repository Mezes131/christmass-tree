import { useRef, useMemo } from 'react'
import * as THREE from 'three'

/**
 * Fonction pour générer du bruit procédural multi-octaves (style Perlin noise simplifié)
 */
function generateNoise(x, y, scale = 0.1) {
  // Plusieurs octaves pour un relief plus naturel
  let value = 0
  let amplitude = 1
  let frequency = scale
  
  // Octave 1 : grandes variations
  value += Math.sin(x * frequency) * Math.cos(y * frequency) * amplitude
  
  // Octave 2 : variations moyennes
  amplitude *= 0.5
  frequency *= 2
  value += Math.sin(x * frequency + 1.5) * Math.cos(y * frequency + 1.5) * amplitude
  
  // Octave 3 : petits détails
  amplitude *= 0.5
  frequency *= 2
  value += Math.sin(x * frequency + 3.0) * Math.cos(y * frequency + 3.0) * amplitude
  
  return value
}

/**
 * Fonction pour créer une géométrie de plan avec déformation procédurale
 */
function createDeformedPlaneGeometry(width, height, segments = 64, noiseScale = 0.3, noiseIntensity = 0.3) {
  const geometry = new THREE.PlaneGeometry(width, height, segments, segments)
  const positions = geometry.attributes.position
  
  // Créer une seed aléatoire pour chaque zone
  const seedX = Math.random() * 1000
  const seedY = Math.random() * 1000
  
  // Appliquer des déformations procédurales
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i)
    const y = positions.getY(i)
    const z = positions.getZ(i)
    
    // Ajouter du noise procédural multi-octaves
    const noise = generateNoise(x + seedX, y + seedY, noiseScale) * noiseIntensity
    
    // Ajouter des petites bosses aléatoires basées sur la position (pour cohérence)
    const hash = (x * 73.0 + y * 97.0) % 1.0
    const randomBump = (hash - 0.5) * noiseIntensity * 0.2
    
    // Déplacer le vertex en Z (hauteur) - le relief doit être visible
    positions.setZ(i, z + noise + randomBump)
  }
  
  // Recalculer les normales pour un éclairage correct
  geometry.computeVertexNormals()
  
  return geometry
}

/**
 * Composant Ground - Sol en 3D avec plusieurs couches (terre, neige compacte, neige fraîche)
 */
function Ground({ 
  enabled = true,
  size = 20,
  snowAccumulation = true,
  receiveShadows = true,
  // Nouvelles props pour la configuration
  totalThickness = 0.4,
  baseColor = '#3A3A3A',
  compactSnowColor = '#E8E8E8',
  freshSnowColor = '#FFFFFF',
  baseThicknessRatio = 0.7,  // 70% de l'épaisseur totale
  compactSnowThicknessRatio = 0.2,  // 20% de l'épaisseur totale
  freshSnowThicknessRatio = 0.1,  // 10% de l'épaisseur totale
  noiseScale = 0.3,
  noiseIntensity = 0.3
}) {
  const baseMeshRef = useRef()
  const compactSnowMeshRef = useRef()
  const freshSnowMeshRef = useRef()

  // Calcul des épaisseurs
  const baseThickness = totalThickness * baseThicknessRatio
  const compactSnowThickness = totalThickness * compactSnowThicknessRatio
  const freshSnowThickness = totalThickness * freshSnowThicknessRatio

  // Positions Y pour chaque couche (centrées sur Y=0)
  const baseY = (-totalThickness / 2 + baseThickness / 2)- 0.5
  const compactSnowY = baseY + baseThickness / 2 + compactSnowThickness / 2
  const freshSnowY = compactSnowY + compactSnowThickness / 2 + freshSnowThickness / 2

  // Mémorisation de la géométrie de base (terre)
  const baseGeometry = useMemo(() => {
    return new THREE.BoxGeometry(size, baseThickness, size)
  }, [size, baseThickness])

  // Mémorisation de la géométrie de neige compacte
  const compactSnowGeometry = useMemo(() => {
    return new THREE.BoxGeometry(size, compactSnowThickness, size)
  }, [size, compactSnowThickness])

  // Mémorisation de la géométrie de neige fraîche avec déformation
  const freshSnowGeometry = useMemo(() => {
    if (!snowAccumulation) return null
    // Augmenter le nombre de segments pour plus de détails dans le relief
    return createDeformedPlaneGeometry(size, size, 64, noiseScale, noiseIntensity)
  }, [size, snowAccumulation, noiseScale, noiseIntensity])

  // Mémorisation des matériaux
  const baseMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: baseColor,
      roughness: 0.95,
      metalness: 0.05,
      side: THREE.DoubleSide
    })
  }, [baseColor])

  const compactSnowMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: compactSnowColor,
      roughness: 0.9,
      metalness: 0.1,
      side: THREE.DoubleSide
    })
  }, [compactSnowColor])

  const freshSnowMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: freshSnowColor,
      roughness: 0.95,
      metalness: 0.05,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide
    })
  }, [freshSnowColor])

  if (!enabled) {
    return null
  }

  return (
    <group>
      {/* Couche 1 : Base (terre/sol) */}
      <mesh
        ref={baseMeshRef}
        position={[0, baseY, 0]}
        receiveShadow={receiveShadows}
        castShadow={false}
        geometry={baseGeometry}
        material={baseMaterial}
      />
      
      {/* Couche 2 : Neige compacte */}
      <mesh
        ref={compactSnowMeshRef}
        position={[0, compactSnowY, 0]}
        receiveShadow={receiveShadows}
        castShadow={false}
        geometry={compactSnowGeometry}
        material={compactSnowMaterial}
      />
      
      {/* Couche 3 : Neige fraîche avec relief (optionnel) */}
      {snowAccumulation && freshSnowGeometry && (
        <mesh
          ref={freshSnowMeshRef}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, freshSnowY, 0]}
          receiveShadow={receiveShadows}
          castShadow={false}
          geometry={freshSnowGeometry}
          material={freshSnowMaterial}
        />
      )}
    </group>
  )
}

export default Ground

