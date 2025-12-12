import { useState } from 'react'
import Scene from './components/Scene'
import TreeControls from './components/ChristmasTree/TreeControls'
import './App.css'
import './styles/tree.css'

function App() {
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

  return (
    <div className="app-container">
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
      >
        {/* Le sapin de Noël et les autres éléments seront ajoutés ici */}
      </Scene>
      
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
      />
    </div>
  )
}

export default App
