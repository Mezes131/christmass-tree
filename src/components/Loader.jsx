import { useState, useLayoutEffect, useRef } from 'react'
import '../styles/Loader.css'

/**
 * Fonction d'easing pour une animation plus fluide
 */
const easeInOutCubic = (t) => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

/**
 * Composant Loader - Affiche un loader fluide pendant le chargement des composants 3D
 */
function Loader() {
  const [progress, setProgress] = useState(1) 
  const animationFrameRef = useRef(null)
  const startTimeRef = useRef(null)

  useLayoutEffect(() => {
    startTimeRef.current = performance.now()
    const duration = 3000 // Durée totale de l'animation (3 secondes)

    const animate = () => {
      const currentTime = performance.now()
      const elapsed = currentTime - startTimeRef.current
      
      // S'assurer que elapsed n'est jamais négatif
      if (elapsed < 0) {
        startTimeRef.current = currentTime
        animationFrameRef.current = requestAnimationFrame(animate)
        return
      }
      
      const newProgress = Math.min(100, Math.max(1, (elapsed / duration) * 100))
      
      // Animation avec easing pour un effet plus fluide
      // S'assurer que la progression ne descende jamais en dessous de 1%
      const easedProgress = Math.max(1, easeInOutCubic(newProgress / 100) * 100)
      
      setProgress(easedProgress)

      if (newProgress < 100) {
        animationFrameRef.current = requestAnimationFrame(animate)
      }
    }

    // Démarrer l'animation immédiatement
    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return (
    <div className="loader-overlay">
      <div className="loader-container">
        <div className="loader-spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>
        <div className="loader-text">
          <span className="loader-percentage">{Math.round(progress)}%</span>
          <span className="loader-message">Loading scene...</span>
        </div>
        <div className="loader-progress-bar">
          <div 
            className="loader-progress-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}

export default Loader

