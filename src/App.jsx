import { useState } from 'react'
import Scene from './components/Scene'
import TreeControls from './components/ChristmasTree/TreeControls'
import './App.css'

function App() {
  const [lightsOn, setLightsOn] = useState(true)
  const [lightMode, setLightMode] = useState('static')
  const [lightSpeed, setLightSpeed] = useState(1)
  const [lightIntensity, setLightIntensity] = useState(1)
  const [lightColorScheme, setLightColorScheme] = useState('multicolor')

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

  return (
    <div className="app-container">
      <Scene
        lightsOn={lightsOn}
        lightMode={lightMode}
        lightSpeed={lightSpeed}
        lightIntensity={lightIntensity}
        lightColorScheme={lightColorScheme}
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
      />
    </div>
  )
}

export default App
