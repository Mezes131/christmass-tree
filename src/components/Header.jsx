import { useState, useEffect, useRef } from 'react'
import '../styles/Header.css'

function Header({ isLoaded, canvasContainer }) {
  const [isVisible, setIsVisible] = useState(true)
  const timeoutRef = useRef(null)
  const isMouseOverCanvasRef = useRef(false)

  useEffect(() => {
    if (!isLoaded) return

    // Trouver le canvas dans le conteneur ou dans le document
    const findCanvas = () => {
      // Essayer d'abord avec le conteneur fourni
      if (canvasContainer) {
        const canvas = canvasContainer.querySelector('canvas')
        if (canvas) return canvas
      }
      // Fallback : chercher le canvas dans le document
      return document.querySelector('.scene-wrapper canvas')
    }

    // Fonction pour masquer le header
    const hideHeader = () => {
      setIsVisible(false)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }

    // Fonction pour réafficher le header après 3 secondes d'inactivité
    const scheduleShow = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        // Ne réafficher que si la souris est toujours sur le canvas
        if (isMouseOverCanvasRef.current) {
          setIsVisible(true)
        }
      }, 3000)
    }

    // Gestionnaire d'interaction sur le canvas
    const handleCanvasInteraction = () => {
      hideHeader()
      scheduleShow()
    }

    // Gestionnaire pour détecter quand la souris entre dans le canvas
    const handleMouseEnter = () => {
      isMouseOverCanvasRef.current = true
      // Ne pas masquer immédiatement, attendre une interaction
    }

    // Gestionnaire pour détecter quand la souris sort du canvas
    const handleMouseLeave = () => {
      isMouseOverCanvasRef.current = false
      // Annuler le timer et afficher le header immédiatement
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      setIsVisible(true)
    }

    // Fonction pour configurer les écouteurs d'événements
    const setupEventListeners = (canvas) => {
      // Événements à écouter uniquement sur le canvas
      const canvasEvents = [
        'mousedown',      // Clic
        'mousemove',      // Mouvement de la souris
        'wheel',          // Molette
        'touchstart',     // Touch (mobile)
        'touchmove'       // Touch move (mobile)
      ]

      // Ajouter les écouteurs d'événements sur le canvas
      canvasEvents.forEach(event => {
        canvas.addEventListener(event, handleCanvasInteraction, { passive: true })
      })

      // Événements pour détecter l'entrée/sortie de la souris
      canvas.addEventListener('mouseenter', handleMouseEnter, { passive: true })
      canvas.addEventListener('mouseleave', handleMouseLeave, { passive: true })

      // Retourner la fonction de nettoyage
      return () => {
        canvasEvents.forEach(event => {
          canvas.removeEventListener(event, handleCanvasInteraction)
        })
        canvas.removeEventListener('mouseenter', handleMouseEnter)
        canvas.removeEventListener('mouseleave', handleMouseLeave)
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }

    // Attendre que le canvas soit disponible
    let canvas = findCanvas()
    let cleanup = null

    if (!canvas) {
      // Si le canvas n'est pas encore disponible, attendre un peu
      const checkCanvas = setInterval(() => {
        canvas = findCanvas()
        if (canvas) {
          clearInterval(checkCanvas)
          cleanup = setupEventListeners(canvas)
        }
      }, 100)

      // Nettoyer après 5 secondes si le canvas n'est toujours pas trouvé
      const timeout = setTimeout(() => {
        clearInterval(checkCanvas)
      }, 5000)

      return () => {
        clearInterval(checkCanvas)
        clearTimeout(timeout)
        if (cleanup) cleanup()
      }
    }

    // Canvas trouvé immédiatement
    cleanup = setupEventListeners(canvas)

    // Nettoyage
    return () => {
      if (cleanup) cleanup()
    }
  }, [isLoaded, canvasContainer])

  return (
    <header className={`header ${isLoaded ? 'loaded' : ''} ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="header-content">
        <h1 className="title">CHRISTMAS TREE</h1>
        <p className="subtitle">Move your mouse to explore</p>
      </div>
    </header>
  )
}

export default Header

