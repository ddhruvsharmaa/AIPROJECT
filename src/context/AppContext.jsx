import { useState, useMemo } from 'react'
import AppContext from './_ctx.js'

export function AppProvider({ children }) {
  const [userName, setUserName] = useState('')
  const [currentScreen, setCurrentScreen] = useState('welcome')
  const [selectedProblem, setSelectedProblem] = useState(null)

  const value = useMemo(
    () => ({
      userName,
      setUserName,
      currentScreen,
      setCurrentScreen,
      selectedProblem,
      setSelectedProblem,
    }),
    [userName, currentScreen, selectedProblem]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export default AppProvider
