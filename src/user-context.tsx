// src/playingNow-context.js
import * as React from 'react'
import { useState, useEffect } from 'react';


const UserContext = React.createContext(null)

// const spotifyOriginal = new Spotify()


export function UserProvider({ children }) {

  const [user, setUser] = useState(null);


  const isAuthenticated = false
  
  
  return (
    <UserContext.Provider value={{user, isAuthenticated}}>
        {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = React.useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}