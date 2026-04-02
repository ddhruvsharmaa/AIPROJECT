import { AnimatePresence, motion as Motion } from 'framer-motion'
import AppProvider from './context/AppContext.jsx'
import useApp from './context/useApp.js'
import WelcomeScreen from './components/WelcomeScreen.jsx'
import SelectionScreen from './components/SelectionScreen.jsx'
import BFSScreen from './components/BFSScreen.jsx'
import DFSScreen from './components/DFSScreen.jsx'
import MissionariesScreen from './components/MissionariesScreen.jsx'
import CryptarithmeticScreen from './components/CryptarithmeticScreen.jsx'
import ThemeWrapper from './components/shared/ThemeWrapper.jsx'

function ScreenHost() {
  const { currentScreen, selectedProblem } = useApp()
  const key = currentScreen + (selectedProblem || '')
  return (
    <AnimatePresence mode="wait">
      <Motion.div
        key={key}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{ duration: 0.4 }}
        className="min-h-screen"
      >
        {currentScreen === 'welcome' && <WelcomeScreen />}
        {currentScreen === 'selection' && <SelectionScreen />}
        {currentScreen === 'problem' && (
          <ThemeWrapper problem={selectedProblem}>
            {selectedProblem === 'BFS' && <BFSScreen />}
            {selectedProblem === 'DFS' && <DFSScreen />}
            {selectedProblem === 'Missionaries' && <MissionariesScreen />}
            {selectedProblem === 'Cryptarithmetic' && <CryptarithmeticScreen />}
          </ThemeWrapper>
        )}
      </Motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <AppProvider>
      <ScreenHost />
    </AppProvider>
  )
}
