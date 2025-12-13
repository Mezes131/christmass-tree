import { useState, useEffect, useRef } from 'react'
import '../styles/Header.css'

function Header({ isLoaded, canvasContainer }) {
  const [isVisible, setIsVisible] = useState(true)
  const timeoutRef = useRef(null)
  const isMouseOverInteractiveAreaRef = useRef(false)

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

    // Trouver le SidePanel dans le document
    const findSidePanel = () => {
      return document.querySelector('.side-panel')
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
        // Ne réafficher que si la souris est toujours sur une zone interactive
        if (isMouseOverInteractiveAreaRef.current) {
          setIsVisible(true)
        }
      }, 3000)
    }

    // Gestionnaire d'interaction sur le canvas ou le SidePanel
    const handleInteraction = () => {
      hideHeader()
      scheduleShow()
    }

    // Gestionnaire pour détecter quand la souris entre dans une zone interactive
    const handleMouseEnter = () => {
      isMouseOverInteractiveAreaRef.current = true
      // Ne pas masquer immédiatement, attendre une interaction
    }

    // Gestionnaire pour détecter quand la souris sort d'une zone interactive
    const handleMouseLeave = (event) => {
      // Utiliser un petit délai pour vérifier si la souris entre dans l'autre zone
      setTimeout(() => {
        // Vérifier si la souris est maintenant dans l'autre zone
        const relatedTarget = event.relatedTarget
        if (relatedTarget) {
          const isInCanvas = canvas && (canvas.contains(relatedTarget) || canvas === relatedTarget)
          const isInSidePanel = sidePanel && (sidePanel.contains(relatedTarget) || sidePanel === relatedTarget)
          
          // Si la souris est dans l'une des zones, ne rien faire
          if (isInCanvas || isInSidePanel) {
            isMouseOverInteractiveAreaRef.current = true
            return
          }
        }
        
        // Vérifier la position actuelle de la souris
        const point = document.elementFromPoint(event.clientX, event.clientY)
        if (point) {
          const isInCanvas = canvas && (canvas.contains(point) || canvas === point)
          const isInSidePanel = sidePanel && (sidePanel.contains(point) || sidePanel === point)
          
          if (isInCanvas || isInSidePanel) {
            isMouseOverInteractiveAreaRef.current = true
            return
          }
        }
        
        // La souris n'est dans aucune zone interactive
        isMouseOverInteractiveAreaRef.current = false
        // Annuler le timer et afficher le header immédiatement
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        setIsVisible(true)
      }, 50) // Petit délai pour permettre à mouseenter de l'autre élément de se déclencher
    }

    // Fonction pour configurer les écouteurs d'événements sur un élément
    const setupElementListeners = (element) => {
      if (!element) return null

      // Événements à écouter
      const events = [
        'mousedown',      // Clic
        'mousemove',      // Mouvement de la souris
        'wheel',          // Molette
        'touchstart',     // Touch (mobile)
        'touchmove'       // Touch move (mobile)
      ]

      // Ajouter les écouteurs d'événements
      events.forEach(event => {
        element.addEventListener(event, handleInteraction, { passive: true })
      })

      // Événements pour détecter l'entrée/sortie de la souris
      element.addEventListener('mouseenter', handleMouseEnter, { passive: true })
      element.addEventListener('mouseleave', handleMouseLeave, { passive: true })

      // Retourner la fonction de nettoyage
      return () => {
        events.forEach(event => {
          element.removeEventListener(event, handleInteraction)
        })
        element.removeEventListener('mouseenter', handleMouseEnter)
        element.removeEventListener('mouseleave', handleMouseLeave)
      }
    }

    // Attendre que le canvas et le SidePanel soient disponibles
    let canvas = findCanvas()
    let sidePanel = findSidePanel()
    let cleanupCanvas = null
    let cleanupSidePanel = null

    const setupAllListeners = () => {
      // Nettoyer les anciens écouteurs si nécessaire
      if (cleanupCanvas) cleanupCanvas()
      if (cleanupSidePanel) cleanupSidePanel()

      // Configurer les écouteurs pour le canvas
      if (canvas) {
        cleanupCanvas = setupElementListeners(canvas)
      }

      // Configurer les écouteurs pour le SidePanel
      if (sidePanel) {
        cleanupSidePanel = setupElementListeners(sidePanel)
      }
    }

    if (!canvas || !sidePanel) {
      // Si les éléments ne sont pas encore disponibles, attendre un peu
      const checkElements = setInterval(() => {
        canvas = findCanvas()
        sidePanel = findSidePanel()
        if (canvas && sidePanel) {
          clearInterval(checkElements)
          setupAllListeners()
        }
      }, 100)

      // Nettoyer après 5 secondes si les éléments ne sont toujours pas trouvés
      const timeout = setTimeout(() => {
        clearInterval(checkElements)
        // Essayer quand même de configurer ce qui est disponible
        setupAllListeners()
      }, 5000)

      return () => {
        clearInterval(checkElements)
        clearTimeout(timeout)
        if (cleanupCanvas) cleanupCanvas()
        if (cleanupSidePanel) cleanupSidePanel()
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }

    // Éléments trouvés immédiatement
    setupAllListeners()

    // Nettoyage
    return () => {
      if (cleanupCanvas) cleanupCanvas()
      if (cleanupSidePanel) cleanupSidePanel()
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
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

