# 🎄 Interactive 3D Christmas Tree

An interactive 3D Christmas tree built with React, Three.js, and React Three Fiber. Customize lights, decorations, and effects in real-time with a beautiful, modern UI.

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![Three.js](https://img.shields.io/badge/Three.js-0.181.2-000000?logo=three.js)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?logo=vite)

## ✨ Features

### 🎨 Interactive Lighting System
- **5 Animation Modes**: Static, Twinkle, Cascade, Wave, and Chase
- **Color Schemes**: Multicolor, Red, Blue, Warm, and Cool
- **Customizable Controls**: Speed, intensity, and color scheme
- **Real-time Updates**: All changes apply instantly

### ❄️ Snow Effects
- Particle-based snow system
- Adjustable count (100-3000 flakes)
- Speed and size controls
- Wind strength simulation

### 🎁 Decorative Elements
- **Gifts**: Colorful gift boxes under the tree
- **Stars**: Twinkling stars in the sky (200 individual meshes)
- **Star Field**: Optimized particle system with 5000+ stars and rotation animation
- **Moon & Sky**: Animated moon with glow effect
- **Ground**: Snow-covered ground plane

### 🎮 Interactive Controls
- Full-screen mode support
- Side panel with collapsible controls
- Camera controls (zoom, rotate, pan)
- Real-time parameter adjustments

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🛠️ Technologies

- **React 19** - UI framework
- **Three.js** - 3D graphics library
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for React Three Fiber
- **FontAwesome** - Icon library
- **Vite** - Build tool and dev server
- **CSS3** - Animations and styling

## 📁 Project Structure

```
src/
├── components/
│   ├── ChristmasTree/
│   │   ├── ChristmasTree.jsx    # Main tree component
│   │   ├── TreeGeometry.jsx     # 3D tree geometry
│   │   ├── TreeLights.jsx      # Light garlands
│   │   ├── Ornaments.jsx       # Interactive ornaments
│   │   ├── Snow.jsx            # Snow particle system
│   │   └── TreeControls.jsx    # Control panel UI
│   ├── decor/
│   │   ├── DecorManager.jsx    # Central decor manager
│   │   ├── Gifts.jsx           # Gift boxes
│   │   ├── Stars.jsx           # Individual stars
│   │   ├── StarField.jsx       # Star field particle system
│   │   ├── MoonSky.jsx         # Moon and sky
│   │   └── Ground.jsx          # Ground plane
│   ├── Scene.jsx               # Main 3D scene
│   ├── NavBar.jsx              # Navigation bar
│   ├── SidePanel.jsx           # Side control panel
│   └── Footer.jsx              # Footer component
├── styles/
│   ├── lights.css              # Light animations
│   ├── controls.css            # Control panel styles
│   ├── tree.css                # General styles
│   ├── decor.css               # Decoration styles
│   └── NavBar.css              # Navbar styles
└── App.jsx                      # Main application
```

## 🎯 Usage

### Light Controls
1. Toggle lights on/off
2. Select animation mode (Static, Twinkle, Cascade, Wave, Chase)
3. Adjust animation speed (0.1x - 3x)
4. Control intensity (10% - 200%)
5. Choose color scheme

### Snow Effects
1. Enable/disable snow
2. Adjust flake count
3. Control fall speed
4. Modify flake size
5. Set wind strength

### Decorations
- Toggle individual decorations (Gifts, Stars, Star Field, Ground, Moon & Sky)
- All decorations are optimized with `useMemo` for performance

### Camera Controls
- **Left Click + Drag**: Rotate view
- **Right Click + Drag**: Pan
- **Scroll**: Zoom in/out
- **Fullscreen**: Toggle fullscreen mode

## 🎨 Customization

All components are highly customizable through props:

```jsx
<ChristmasTree
  lightsOn={true}
  lightMode="twinkle"
  lightSpeed={1.5}
  lightIntensity={1.2}
  lightColorScheme="multicolor"
  snowEnabled={true}
  snowCount={1500}
  snowSpeed={1.2}
/>
```

## 🚀 Performance Optimizations

- **useMemo** for geometry and material caching
- **BufferGeometry** for efficient particle systems
- **PointsMaterial** for star field rendering
- **Conditional rendering** for disabled features
- **Optimized re-renders** with React hooks

## 📝 License

This project is private and proprietary.

## 🚀 Deployment

### GitHub Pages

The project includes a GitHub Actions workflow for automatic deployment to GitHub Pages.

1. **Enable GitHub Pages** in your repository settings:
   - Go to Settings → Pages
   - Source: Select "GitHub Actions"

2. **Update the base path** in `vite.config.js`:
   ```js
   base: '/your-repo-name/'
   ```

3. **Push to main/master branch** - The workflow will automatically:
   - Build the project
   - Deploy to GitHub Pages

The workflow file is located at `.github/workflows/deploy.yml`

## 👨‍💻 Development

Built with modern React patterns:
- Functional components with hooks
- Component composition
- Performance optimization with memoization
- Modular architecture

---

Made with ❤️ using React and Three.js
