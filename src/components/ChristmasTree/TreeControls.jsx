import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faLightbulb, 
  faStar, 
  faWaveSquare, 
  faWater,
  faForward, 
  faPowerOff,
  faSnowflake
} from '@fortawesome/free-solid-svg-icons'
import '../../styles/controls.css'

/**
 * TreeControls Component - Control interface for the Christmas tree
 * Allows controlling lights, animation modes and visual parameters
 */
function TreeControls({
  lightsOn = true,
  lightMode = 'static',
  lightSpeed = 1,
  lightIntensity = 1,
  lightColorScheme = 'multicolor',
  onLightsToggle,
  onModeChange,
  onSpeedChange,
  onIntensityChange,
  onColorSchemeChange,
  // Propriétés pour la neige
  snowEnabled = false,
  snowCount = 1000,
  snowSpeed = 1,
  snowSize = 0.02,
  windStrength = 0.1,
  onSnowToggle,
  onSnowCountChange,
  onSnowSpeedChange,
  onSnowSizeChange,
  onWindStrengthChange
}) {
  const [isExpanded, setIsExpanded] = useState(true)

  const lightModes = [
    { value: 'static', label: 'Static', icon: faLightbulb },
    { value: 'twinkle', label: 'Twinkle', icon: faStar },
    { value: 'cascade', label: 'Cascade', icon: faWaveSquare },
    { value: 'wave', label: 'Wave', icon: faWater },
    { value: 'chase', label: 'Chase', icon: faForward }
  ]

  const colorSchemes = [
    { value: 'multicolor', label: 'Multicolor', colors: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00'] },
    { value: 'red', label: 'Red', colors: ['#FF0000'] },
    { value: 'blue', label: 'Blue', colors: ['#0000FF'] },
    { value: 'warm', label: 'Warm', colors: ['#FFA500', '#FFFF00'] },
    { value: 'cool', label: 'Cool', colors: ['#0000FF', '#9370DB'] }
  ]

  return (
    <div className={`tree-controls ${isExpanded ? 'expanded' : 'collapsed'}`}>
      {/* Expand/collapse button */}
      <button 
        className="controls-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label={isExpanded ? 'Collapse controls' : 'Expand controls'}
      >
        {isExpanded ? '▼' : '▲'} Controls
      </button>

      {isExpanded && (
        <div className="controls-content">
          {/* On/Off Section */}
          <div className="control-section">
            <h3 className="control-title">Lighting</h3>
            <button
              className={`toggle-button ${lightsOn ? 'on' : 'off'}`}
              onClick={onLightsToggle}
            >
              <span className="toggle-icon">
                <FontAwesomeIcon icon={lightsOn ? faLightbulb : faPowerOff} />
              </span>
              <span className="toggle-label">{lightsOn ? 'On' : 'Off'}</span>
            </button>
          </div>

          {/* Light Mode Section */}
          <div className="control-section">
            <h3 className="control-title">Light Mode</h3>
            <div className="mode-buttons">
              {lightModes.map((mode) => (
                <button
                  key={mode.value}
                  className={`mode-button ${lightMode === mode.value ? 'active' : ''}`}
                  onClick={() => onModeChange(mode.value)}
                  title={mode.label}
                >
                  <span className="mode-icon">
                    <FontAwesomeIcon icon={mode.icon} />
                  </span>
                  <span className="mode-label">{mode.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Speed Section */}
          <div className="control-section">
            <h3 className="control-title">
              Animation Speed
              <span className="value-display">{lightSpeed.toFixed(1)}x</span>
            </h3>
            <div className="slider-container">
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={lightSpeed}
                onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
                className="slider"
                disabled={lightMode === 'static'}
              />
              <div className="slider-labels">
                <span>Slow</span>
                <span>Fast</span>
              </div>
            </div>
          </div>

          {/* Intensity Section */}
          <div className="control-section">
            <h3 className="control-title">
              Intensity
              <span className="value-display">{Math.round(lightIntensity * 100)}%</span>
            </h3>
            <div className="slider-container">
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={lightIntensity}
                onChange={(e) => onIntensityChange(parseFloat(e.target.value))}
                className="slider"
                disabled={!lightsOn}
              />
              <div className="slider-labels">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>
          </div>

          {/* Color Scheme Section */}
          <div className="control-section">
            <h3 className="control-title">Colors</h3>
            <div className="color-scheme-buttons">
              {colorSchemes.map((scheme) => (
                <button
                  key={scheme.value}
                  className={`color-button ${lightColorScheme === scheme.value ? 'active' : ''}`}
                  onClick={() => onColorSchemeChange(scheme.value)}
                  title={scheme.label}
                >
                  <span className="color-icons">
                    {scheme.colors.map((color, idx) => (
                      <span 
                        key={idx} 
                        className="color-circle"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </span>
                  <span className="color-label">{scheme.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Snow Section */}
          <div className="control-section">
            <h3 className="control-title">Snow</h3>
            <button
              className={`toggle-button ${snowEnabled ? 'on' : 'off'} snow`}
              onClick={onSnowToggle}
            >
              <span className="toggle-icon">
                <FontAwesomeIcon icon={snowEnabled ? faSnowflake : faPowerOff} />
              </span>
              <span className="toggle-label">{snowEnabled ? 'On' : 'Off'}</span>
            </button>

            {snowEnabled && (
              <>
                <div className="control-section" style={{ marginTop: '16px' }}>
                  <h3 className="control-title">
                    Count
                    <span className="value-display">{snowCount}</span>
                  </h3>
                  <div className="slider-container">
                    <input
                      type="range"
                      min="100"
                      max="3000"
                      step="100"
                      value={snowCount}
                      onChange={(e) => onSnowCountChange(parseInt(e.target.value))}
                      className="slider"
                    />
                    <div className="slider-labels">
                      <span>Few</span>
                      <span>Many</span>
                    </div>
                  </div>
                </div>

                <div className="control-section">
                  <h3 className="control-title">
                    Speed
                    <span className="value-display">{snowSpeed.toFixed(1)}x</span>
                  </h3>
                  <div className="slider-container">
                    <input
                      type="range"
                      min="0.1"
                      max="3"
                      step="0.1"
                      value={snowSpeed}
                      onChange={(e) => onSnowSpeedChange(parseFloat(e.target.value))}
                      className="slider"
                    />
                    <div className="slider-labels">
                      <span>Slow</span>
                      <span>Fast</span>
                    </div>
                  </div>
                </div>

                <div className="control-section">
                  <h3 className="control-title">
                    Size
                    <span className="value-display">{(snowSize * 100).toFixed(0)}%</span>
                  </h3>
                  <div className="slider-container">
                    <input
                      type="range"
                      min="0.01"
                      max="0.1"
                      step="0.01"
                      value={snowSize}
                      onChange={(e) => onSnowSizeChange(parseFloat(e.target.value))}
                      className="slider"
                    />
                    <div className="slider-labels">
                      <span>Small</span>
                      <span>Large</span>
                    </div>
                  </div>
                </div>

                <div className="control-section">
                  <h3 className="control-title">
                    Wind
                    <span className="value-display">{windStrength.toFixed(1)}</span>
                  </h3>
                  <div className="slider-container">
                    <input
                      type="range"
                      min="0"
                      max="0.5"
                      step="0.05"
                      value={windStrength}
                      onChange={(e) => onWindStrengthChange(parseFloat(e.target.value))}
                      className="slider"
                    />
                    <div className="slider-labels">
                      <span>Calm</span>
                      <span>Windy</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default TreeControls

