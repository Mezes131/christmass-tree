import TreeGeometry from './TreeGeometry'
import Ornaments from './Ornaments'
import TreeLights from './TreeLights'

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
  lightColorScheme = 'multicolor'
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
        treeHeight={5.5}
        treeRadius={1.2}
        onOrnamentClick={onOrnamentClick}
        isInteractive={isInteractive}
      />
    </group>
  )
}

export default ChristmasTree

