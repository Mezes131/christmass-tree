import TreeGeometry from './TreeGeometry'
import Ornaments from './Ornaments'

/**
 * Composant ChristmasTree - Assemble tous les éléments du sapin de Noël
 * Composant principal qui combine la géométrie, les ornements et les lumières
 */
function ChristmasTree({ 
  position = [0, 0, 0],
  onOrnamentClick,
  isInteractive = true
}) {
  return (
    <group position={position}>
      {/* Géométrie du sapin */}
      <TreeGeometry 
        position={[0, 0, 0]}
        enableRotation={false}
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

