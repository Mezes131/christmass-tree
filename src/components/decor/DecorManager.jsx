import Gifts from './Gifts'
import Stars from './Stars'
import Ground from './Ground'
import MoonSky from './MoonSky'

/**
 * Composant DecorManager - Gestionnaire central pour tous les décors
 * Permet d'activer/désactiver et configurer chaque décor individuellement
 */
function DecorManager({
  // Activation des décors
  giftsEnabled = true,
  starsEnabled = true,
  groundEnabled = true,
  moonSkyEnabled = true,
  
  // Configuration des présents
  giftsCount = 5,
  treeRadius = 1.2,
  
  // Configuration des étoiles
  starsCount = 200,
  starsRadius = 30,
  starsTwinkleSpeed = 1,
  
  // Configuration du sol
  groundSize = 20,
  groundSnowAccumulation = true,
  
  // Configuration de la lune
  moonPosition = [8, 8, -10],
  moonSize = 1.5,
  moonGlowIntensity = 0.5
}) {
  return (
    <group>
      {/* Sol avec neige - doit être en premier pour être en dessous */}
      <Ground
        enabled={groundEnabled}
        size={groundSize}
        snowAccumulation={groundSnowAccumulation}
        receiveShadows={true}
      />
      
      {/* Présents sous le sapin */}
      <Gifts
        enabled={giftsEnabled}
        count={giftsCount}
        treeRadius={treeRadius}
      />
      
      {/* Étoiles dans le ciel */}
      <Stars
        enabled={starsEnabled}
        count={starsCount}
        radius={starsRadius}
        twinkleSpeed={starsTwinkleSpeed}
      />
      
      {/* Lune et ciel étoilé */}
      <MoonSky
        enabled={moonSkyEnabled}
        moonPosition={moonPosition}
        moonSize={moonSize}
        moonGlowIntensity={moonGlowIntensity}
      />
    </group>
  )
}

export default DecorManager

