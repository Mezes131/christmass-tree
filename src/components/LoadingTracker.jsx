import { useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'

/**
 * Composant LoadingTracker - Attend que la scène 3D soit prête
 * et notifie le parent quand le chargement est terminé
 */
function LoadingTracker({ onLoaded }) {
  const { gl, scene } = useThree()
  const hasNotified = useRef(false)
  const startTime = useRef(null)
  const minDisplayTime = 2000 // Temps minimum d'affichage du loader (2 secondes)

  useEffect(() => {
    // Initialiser le temps de départ dans useEffect pour éviter l'appel impur pendant le rendu
    startTime.current = Date.now()
    
    const checkReady = () => {
      const elapsed = Date.now() - startTime.current
      
      // Vérifier que le WebGL context est prêt et que le temps minimum est écoulé
      if (gl && scene && elapsed >= minDisplayTime && !hasNotified.current) {
        hasNotified.current = true
        // Petit délai pour une transition fluide
        setTimeout(() => {
          if (onLoaded) {
            onLoaded()
          }
        }, 500)
      } else if (!hasNotified.current) {
        // Réessayer après un court délai
        requestAnimationFrame(checkReady)
      }
    }

    // Démarrer la vérification après un court délai pour laisser le temps à la scène de s'initialiser
    const timer = setTimeout(() => {
      checkReady()
    }, 300)

    return () => {
      clearTimeout(timer)
    }
  }, [gl, scene, onLoaded, minDisplayTime])

  return null
}

export default LoadingTracker

