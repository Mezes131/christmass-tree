import { useState, useEffect } from 'react'
import Scene from './components/Scene'
import TreeControls from './components/ChristmasTree/TreeControls'
import NavBar from './components/NavBar'
import SidePanel from './components/SidePanel'
import Footer from './components/Footer'
import './App.css'
import './styles/tree.css'
import './styles/decor.css'

function App() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isSidePanelExpanded, setIsSidePanelExpanded] = useState(false)
  const [lightsOn, setLightsOn] = useState(true)
  const [lightMode, setLightMode] = useState('static')
  const [lightSpeed, setLightSpeed] = useState(1)
  const [lightIntensity, setLightIntensity] = useState(1)
  const [lightColorScheme, setLightColorScheme] = useState('multicolor')
  
  // États pour la neige
  const [snowEnabled, setSnowEnabled] = useState(false)
  const [snowCount, setSnowCount] = useState(1000)
  const [snowSpeed, setSnowSpeed] = useState(1)
  const [snowSize, setSnowSize] = useState(0.02)
  const [windStrength, setWindStrength] = useState(0.1)
  
  // États pour les décors
  const [giftsEnabled, setGiftsEnabled] = useState(true)
  const [starsEnabled, setStarsEnabled] = useState(true)
  const [starFieldEnabled, setStarFieldEnabled] = useState(true)
  const [groundEnabled, setGroundEnabled] = useState(true)
  const [moonSkyEnabled, setMoonSkyEnabled] = useState(true)

  const handleLightsToggle = () => {
    setLightsOn(!lightsOn)
  }

  const handleModeChange = (mode) => {
    setLightMode(mode)
  }

  const handleSpeedChange = (speed) => {
    setLightSpeed(speed)
  }

  const handleIntensityChange = (intensity) => {
    setLightIntensity(intensity)
  }

  const handleColorSchemeChange = (scheme) => {
    setLightColorScheme(scheme)
  }

  // Handlers pour la neige
  const handleSnowToggle = () => {
    setSnowEnabled(!snowEnabled)
  }

  const handleSnowCountChange = (count) => {
    setSnowCount(count)
  }

  const handleSnowSpeedChange = (speed) => {
    setSnowSpeed(speed)
  }

  const handleSnowSizeChange = (size) => {
    setSnowSize(size)
  }

  const handleWindStrengthChange = (strength) => {
    setWindStrength(strength)
  }

  // Handlers pour les décors
  const handleGiftsToggle = () => {
    setGiftsEnabled(!giftsEnabled)
  }

  const handleStarsToggle = () => {
    setStarsEnabled(!starsEnabled)
  }

  const handleStarFieldToggle = () => {
    setStarFieldEnabled(!starFieldEnabled)
  }

  const handleGroundToggle = () => {
    setGroundEnabled(!groundEnabled)
  }

  const handleMoonSkyToggle = () => {
    setMoonSkyEnabled(!moonSkyEnabled)
  }

  // Gestion du chargement
  useEffect(() => {
    // Utiliser un callback pour éviter l'avertissement
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  // Gestion du fullscreen
  const handleFullscreen = () => {
    if (!isFullscreen) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen()
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen()
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
    }
    setIsFullscreen(!isFullscreen)
  }

  // Écouter les changements de fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement || !!document.webkitFullscreenElement || !!document.msFullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('msfullscreenchange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
      document.removeEventListener('msfullscreenchange', handleFullscreenChange)
    }
  }, [])

  return (
    <div className={`app-container ${isFullscreen ? 'fullscreen' : ''}`}>
      <NavBar isLoaded={isLoaded} />
      
      <div className="main-content">
        <Scene
          lightsOn={lightsOn}
          lightMode={lightMode}
          lightSpeed={lightSpeed}
          lightIntensity={lightIntensity}
          lightColorScheme={lightColorScheme}
          snowEnabled={snowEnabled}
          snowCount={snowCount}
          snowSpeed={snowSpeed}
          snowSize={snowSize}
          windStrength={windStrength}
          giftsEnabled={giftsEnabled}
          starsEnabled={starsEnabled}
          starFieldEnabled={starFieldEnabled}
          groundEnabled={groundEnabled}
          moonSkyEnabled={moonSkyEnabled}
          isFullscreen={isFullscreen}
        >
          {/* Le sapin de Noël et les autres éléments seront ajoutés ici */}
        </Scene>
        
        <SidePanel
          isExpanded={isSidePanelExpanded}
          onToggle={() => setIsSidePanelExpanded(!isSidePanelExpanded)}
          onFullscreen={handleFullscreen}
          isFullscreen={isFullscreen}
        >
          {{
            controls: (
              <TreeControls
                lightsOn={lightsOn}
                lightMode={lightMode}
                lightSpeed={lightSpeed}
                lightIntensity={lightIntensity}
                lightColorScheme={lightColorScheme}
                onLightsToggle={handleLightsToggle}
                onModeChange={handleModeChange}
                onSpeedChange={handleSpeedChange}
                onIntensityChange={handleIntensityChange}
                onColorSchemeChange={handleColorSchemeChange}
                snowEnabled={snowEnabled}
                snowCount={snowCount}
                snowSpeed={snowSpeed}
                snowSize={snowSize}
                windStrength={windStrength}
                onSnowToggle={handleSnowToggle}
                onSnowCountChange={handleSnowCountChange}
                onSnowSpeedChange={handleSnowSpeedChange}
                onSnowSizeChange={handleSnowSizeChange}
                onWindStrengthChange={handleWindStrengthChange}
                giftsEnabled={giftsEnabled}
                starsEnabled={starsEnabled}
                starFieldEnabled={starFieldEnabled}
                groundEnabled={groundEnabled}
                moonSkyEnabled={moonSkyEnabled}
                onGiftsToggle={handleGiftsToggle}
                onStarsToggle={handleStarsToggle}
                onStarFieldToggle={handleStarFieldToggle}
                onGroundToggle={handleGroundToggle}
                onMoonSkyToggle={handleMoonSkyToggle}
              />
            ),
            info: (
              <div className="info-content">
                <h4>About this Project</h4>
                <p>
                  An interactive 3D Christmas tree built with React and Three.js. 
                  Customize lights, decorations, and effects in real-time.
                </p>
                <h4>Technologies</h4>
                <ul>
                  <li>React 19</li>
                  <li>Three.js & React Three Fiber</li>
                  <li>CSS3 Animations</li>
                  <li>WebGL Rendering</li>
                </ul>
              </div>
            )
          }}
        </SidePanel>
      </div>
      
      <Footer isLoaded={isLoaded} />
    </div>
  )
}

export default App
