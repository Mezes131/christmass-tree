import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Hook personnalisé pour gérer la logique de la scène 3D
 * Fournit des utilitaires et des états partagés pour les composants 3D
 */
export function useThreeScene() {
  const { scene, camera, gl } = useThree()
  
  // Référence pour stocker des données de la scène
  const sceneData = useRef({
    lights: [],
    ornaments: [],
    animationSpeed: 1,
    lightMode: 'static' // static, twinkle, cascade, wave
  })

  // Initialisation de la scène
  useEffect(() => {
    // Configuration du rendu
    gl.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    // Configuration des ombres (modification directe nécessaire pour Three.js)
    // eslint-disable-next-line react-hooks/immutability
    gl.shadowMap.enabled = true
    gl.shadowMap.type = THREE.PCFSoftShadowMap
    
    // Configuration de la caméra
    camera.lookAt(0, 0, 0)
    
    return () => {
      // Nettoyage si nécessaire
    }
  }, [gl, camera])

  /**
   * Fonction pour ajouter une lumière à la scène
   */
  const addLight = (lightRef) => {
    if (lightRef && !sceneData.current.lights.includes(lightRef)) {
      sceneData.current.lights.push(lightRef)
    }
  }

  /**
   * Fonction pour retirer une lumière de la scène
   */
  const removeLight = (lightRef) => {
    sceneData.current.lights = sceneData.current.lights.filter(
      light => light !== lightRef
    )
  }

  /**
   * Fonction pour ajouter un ornement à la scène
   */
  const addOrnament = (ornamentRef) => {
    if (ornamentRef && !sceneData.current.ornaments.includes(ornamentRef)) {
      sceneData.current.ornaments.push(ornamentRef)
    }
  }

  /**
   * Fonction pour retirer un ornement de la scène
   */
  const removeOrnament = (ornamentRef) => {
    sceneData.current.ornaments = sceneData.current.ornaments.filter(
      ornament => ornament !== ornamentRef
    )
  }

  /**
   * Fonction pour changer le mode d'éclairage
   */
  const setLightMode = (mode) => {
    sceneData.current.lightMode = mode
  }

  /**
   * Fonction pour changer la vitesse d'animation
   */
  const setAnimationSpeed = (speed) => {
    sceneData.current.animationSpeed = Math.max(0.1, Math.min(3, speed))
  }

  /**
   * Hook useFrame pour les animations continues
   * S'exécute à chaque frame de rendu
   */
  useFrame(() => {
    // Ici on peut ajouter des animations globales si nécessaire
    // Par exemple, rotation lente de la scène ou animations de lumières
  })

  return {
    scene,
    camera,
    gl,
    sceneData: sceneData.current,
    addLight,
    removeLight,
    addOrnament,
    removeOrnament,
    setLightMode,
    setAnimationSpeed
  }
}

/**
 * Hook pour gérer les animations de lumières
 */
export function useLightAnimation(lightRef, mode = 'static', speed = 1) {
  const timeRef = useRef(0)

  useFrame((state, delta) => {
    if (!lightRef?.current) return

    timeRef.current += delta * speed

    switch (mode) {
      case 'twinkle': {
        // Effet de scintillement aléatoire
        const twinkle = Math.sin(timeRef.current * 5) * 0.5 + 0.5
        lightRef.current.intensity = 0.3 + twinkle * 0.7
        break
      }

      case 'cascade': {
        // Effet de cascade (allumage progressif)
        const cascade = Math.sin(timeRef.current * 0.5) * 0.5 + 0.5
        lightRef.current.intensity = cascade
        break
      }

      case 'wave': {
        // Effet de vague
        const wave = Math.sin(timeRef.current * 2 + lightRef.current.position.y) * 0.5 + 0.5
        lightRef.current.intensity = 0.4 + wave * 0.6
        break
      }

      case 'chase': {
        // Effet de poursuite (une lumière après l'autre)
        // Note: Cette logique sera gérée dans le composant LightBulb avec l'index
        break
      }

      case 'static':
      default:
        // Mode statique - intensité constante
        lightRef.current.intensity = 1
        break
    }
  })
}

