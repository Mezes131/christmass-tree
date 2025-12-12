import TreeGeometry from './TreeGeometry'
import Ornaments from './Ornaments'
import TreeLights from './TreeLights'
import Snow from './Snow'

/**
 * Composant ChristmasTree - Assemble tous les éléments du sapin de Noël
 * Composant principal qui combine la géométrie, les ornements et les lumières
 */
function ChristmasTree({ 
  position = [0, 0, 0],
  onOrnamentClick,
  isInteractive = true,
  // Propriétés pour les lumières
  lightsOn = true,
  lightMode = 'static',
  lightSpeed = 1,
  lightIntensity = 1,
  lightColorScheme = 'multicolor',
  // Propriétés pour la neige (non utilisées directement, passées à SnowEffect)
  // snowEnabled = false,
  // snowCount = 1000,
  // snowSpeed = 1,
  // snowSize = 0.02,
  // windStrength = 0.1
}) {
  return (
    <group position={position}>
      {/* Géométrie du sapin */}
      <TreeGeometry 
        position={[0, 0, 0]}
        enableRotation={false}
      />
      
      {/* Guirlandes lumineuses */}
      <TreeLights
        treeHeight={5.5}
        treeRadius={1.2}
        mode={lightMode}
        speed={lightSpeed}
        intensity={lightIntensity}
        isOn={lightsOn}
        colorScheme={lightColorScheme}
      />
      
      {/* Ornements décoratifs */}
      <Ornaments 
        treeRadius={1.2}
        onOrnamentClick={onOrnamentClick}
        isInteractive={isInteractive}
      />
    </group>
  )
}

/**
 * Composant SnowEffect - Conteneur pour l'effet de neige (en dehors du groupe du sapin)
 */
export function SnowEffect({
  enabled = false,
  count = 1000,
  speed = 1,
  size = 0.02,
  windStrength = 0.1
}) {
  return (
    <Snow
      enabled={enabled}
      count={count}
      speed={speed}
      size={size}
      windStrength={windStrength}
    />
  )
}

export default ChristmasTree

