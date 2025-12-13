import { useMemo } from 'react'
import * as THREE from 'three'

/**
 * Composant Garland - Fil de guirlande qui relie les ampoules autour du sapin
 */
function Garland({ 
  treeHeight = 5.5,
  treeRadius = 1.2,
  isOn = true,
  wireColor = '#ffffff', // Couleur du fil (gris foncé par défaut)
  wireThickness = 0.005 // Épaisseur du fil
}) {
  // Génération des positions des spirales (même logique que TreeLights)
  const spiralPaths = useMemo(() => {
    const paths = []
    const numSpirals = 3 // Nombre de spirales autour du sapin
    const lightsPerSpiral = 15 // Nombre de lumières par spirale

    for (let spiral = 0; spiral < numSpirals; spiral++) {
      const points = []
      
      for (let i = 0; i < lightsPerSpiral; i++) {
        const progress = i / lightsPerSpiral // 0 à 1
        const y = 0.3 + progress * (treeHeight - 0.3) // Position verticale
        const angle = (spiral / numSpirals) * Math.PI * 2 + progress * Math.PI * 4 // Angle en spirale
        const radius = treeRadius * (0.7 + progress * 0.3) // Rayon qui augmente avec la hauteur
        
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        
        points.push(new THREE.Vector3(x, y, z))
      }
      
      paths.push(points)
    }

    return paths
  }, [treeHeight, treeRadius])

  if (!isOn) {
    return null
  }

  return (
    <group>
      {spiralPaths.map((points, spiralIndex) => {
        // Création d'une courbe lisse passant par tous les points
        const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal')
        
        return (
          <mesh key={`garland-${spiralIndex}`}>
            {/* Utilisation de TubeGeometry pour créer un fil cylindrique */}
            <tubeGeometry 
              args={[
                curve,           // Courbe à suivre
                50,              // Nombre de segments
                wireThickness,   // Rayon du tube
                8,               // Nombre de segments radiaux
                false            // Fermé ou non
              ]} 
            />
            <meshPhysicalMaterial
              color={wireColor}
              metalness={0}
              roughness={0.05}
              clearcoat={1.0}
              clearcoatRoughness={0.1}
              reflectivity={0.8}
              transmission={0.2}
              thickness={0.5}
              ior={1.5}
              sheen={0.5}
              sheenRoughness={0.3}
            />
          </mesh>
        )
      })}
    </group>
  )
}

export default Garland

