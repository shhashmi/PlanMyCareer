import { createContext, useContext, useState } from 'react'

const AppContext = createContext()

export function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [profileData, setProfileData] = useState(null)
  const [skills, setSkills] = useState([])
  const [assessmentResults, setAssessmentResults] = useState(null)
  const [advancedResults, setAdvancedResults] = useState(null)
  const [upskillPlan, setUpskillPlan] = useState(null)

  const login = (userData) => {
    setUser(userData)
    setIsLoggedIn(true)
  }

  const logout = () => {
    setUser(null)
    setIsLoggedIn(false)
  }

  return (
    <AppContext.Provider value={{
      user,
      isLoggedIn,
      login,
      logout,
      profileData,
      setProfileData,
      skills,
      setSkills,
      assessmentResults,
      setAssessmentResults,
      advancedResults,
      setAdvancedResults,
      upskillPlan,
      setUpskillPlan
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}
